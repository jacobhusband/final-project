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
      postCreated: false,
      images: []
    };
    this.updateImgShowing = this.updateImgShowing.bind(this);
    this.swapImageSrc = this.swapImageSrc.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  createPost(event) {
    event.preventDefault();
    const caption = event.target.elements.formBasicCaption.value;
    const newPostInfo = { caption, images: this.state.images };
    const details = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Token': this.props.login.token
      },
      body: JSON.stringify(newPostInfo)
    };
    fetch(`api/post/${this.props.runId}`, details).then(res => res.json()).then(postCreated => {
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

    const direction = element.dataset.direction;
    const index = Number(element.dataset.currentOrder);
    const images = this.state.images;
    const placeholder = images[index];

    if (direction === 'left') {
      if (index === 0) {
        images[0] = images[2];
        images[2] = placeholder;
      } else {
        images[index] = images[index - 1];
        images[index - 1] = placeholder;
      }
    } else {
      if (index === 2) {
        images[2] = images[0];
        images[0] = placeholder;
      } else {
        images[index] = images[index + 1];
        images[index + 1] = placeholder;
      }
    }

    this.setState({
      images
    });
  }

  updateImgShowing(event) {
    const imgUrl = event.target.closest('.carousel-item').id;
    const images = [...this.state.images];
    const newImages = images.map(obj => {
      if (obj.url !== imgUrl) return obj;
      obj.on = !obj.on;
      return obj;
    });
    this.setState({
      images: newImages
    });
  }

  componentDidMount() {
    const details = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': this.props.login.token
      }
    };
    fetch(`/api/run/${this.props.login.user.accountId}/${this.props.runId}`, details).then(result => result.json()).then(runData => {
      const { beforeImageUrl, routeImageUrl, afterImageUrl } = runData;
      const images = ([
        { url: beforeImageUrl, on: true },
        { url: routeImageUrl, on: true },
        { url: afterImageUrl, on: true }
      ]);
      this.setState({
        runData,
        images
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.runData) return;
    if (!this.state.images.length) return;
    if (this.state.postCreated) return <Redirect to="home" />;

    const times = (
      <Button href="#saved" className="times text-dark">
        <div className='times-icon position-relative'>
          <FontAwesomeIcon icon={faTimes} size="xl" />
        </div>
      </Button>
    );

    const leftChevron = <FontAwesomeIcon icon={faChevronLeft} className='p-1' />;
    const rightChevron = <FontAwesomeIcon icon={faChevronRight} className='p-1' />;

    const plus = <FontAwesomeIcon icon={faPlus} />;
    const minus = <FontAwesomeIcon icon={faMinus} />;

    const images = this.state.images;
    const { ranAt, distance, time, pace } = this.state.runData;

    const now = new Date();
    const then = new Date(ranAt);

    const result = formatDistance(then, now, { includeSeconds: true, addSuffix: true });

    const carouselItems = images.map((obj, index) => {
      const icon = (obj.on) ? minus : plus;
      const modalClass = (obj.on) ? 'carousel-modal position-absolute hidden desktop-hidden' : 'carousel-modal position-absolute';
      return (
        <Carousel.Item key={obj.url} id={obj.url} className="text-light position-relative">
          <img src={obj.url} />
          <div className="swap-container d-flex align-items-center position-absolute">
            <button
              onClick={this.swapImageSrc}
              className='left text-light bg-dark'
              data-direction='left'
              data-current-order={index}>
              {leftChevron}
            </button>
            <p className='swap align-self-center mb-0 bg-dark'>SWAP</p>
            <button
              onClick={this.swapImageSrc}
              className='right text-light bg-dark'
              data-direction='right'
              data-current-order={index}>
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
