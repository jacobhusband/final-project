import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPersonRunning, faBolt, faCamera, faRotate, faCheck, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
const home = <FontAwesomeIcon icon={faHome} />;
const run = <FontAwesomeIcon icon={faPersonRunning} />;
const flash = <FontAwesomeIcon icon={faBolt} />;
const picture = <FontAwesomeIcon icon={faCamera} />;
const swap = <FontAwesomeIcon icon={faRotate} />;
const check = <FontAwesomeIcon icon={faCheck} />;
const retake = <FontAwesomeIcon icon={faRotateRight} />;

root.render(<App home={home} run={run} flash={flash} picture={picture} swap={swap} check={check} retake={retake} />);
