import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col, Image } from 'react-bootstrap';

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

    return (
      <div className='saved-runs'>
        <div className="text-end p-3 border-bottom border-secondary">
          {ellipsisV}
        </div>
        <Stack>
          {listItems}
        </Stack>
      </div>
    );
  }
}

function CreateSavedRunLi(savedRun) {
  return (
    <Container>
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
