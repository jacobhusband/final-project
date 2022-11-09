import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';
import { set } from 'idb-keyval';

const videoConstraints = {
  width: `${window.innerWidth}`,
  height: `${window.innerHeight * 0.66}`
};

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
  }

  storeImage(image) {
    set('preRunImage', image)
      .then(() => {
        this.setState({
          preRunImage: image
        });
      })
      .catch(err => console.error(`there is a ${err}`));
  }

  WebcamCapture() {
    const { flash, picture, swap } = this.props;
    const constraints = Object.assign({}, videoConstraints);
    constraints.facingMode = this.state.facingMode;
    return <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={constraints}
    >
      {({ getScreenshot }) => (
        <CameraButtons flash={flash} picture={picture} swap={swap} getScreenshot={getScreenshot} storeImage={this.storeImage} swapCamera={this.swapCamera} />
      )}
    </Webcam>;
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
    const { check, retake } = this.props;
    return (
      <>
        <img src={this.state.preRunImage} alt="Pre Run Image" />
        <PictureButtons check={check} retake={retake} retakePhoto={this.retakePhoto} />
      </>
    );
  }

  render() {
    let image;
    let headerText;
    if (this.state.preRunImage) {
      image = this.PhotoTaken();
      headerText = <p className='mb-0 d-flex row justify-content-center lh-lg h4 fw-bold' style={{ height: window.innerHeight * 0.08 }}>Look good?</p>;
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
  return (
    <div className='buttons' style={{ height: window.innerHeight * 0.08 }}>
      <button
        type="button"
        className='btn btn-primary'
        onClick={() => {
          props.storeImage(props.getScreenshot());
        }}
      >{props.picture}</button>
      <button
        type="button"
        className='btn btn-primary'
        onClick={() => {
          props.swapCamera();
        }}
      >{props.swap}</button>
    </div>
  );
}

function PictureButtons(props) {
  return (
    <div className='buttons' style={{ height: window.innerHeight * 0.08 }}>
      <button
        type="button"
        className='check btn btn-primary'
        onClick={() => {
        }}
      >{props.check}</button>
      <button
        type="button"
        className='retake btn btn-primary'
        onClick={() => {
          props.retakePhoto();
        }}
      >{props.retake}</button>
    </div>
  );
}
