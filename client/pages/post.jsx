import React from 'react';
import { Carousel, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import formatDistance from 'date-fns/formatDistance';
import Redirect from '../components/redirect';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: null,
      postCreated: false
    };
    this.updateImgShowing = this.updateImgShowing.bind(this);
    this.swapImageSrc = this.swapImageSrc.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  createPost(event) {
    event.preventDefault();
    const caption = event.target.elements.formBasicCaption.value;
    const runId = this.props.runId;
    const newPostInfo = Object.assign({}, this.props.postInfo);
    newPostInfo.caption = caption;
    newPostInfo.runId = runId;
    const details = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPostInfo)
    };
    fetch('api/posts', details).then(res => res.json()).then(postCreated => {
      this.setState({
        postCreated
      });
    }).catch(err => console.error(err));
  }

  swapImageSrc(event) {
    let element;

    if (event.target.tagName === 'path') {
      element = event.target.parentElement.parentElement;
    } else if (event.target.tagName === 'svg') {
      element = event.target.parentElement;
    } else {
      element = event.target;
    }

    const direction = (element.classList.contains('left')) ? 'left' : 'right';

    const id = element.closest('.carousel-item').id;

    const newPropsPostInfo = Object.assign({}, this.props.postInfo);
    let swapId;
    let tempId;

    if (direction === 'left') {
      if (newPropsPostInfo[`${id}Order`] === 1) {
        for (const key in newPropsPostInfo) {
          if (newPropsPostInfo[key] === 3) {
            swapId = key;
          }
        }
        newPropsPostInfo[`${id}Order`] = 3;
        newPropsPostInfo[swapId] = 1;
      } else {
        tempId = newPropsPostInfo[`${id}Order`];
        for (const key in newPropsPostInfo) {
          if (newPropsPostInfo[key] === tempId - 1) {
            swapId = key;
          }
        }
        newPropsPostInfo[`${id}Order`]--;
        newPropsPostInfo[swapId]++;
      }
    } else {
      if (newPropsPostInfo[`${id}Order`] === 3) {
        for (const key in newPropsPostInfo) {
          if (newPropsPostInfo[key] === 1) {
            swapId = key;
          }
        }
        newPropsPostInfo[`${id}Order`] = 1;
        newPropsPostInfo[swapId] = 3;
      } else {
        tempId = newPropsPostInfo[`${id}Order`];
        for (const key in newPropsPostInfo) {
          if (newPropsPostInfo[key] === tempId + 1) {
            swapId = key;
          }
        }
        newPropsPostInfo[`${id}Order`]++;
        newPropsPostInfo[swapId]--;
      }
    }

    this.props.updatePostInfo(newPropsPostInfo);
  }

  updateImgShowing(event) {
    const newPropsPostInfo = Object.assign({}, this.props.postInfo);
    const imgName = event.target.closest('.carousel-item').id;
    newPropsPostInfo[`${imgName}Showing`] = !(newPropsPostInfo[`${imgName}Showing`]);
    this.props.updatePostInfo(newPropsPostInfo);
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
    if (this.state.postCreated) return <Redirect to="home" />;

    const times = <Button href="#saved" className="times text-dark">
      <div className='times-icon position-relative'>
        <FontAwesomeIcon icon={faTimes} size="xl" />
      </div>
    </Button>;
    const leftChevron = <FontAwesomeIcon icon={faChevronLeft} className='p-1' />;
    const rightChevron = <FontAwesomeIcon icon={faChevronRight} className='p-1' />;
    const plus = <FontAwesomeIcon icon={faPlus} />;
    const minus = <FontAwesomeIcon icon={faMinus} />;

    const { beforeImageUrl, routeImageUrl, afterImageUrl } = this.state.runData;
    const { beforeImageUrlOrder, beforeImageUrlShowing, routeImageUrlOrder, routeImageUrlShowing, afterImageUrlOrder, afterImageUrlShowing } = this.props.postInfo;

    const beforeObj = { img: beforeImageUrl, order: beforeImageUrlOrder, showing: beforeImageUrlShowing, id: 'beforeImageUrl' };

    const routeObj = { img: routeImageUrl, order: routeImageUrlOrder, showing: routeImageUrlShowing, id: 'routeImageUrl' };

    const afterObj = { img: afterImageUrl, order: afterImageUrlOrder, showing: afterImageUrlShowing, id: 'afterImageUrl' };

    const imgArray = [beforeObj, routeObj, afterObj];
    const sortedImgArray = [];

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        if (imgArray[i].order === j + 1) {
          sortedImgArray.push(imgArray[i]);
          break;
        }
      }
    }

    const { ranAt, distance, time, pace } = this.state.runData;

    const now = new Date();
    const then = new Date(ranAt);

    const result = formatDistance(then, now, { includeSeconds: true, addSuffix: true });

    const carouselItems = sortedImgArray.map((obj, index) => {
      const icon = (obj.showing) ? minus : plus;
      const modalClass = (obj.showing) ? 'carousel-modal position-absolute hidden desktop-hidden' : 'carousel-modal position-absolute';
      return (
        <Carousel.Item key={index} order={obj.order} showing={obj.showing.toString()} id={obj.id} className="text-light position-relative">
          <img src={obj.img} />
          <div className="swap-container d-flex align-items-center position-absolute">
            <button onClick={this.swapImageSrc} className='left text-light bg-dark'>
              {leftChevron}
            </button>
            <p className='swap align-self-center mb-0 bg-dark'>SWAP</p>
            <button onClick={this.swapImageSrc} className='right text-light bg-dark'>
              {rightChevron}
            </button>
          </div>
          <div className='choose-container d-flex position-absolute'>
            <button onClick={this.updateImgShowing} className='text-light bg-dark'>
              {icon}
            </button>
          </div>
          <div className={modalClass} />
        </Carousel.Item>
      );
    });

    return (
      <div className='new-post'>
        <Container className="outer">
          <Row>
            <Col xs={3} md={3} />
            <Col xs={6} md={6} className="text-center mt-3 mb-2">
              <h3 className='mb-0 mt-0'>New Post</h3>
            </Col>
            <Col xs={2} md={2} className="text-end p-1 mt-2 fw-bold">
              {times}
            </Col>
          </Row>
        </Container>
        <Container className="outer">
          <Carousel interval={null}>
            {carouselItems}
          </Carousel>
        </Container>
        <Container className='text-center outer'>
          <Row className='desktop-row medium mt-2'>
            <Col xs={0} md={5}>
              <p className='mb-1 secondary text-secondary desktop-text-left hidden'>{result}</p>
            </Col>
            <Col xs={12} md={7} className="text-secondary desktop-text-right">
              <p className='mb-0'>{distance} miles {time} time {pace} pace</p>
            </Col>
          </Row>
          <Form onSubmit={this.createPost}>
            <Row>
              <Col>
                <Form.Group className="mb-1 mt-1 text-start" controlId="formBasicCaption">
                  <Form.Control as="textarea" placeholder="enter a description" required rows={5} />
                </Form.Group>
              </Col>
            </Row>
            <Row className='desktop-row medium mt-0'>
              <Col xs={3} className="text-start mt-1">
                <Button type="submit">Post</Button>
              </Col>
              <Col xs={9}>
                <p className='mb-1 secondary text-secondary small desktop-hidden text-end'>saved {result}</p>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}
