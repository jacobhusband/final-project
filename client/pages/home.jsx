import React from 'react';
import Navbar from '../components/navbar';
import RunInfo from '../components/runInfo';
import { Container, Carousel, Modal, Button } from 'react-bootstrap';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import DropdownCustom from '../components/dropdown';
import Like from '../components/like';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      modalShowing: false
    };
    this.removePost = this.removePost.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  hideModal() {
    this.setState({
      modalShowing: false
    });
  }

  showModal() {
    this.setState({
      modalShowing: true
    });
  }

  updatePosts() {
    let posts = this.state.posts;
    posts = posts.filter(x => x.postId !== parseInt(this.props.postId));
    this.setState({
      posts
    });
  }

  removePost() {
    const postId = this.props.postId;
    const details = {
      method: 'DELETE',
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch(`/api/post/${postId}`, details).then(result => result.json()).then(post => {
      this.hideModal();
      this.updatePosts();
    }).catch(err => console.error(err));
  }

  componentDidMount() {
    const details = {
      method: 'GET',
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch('/api/posts', details).then(result => result.json()).then(posts => {
      this.setState({
        posts
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.posts) return;

    const options = [
      { href: '#edit', text: 'Edit' },
      { href: '#home', text: 'Remove' }
    ];

    let imgSrc, postData;

    const posts = this.state.posts.map((post, index) => {
      postData = post;
      let carouselItems = post.images.map(image => {
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
              <Like login={this.props.login} />
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
    });

    return (
      <div className="home-page" >
        <Navbar />
        {posts}
        <RemovePostModal
          show={this.state.modalShowing}
          onHide={this.hideModal}
          confirm={this.removePost}
        />
      </div>
    );
  }
}

function RemovePostModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Remove Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to remove this post? This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.confirm}>Delete</Button>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}
