import React from 'react';
import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import DropdownCustom from '../components/dropdown';
import formatDistance from 'date-fns/formatDistance';

export default class Saved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedSavedRuns: false
    };
  }

  componentDidMount() {
    this.props.resetSavedImages();
    const details = {
      method: 'GET',
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch(`/api/runs/${this.props.login.user.accountId}`, details).then(result => result.json()).then(runObj => {
      this.setState({
        receivedSavedRuns: runObj
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.receivedSavedRuns) return;

    const options = [
      { href: '#home', text: 'Home' }
    ];

    const listItems = this.state.receivedSavedRuns.map(savedRun => {
      return <CreateSavedRunLi key={savedRun.runId} savedRun={savedRun} saveRunId={this.props.saveRunId} />;
    });

    return (
      <div className='saved-runs'>
        <div className="text-end p-3 border-bottom border-secondary">
          <DropdownCustom direction="vertical" options={options} />
        </div>
        <Stack>
          {listItems}
        </Stack>
      </div >
    );
  }
}

function CreateSavedRunLi(props) {
  const { ranAt, distance, time, pace } = props.savedRun;

  const now = new Date();
  const then = new Date(ranAt);

  const result = formatDistance(then, now, { includeSeconds: true, addSuffix: true });

  return (
    <Container id={props.savedRun.runId}>
      <Row className='desktop-row small mt-1'>
        <Col xs={0} md={5}>
          <p className='mb-0 secondary text-secondary desktop-text-left hidden'>{result}</p>
        </Col>
        <Col xs={12} md={7} className="text-secondary desktop-text-right">
          <p className='mb-0'>{distance} miles {time} time {pace} pace</p>
        </Col>
      </Row>
      <Row className='desktop-row small'>
        <Col>
          <p className='mb-1 secondary text-secondary desktop-hidden'>{result}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Image src={props.savedRun.beforeImageUrl} fluid="true" rounded="true" />
        </Col>
        <Col>
          <Image src={props.savedRun.routeImageUrl} fluid="true" rounded="true" />
        </Col>
        <Col className="hidden">
          <Image src={props.savedRun.afterImageUrl} fluid="true" rounded="true" />
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Button variant='link' onClick={() => { props.saveRunId(props.savedRun.runId); }} href="#post">Post</Button>
        </Col>
      </Row>
    </Container>
  );
}
