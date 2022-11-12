import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';
import { b64toFile } from 'b64-to-file';
import { set } from 'idb-keyval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faRotate, faCheck, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

const videoConstraints = {
  width: `${window.innerWidth}`,
  height: `${window.innerHeight * 0.66}`
};
const camera = <FontAwesomeIcon icon={faCamera} />;
const swap = <FontAwesomeIcon icon={faRotate} />;
const check = <FontAwesomeIcon icon={faCheck} />;
const retake = <FontAwesomeIcon icon={faRotateRight} />;

export default class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: false,
      facingMode: 'user'
    };
    this.storeImage = this.storeImage.bind(this);
    this.retakePhoto = this.retakePhoto.bind(this);
    this.swapCamera = this.swapCamera.bind(this);
    this.indexImage = this.indexImage.bind(this);
  }

  storeImage(getScreenshot) {
    const image = getScreenshot();
    this.setState({
      image
    });
  }

  indexImage() {
    const form = new FormData();
    const image = b64toFile(this.state.image, 'runImage');
    form.append('image', image);
    const details = {
      method: 'POST',
      body: form
    };
    fetch('/api/uploads', details)
      .then(res => res.json())
      .then(obj => {
        if (this.props.to === 'pre') {
          set('preImage', obj.url)
            .then(() => {
            })
            .catch(err => console.error(`there is a ${err}`));
        } else if (this.props.to === 'post') {
          set('postImage', obj.url)
            .then(() => {
            })
            .catch(err => console.error(`there is a ${err}`));
        }
      })
      .catch(err => console.error(err));
  }

  retakePhoto() {
    this.setState({
      image: null
    });
  }

  swapCamera() {
    (this.state.facingMode === 'user')
      ? this.setState({
        facingMode: { exact: 'environment' }
      })
      : this.setState({
        facingMode: 'user'
      });
  }

  PhotoTaken() {
    let checkRef;

    if (this.props.to === 'pre') {
      checkRef = '#timer';
    } else {
      checkRef = '#stats';
    }

    return (
      <>
        <img src={this.state.image} alt="Pre Run Image" />
        <PictureButtons onRetakeClick={this.retakePhoto} onIndexClick={this.indexImage} checkRef={checkRef} />
      </>
    );
  }

  WebcamCapture() {
    const constraints = Object.assign({}, videoConstraints);
    constraints.facingMode = this.state.facingMode;
    return <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={constraints}
    >
      {({ getScreenshot }) => (
        <CameraButtons getScreenshot={getScreenshot} onStoreClick={this.storeImage} onSwapClick={this.swapCamera} />
      )}
    </Webcam>;
  }

  render() {
    let image;
    let headerText;
    if (this.state.image && this.props.to === 'pre') {
      image = this.PhotoTaken();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Look good?</p>;
    } else if (!this.state.image && this.props.to === 'pre') {
      image = this.WebcamCapture();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Take a pre-exercise photo</p>;
    } else if (this.state.image && this.props.to === 'post') {
      image = this.PhotoTaken();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Look good?</p>;
    } else if (!this.state.image && this.props.to === 'post') {
      image = this.WebcamCapture();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Take a post-exercise photo</p>;
    }

    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        {headerText}
        <div className='camera-container'>
          {image}
        </div>
      </div>
    );
  }
}

function CameraButtons(props) {
  const { onStoreClick, onSwapClick } = props;

  return (
    <div className='buttons align-middle' style={{ height: window.innerHeight * 0.08 }}>
      <Button
        className='m-2'
        onClick={() => {
          onStoreClick(props.getScreenshot);
        }}
      >{camera}</Button>
      <Button
        onClick={onSwapClick}
      >{swap}</Button>
    </div>
  );
}

function PictureButtons(props) {
  const { onIndexClick, onRetakeClick, checkRef } = props;

  return (
    <div className='buttons align-middle mt-2' style={{ height: window.innerHeight * 0.08 }}>
      <Button
        className="m-2"
        href={checkRef}
        onClick={onIndexClick}
      >{check}</Button>
      <Button
        onClick={onRetakeClick}
      >{retake}</Button>
    </div>
  );
}
