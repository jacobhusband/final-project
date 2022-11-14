import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col, Image, Dropdown } from 'react-bootstrap';
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
    fetch('/api/runs').then(result => result.json()).then(runObj => {
      this.setState({
        receivedSavedRuns: runObj
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.receivedSavedRuns) return;

    const ellipsisV = <FontAwesomeIcon icon={faEllipsisV} size="xl" />;
    const listItems = this.state.receivedSavedRuns.map(savedRun => {
      return CreateSavedRunLi(savedRun);
    });

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
        ref={ref}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
        className='text-dark p-2'
      >
        {ellipsisV}
        {children}
      </a>
    ));

    CustomToggle.displayName = 'Ellipsis Dropdown';

    return (
      <div className='saved-runs'>
        <div className="text-end p-3 border-bottom border-secondary">
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu size="sm" title="">
              <Dropdown.Header>Options</Dropdown.Header>
              <Dropdown.Item href="#home">Home</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Stack>
          {listItems}
        </Stack>
      </div >
    );
  }
}

function CreateSavedRunLi(savedRun) {
  const { ranAt, distance, time, pace } = savedRun;

  const now = new Date();
  const then = new Date(ranAt);

  const result = formatDistance(then, now, { includeSeconds: true, addSuffix: true });

  return (
    <Container key={savedRun.runId}>
      <Row className='desktop-row small mt-1'>
        <Col xs={0} md={5}>
          <p className='mb-1 secondary text-secondary desktop-text-left hidden'>{result}</p>
        </Col>
        <Col xs={12} md={7} className="text-secondary desktop-text-right">
          <p className='mb-1'>{distance} miles {time} time {pace} pace</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Image src={savedRun.beforeImageUrl} fluid="true" rounded="true" />
        </Col>
        <Col>
          <Image src={savedRun.routeImageUrl} fluid="true" rounded="true" />
        </Col>
        <Col className="hidden">
          <Image src={savedRun.afterImageUrl} fluid="true" rounded="true" />
        </Col>
      </Row>
      <Row className='desktop-row small mt-1'>
        <Col>
          <p className='mb-1 secondary text-secondary desktop-hidden'>{result}</p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center" />
      </Row>
    </Container>
  );
}
