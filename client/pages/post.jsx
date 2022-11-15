import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: null
    };
  }

  componentDidMount() {
    fetch(`/api/run/${this.props.runId}`).then(result => result.json()).then(runData => {
      this.setState({
        runData
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.runData) return;

    const times = <FontAwesomeIcon icon={faTimes} size="xl" />;
    const leftChevron = <FontAwesomeIcon icon={faChevronLeft} className='p-1' />;
    const rightChevron = <FontAwesomeIcon icon={faChevronRight} className='p-1' />;
    const plus = <FontAwesomeIcon icon={faPlus} />;
    const minus = <FontAwesomeIcon icon={faMinus} />;

    return (
      <div className='new-post'>
        <Row>
          <Col xs={3} md={3} />
          <Col xs={6} md={6} className="text-center mt-2 mb-2">
            <h3 className='mb-0 mt-0 fw-normal'>New Post</h3>
          </Col>
          <Col xs={2} md={2} className="text-end p-1 mt-1 fw-bold">
            {times}
          </Col>
        </Row>
        <Carousel interval={null}>
          <Carousel.Item className="text-light position-relative">
            <img src={this.state.runData.beforeImageUrl} />
            <div className="swap-container d-flex align-items-center position-absolute">
              <button className='left text-light bg-dark'>
                {leftChevron}
              </button>
              <p className='swap align-self-center mb-0 bg-dark'>SWAP</p>
              <button className='right text-light bg-dark'>
                {rightChevron}
              </button>
            </div>
            <div className='choose-container d-flex position-absolute'>
              <button className='text-light bg-dark'>
                {minus}
                {plus}
              </button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img src={this.state.runData.routeImageUrl} />
          </Carousel.Item>
          <Carousel.Item>
            <img src={this.state.runData.afterImageUrl} />
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}
