import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';
import { set } from 'idb-keyval';

const videoConstraints = {
  width: `${window.innerWidth}`,
  height: `${window.innerHeight * 0.705}`,
  facingMode: 'user'
};

export default class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preRunImage: false
    };
    this.storeImage = this.storeImage.bind(this);
    this.retakePhoto = this.retakePhoto.bind(this);
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
    return <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    >
      {({ getScreenshot }) => (
        <CameraButtons flash={flash} picture={picture} swap={swap} getScreenshot={getScreenshot} storeImage={this.storeImage} />
      )}
    </Webcam>;
  }

  retakePhoto() {
    this.setState({
      preRunImage: null
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
      headerText = <p className='lh-lg h4 fw-bold mt-5 mb-5'>Look good?</p>;
    } else {
      image = this.WebcamCapture();
      headerText = <p className='lh-lg h4 fw-bold mt-5 mb-5'>Take a pre-exercise photo</p>;
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
    <div className='buttons'>
      <button
        type="button"
        className='btn btn-primary'
        onClick={() => {
        }}
      >{props.flash}</button>
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
        }}
      >{props.swap}</button>
    </div>
  );
}

function PictureButtons(props) {
  return (
    <div className='buttons'>
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
