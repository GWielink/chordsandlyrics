import React, { Component } from 'react';
import styled from 'styled-components';
import { Row, Col, Input } from 'antd';
import 'antd/dist/antd.css';

import parse from './parse';

const { TextArea } = Input;

const Container = styled.div`
    padding: 50px;
`;

export default class App extends Component {
    constructor () {
        super();

        this.state = {
            data: '',
            title: '',
            artist: '',
        }
    }

    onChangeData = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    render () {
        const { artist, title, data } = this.state;
        return (
            <Container>
                <Row gutter={20}>
                    <Col span={6}>
                        <Input
                            value={title} placeholder='Title'
                            onChange={({ target: { value }}) => this.onChangeData('title', value)}
                        />
                    </Col>
                    <Col span={6}>
                        <Input
                            onChange={({ target: { value }}) => this.onChangeData('artist', value)}
                            value={artist} placeholder='Artist'
                        />
                    </Col>
                    <Col span={12}>
                        <h1>{`${title || 'Title'} - ${artist || 'Artist'}`}</h1>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={12}>
                        <TextArea
                            onChange={({ target: { value }}) => this.onChangeData('data', value)}
                            value={data}
                            autosize
                        />
                    </Col>
                    <Col span={12}>
                        <TextArea
                            value={parse(data, title, artist)}
                            style={{
                                backgroundColor: '#efefef',
                                color: 'black',
                            }}
                            autosize
                            disabled
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}