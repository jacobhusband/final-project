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
  // const { ranAt, distance, time, pace } = savedRun;

  // let currentTime = new Date().toLocaleString('en-US', { hour12: false }).split(',');

  // const times = ranAt.split('T');
  // const date = times[0];
  // const clockTime = times[1].split('.')[0];

  // findTimeDifference(currentTime[0], currentTime[1].slice(1), date, clockTime)

  return (
    <Container key={savedRun.runId}>
      <Row>
        <Col>
          <Image src={savedRun.beforeImageUrl} fluid="true" rounded="true" />
        </Col>
        <Col>
          <Image src={savedRun.routeImageUrl} alt="" />
        </Col>
      </Row>
    </Container>
  );
}

// function findTimeDifference(currDate, currTime, date, time) {
//   // const splitCurrDate = currDate.split('/');
//   // const organizedCurrDate = [splitCurrDate[2], splitCurrDate[0], splitCurrDate[1]];
//   // const splitOldDate = date.split('-');
// }
