import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: `${window.innerWidth}`,
  height: `${window.innerHeight * 0.705}`,
  facingMode: 'user'
};

export default class Photo extends React.Component {

  WebcamCapture() {
    const { flash, picture, swap } = this.props;
    return <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    >
      {({ getScreenshot }) => (
        <CameraButtons flash={flash} picture={picture} swap={swap} getScreenshot={getScreenshot} />
      )}
    </Webcam>;
  }

  render() {
    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        <p className='lh-lg h4 fw-bold mt-5 mb-5'>Take a pre-exercise photo</p>
        <div className='camera-container'>
          {this.WebcamCapture()}
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
          props.getScreenshot();
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
