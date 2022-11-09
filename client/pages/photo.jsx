import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';
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
      preRunImage: false,
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
      preRunImage: image
    });
  }

  indexImage() {
    set('preRunImage', this.state.preRunImage)
      .then(() => {
      })
      .catch(err => console.error(`there is a ${err}`));
  }

  retakePhoto() {
    this.setState({
      preRunImage: null
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
    return (
      <>
        <img src={this.state.preRunImage} alt="Pre Run Image" />
        <PictureButtons onRetakeClick={this.retakePhoto} onIndexClick={this.indexImage} />
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
    if (this.state.preRunImage) {
      image = this.PhotoTaken();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Look good?</p>;
    } else {
      image = this.WebcamCapture();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold align-items-center' style={{ height: window.innerHeight * 0.08 }}>Take a pre-exercise photo</p>;
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
  const { onIndexClick, onRetakeClick } = props;

  return (
    <div className='buttons align-middle mt-2' style={{ height: window.innerHeight * 0.08 }}>
      <Button
        className="m-2"
        href="#"
        onClick={onIndexClick}
      >{check}</Button>
      <Button
        onClick={onRetakeClick}
      >{retake}</Button>
    </div>
  );
}
