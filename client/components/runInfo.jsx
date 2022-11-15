import React from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { Container, Row, Col } from 'react-bootstrap';

export default class RunInfo extends React.Component {

  render() {
    const { ranAt, distance, time, pace } = this.props.postData;
    const now = new Date();
    const then = new Date(ranAt);
    const result = formatDistanceStrict(then, now, { includeSeconds: true, addSuffix: true });

    return (
      <Container className='run-info text-center'>
        <Row className='desktop-row mt-1'>
          <Col xs={4} md={5}>
            <p className='mb-1 secondary text-secondary desktop-text-left'>{result}</p>
          </Col>
          <Col xs={8} md={7} className="text-secondary desktop-text-right">
            <p className='mb-0'>{distance} miles {time} time {pace} pace</p>
          </Col>
        </Row>
      </Container>
    );
  }
}
