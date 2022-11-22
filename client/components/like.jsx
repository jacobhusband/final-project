import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

export default class Like extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false
    };
    this.likeOrUnlikePost = this.likeOrUnlikePost.bind(this);
  }

  likeOrUnlikePost(event) {
    const target = (event.target.tagName === 'path')
      ? event.target.parentElement.parentElement
      : (event.target.tagName === 'svg')
          ? event.target.parentElement
          : event.target;
    const postId = target.getAttribute('postid');
    const method = (this.state.liked) ? 'DELETE' : 'POST';
    const details = {
      method,
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch(`/api/like/${postId}`, details).then(res => {
      if (res.status < 400) {
        this.setState({
          liked: !this.state.liked
        }, () => {
          this.props.updateLikes(this.state.liked);
        });
      }
    }).catch(err => console.error(err));
  }

  componentDidMount() {
    if (this.props.likes) {
      for (const like of this.props.likes) {
        if (like === this.props.username) {
          this.setState({
            liked: true
          });
          return;
        }
      }
    }
  }

  render() {
    const heart = (this.state.liked)
      ? <FontAwesomeIcon icon={faHeart} />
      : <FontAwesomeIcon icon={farHeart} />;

    return (
      <Button variant="link" postid={this.props.postid} className='p-0 m-0 text-dark' onClick={this.likeOrUnlikePost}>{heart}</Button>
    );
  }
}
