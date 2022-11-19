import React from 'react';
import Like from './like';
import RunInfo from './runInfo';
import DropdownCustom from './dropdown';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { Carousel, Container } from 'react-bootstrap';

export default class Post extends React.Component {

  render() {

    const options = [
      { href: '#edit', text: 'Edit' },
      { href: '#home', text: 'Remove' }
    ];

    let imgSrc;
    const postData = this.props.postData;

    let carouselItems = postData.images.map(image => {
      if (image.on) {
        imgSrc = image.url;
        return (
          <Carousel.Item key={image.url} id={image.url} className="text-light position-relative">
            <img src={image.url} />
          </Carousel.Item>
        );
      } else {
        return null;
      }
    });

    let likedNames = (postData.likes.length) && `liked by ${postData.likes[0]}`;

    if (postData.likes.length > 1 && postData.likes.length < 5) {
      for (let i = 1; i < postData.likes.length; i++) {
        likedNames += `, ${postData.likes[i]}`;
      }
    }

    carouselItems = carouselItems.filter(x => x !== null);

    const dropdown = (postData.accountId === this.props.login.user.accountId)
      ? (
        <DropdownCustom direction="horizontal" options={options} saveRunId={this.props.saveRunId} savePostId={this.props.savePostId} showModal={this.showModal} />
        )
      : (
          null
        );

    const carousel = (carouselItems.length !== 1)
      ? <Carousel interval={null}>{carouselItems}</Carousel>
      : <div className='single-image-post'><img src={imgSrc} /></div>;

    const now = new Date();
    const then = new Date(postData.postedAt);
    const result = formatDistanceStrict(then, now, { includeSeconds: true, addSuffix: true });

    return (
      <Container className="outer" key={postData.postId} runid={postData.runId} postid={postData.postId}>
        <div className='d-flex'>
          <p className='desktop-username m-2 mb-1 ps-3'>{postData.username}</p>
          <div className='ms-auto dropdown-ellipsis align-self-center me-3'>
            {dropdown}
          </div>
        </div>
        {carousel}
        <RunInfo key={postData.postId} postData={postData} />
        <Container className='mt-1 mb-3'>
          <div className='icons'>
            <p className='small mb-0 text-secondary'>{likedNames}</p>
            <Like login={this.props.login} likes={postData.likes} username={postData.username} />
          </div>
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
  }
}
