function parse (data) {
    return data
        .split('\n')
        .map(line => ({
        line,
        isEmpty: /^\s*$/.test(line),
        isTitle: (/^#.*$/.test(line) || /^\[(.*)]$/.test(line)),
        isChords: /^\s*(\[?([A-G][mb+\d]*#?)(\s*\/\s*)?([A-G]#?)?\s*(?![a-g])\]?)+$/.test(line),
    }));
}

function decorateTitle (line, decorator="\\textbf{$1}") {

    return line.replace(/^\[(.*)]$/, '#$1').replace(/^#\s*(.*)$/, decorator);
}

function decorateLineWithChords(lyricsLine, chordsLine) {
    let decoratedLyricsLine = lyricsLine;
    let _chordsLine = chordsLine;

    const chords = chordsLine
        .replace(/\s+$/, "") // strip whitespace of the end
        .replace(/^\s+/, "") // strip whitespace of the start
        .split(/\s+/)
        .reverse(); // reverse so we can go at it from the back to prevent messing up the indexes
    chords.forEach(chord => {
        const index = _chordsLine.lastIndexOf(chord);
        _chordsLine = _chordsLine.slice(0, index);


        decoratedLyricsLine = [
            decoratedLyricsLine.slice(0, index),
            `\\chord{${chord}}`,
            decoratedLyricsLine.slice(index),
            ].join("")

    });

    return decoratedLyricsLine;
}

export default function decorate (data, title, artist) {
    const res =  parse(data)
        .map(({line, isEmpty, isTitle, isChords, chords}, index, array) => {

            console.log(isChords);
            if(isEmpty) {
                return "";
            }

            if(isTitle) {
                return decorateTitle(line);
            }

            // Chords with no lyrics on the next line
            if (isChords && (index + 1 === array.length || array[index + 1].isEmpty || array[index + 1].isChords)) {
                return line;
            }

            // Line contains chords and next line contains lyrics
            // Will be handled on the next line, return false so we can filter it out later
            if (isChords) {
                return false;
            }

            // Lyrics line with chords on the line above
            if (index > 0 && array[index - 1].isChords) {
                return decorateLineWithChords(line, array[index - 1].line);
            }

            return line;
        })
        // remove lines which previously held chords
        .filter(line => line !== false)
        // provide linebreaks where needed
        .map((line, index, array) => (
            (index + 1) === array.length ? line : `${line} \\\\ \n`
        ))
        .join("");

    return `\\chapter*{${title} - ${artist}} \n \\begin{Verse*} \n ${res} \n \\end{Verse*}`
}
