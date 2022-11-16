import React from 'react';
import Navbar from '../components/navbar';
import RunInfo from '../components/runInfo';
import { Container, Carousel } from 'react-bootstrap';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: null
    };
  }

  componentDidMount() {
    fetch('/api/posts').then(result => result.json()).then(postData => {
      this.setState({
        postData
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.postData) return;

    const posts = this.state.postData.map(postData => {

      const { beforeImageUrl, routeImageUrl, afterImageUrl, beforeImageUrlOrder, beforeImageUrlShowing, routeImageUrlOrder, routeImageUrlShowing, afterImageUrlOrder, afterImageUrlShowing, ranAt } = postData;

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

      let imgSrc;
      let carouselItems = sortedImgArray.map((obj, index) => {
        if (obj.showing) {
          imgSrc = obj.img;
          return (
            <Carousel.Item key={index} order={obj.order} showing={obj.showing.toString()} id={obj.id} className="text-light position-relative">
              <img src={imgSrc} />
            </Carousel.Item>
          );
        } else {
          return null;
        }
      });

      carouselItems = carouselItems.filter(x => x !== null);

      const carousel = (carouselItems.length !== 1)
        ? <Carousel interval={null}>{carouselItems}</Carousel>
        : <div className='single-image-post'><img src={imgSrc} /></div>;

      const now = new Date();
      const then = new Date(ranAt);
      const result = formatDistanceStrict(then, now, { includeSeconds: true, addSuffix: true });

      return (
        <Container className="outer" key={postData.postId}>
          <div>
            <p className='desktop-username m-2 mb-1 ps-3'>{postData.username}</p>
          </div>
          {carousel}
          <RunInfo key={postData.postId} postData={postData} />
          <Container className='mt-1 mb-3'>
            <div className='d-flex'>
              <p className='small mb-0'>{postData.username}</p>
              <p className='small ps-2 mb-0'>{postData.caption}</p>
            </div>
            <div>
              <p className='small mb-0'>{result}</p>
            </div>
          </Container>
        </Container>
      );
    });

    return (
      <div className="home-page" >
        <Navbar />
        {posts}
      </div>
    );
  }
}
