import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
const home = <FontAwesomeIcon icon={faHome} />;
const run = <FontAwesomeIcon icon={faPersonRunning} />;

root.render(<App home={home} run={run} />);
