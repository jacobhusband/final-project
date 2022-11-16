import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default class RunInfo extends React.Component {

  render() {
    const { distance, time, pace } = this.props.postData;

    return (
      <Container className='run-info text-center'>
        <Row className='desktop-row mt-2'>
          <Col className="text-secondary desktop-text-right">
            <p className='desktop-mileage mb-0'>{distance} miles {time} time {pace} pace</p>
          </Col>
        </Row>
      </Container>
    );
  }
}
