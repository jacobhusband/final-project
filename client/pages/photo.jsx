import React from 'react';
import Navbar from '../components/navbar';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: `${window.innerWidth}`,
  height: `${window.innerHeight - 250}`,
  facingMode: 'user'
};

export default class Photo extends React.Component {

  WebcamCapture() {
    return <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    >
      {({ getScreenshot }) => (
        <button
          onClick={() => {
            getScreenshot();
          }}
        >
          Capture photo
        </button>
      )}
    </Webcam>;
  }

  render() {
    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        <p className='lh-lg h4 fw-bold mt-5'>Take a pre-exercise photo</p>
        <div className='camera-container'>
          {this.WebcamCapture()}
        </div>
      </div>
    );
  }
}
