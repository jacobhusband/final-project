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
    const postId = event.target.closest('.outer.container').getAttribute('postId');
    const method = (this.state.liked) ? 'DELETE' : 'POST';
    const details = {
      method,
      headers: {
        'X-Access-Token': this.props.login.token
      }
    };
    fetch(`/api/like/${postId}`, details).then(res => {
      if (res.status < 400) {
        if (this.state.liked) {
          this.setState({
            liked: false
          });
        } else {
          this.setState({
            liked: true
          });
        }
      }
    }).catch(err => console.error(err));
  }

  render() {
    const heart = (this.state.liked)
      ? <FontAwesomeIcon icon={faHeart} />
      : <FontAwesomeIcon icon={farHeart} />;

    return (
      <Button variant="link" className='p-0 m-0 text-dark' onClick={this.likeOrUnlikePost}>{heart}</Button>
    );
  }
}
