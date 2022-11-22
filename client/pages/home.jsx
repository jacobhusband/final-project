import React from 'react';
import Navbar from '../components/navbar';
import { Modal, Button } from 'react-bootstrap';
import Post from '../components/post';

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
    this.setState({
      posts: []
    });
  }

  render() {
    if (!this.state.posts) return;

    const posts = this.state.posts.map(post => <Post key={post.postId} postData={post} login={this.props.login} saveRunId={this.props.saveRunId} savePostId={this.props.savePostId} showModal={this.showModal} />).sort((a, b) => (a.props.postData.postedAt < b.props.postData.postedAt) ? 1 : -1);

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
