import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col, Image, Dropdown } from 'react-bootstrap';

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
        className='text-dark'
      >
        {ellipsisV}
        {children}
      </a>
    ));

    CustomToggle.displayName = 'Ellipsis Dropdown';

    return (
      <div className='saved-runs'>
        <div className="text-end p-3 border-bottom border-secondary">
          <Dropdown >
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

  const currentTime = new Date().toLocaleString('en-US', { hour12: false }).split(',');

  const times = ranAt.split('T');
  const date = times[0];
  const clockTime = times[1].split('.')[0];

  const timeDiff = findTimeDifference(currentTime[0], currentTime[1].slice(1), date, clockTime);

  return (
    <Container key={savedRun.runId}>
      <Row className='desktop-row small mt-1'>
        <Col xs={4}>
          <p className='mb-1 secondary text-secondary desktop-text-left'>{timeDiff}</p>
        </Col>
        <Col xs={8} className="text-end text-secondary desktop-text-right">
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
      <Row>
        <Col className="text-center" />
      </Row>
    </Container>
  );
}

function findTimeDifference(currDate, currTime, date, time) {
  let timeSinceRan = 0;
  let text;
  const splitCurrDate = currDate.split('/');
  const organizedCurrDate = [splitCurrDate[2], splitCurrDate[0], splitCurrDate[1]];
  const splitOldDate = date.split('-');
  const [currYear, currMonth, currDay] = organizedCurrDate.map(date => parseInt(date));
  const [ranYear, ranMonth, ranDay] = splitOldDate.map(date => parseInt(date));
  const [currHour, currMinute, currSecond] = currTime.split(':').map(time => parseInt(time));
  const [ranHour, ranMinute, ranSecond] = time.split(':').map(time => parseInt(time));

  if (currYear !== ranYear) {
    [timeSinceRan, text] = findSubTimeDifference(currYear, ranYear, currMonth, ranMonth, 'year', 'month', 12);
  } else if (currMonth !== ranMonth) {
    [timeSinceRan, text] = findSubTimeDifference(currMonth, ranMonth, currDay, ranDay, 'month', 'day', 30);
  } else if (currDay !== ranDay) {
    [timeSinceRan, text] = findSubTimeDifference(currDay, ranDay, currHour, ranHour, 'day', 'hour', 24);
  } else if (currHour !== ranHour) {
    [timeSinceRan, text] = findSubTimeDifference(currHour, ranHour, currMinute, ranMinute, 'hour', 'minute', 60);
  } else if (currMinute !== ranMinute) {
    [timeSinceRan, text] = findSubTimeDifference(currMinute, ranMinute, currSecond, ranSecond, 'minute', 'second', 60);
  } else {
    timeSinceRan = currSecond - ranSecond;
    text = 'second';
  }

  if (timeSinceRan === 1) {
    timeSinceRan += ` ${text} ago`;
  } else {
    timeSinceRan += ` ${text}s ago`;
  }

  return timeSinceRan;
}

function findSubTimeDifference(currLong, pastLong, currShort, pastShort, longTime, shortTime, time) {
  let text;
  let timeSinceRan;
  if (currLong - pastLong === 1) {
    text = shortTime;
    if (currShort < pastShort) {
      timeSinceRan = currShort + (time - pastShort);
    } else {
      timeSinceRan = 1;
      text = longTime;
    }
  } else {
    timeSinceRan = currLong - pastLong;
    text = longTime;
  }
  return [timeSinceRan, text];
}
