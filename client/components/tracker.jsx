import React from 'react';
import Button from 'react-bootstrap/Button';
import Message from '../components/message';
import NoSleep from 'nosleep.js';
import { set, update } from 'idb-keyval';
import Redirect from './redirect';

const noSleep = new NoSleep();

export default class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      timerId: null,
      coordId: null,
      phase: 'start'
    };
    this.setTimeInterval = this.setTimeInterval.bind(this);
    this.increaseTime = this.increaseTime.bind(this);
    this.pauseTime = this.pauseTime.bind(this);
    this.stopRun = this.stopRun.bind(this);
    this.endRun = this.endRun.bind(this);
    this.restartIntervals = this.restartIntervals.bind(this);
  }

  setTimeInterval() {
    this.triggerNoSleep();
    this.findPosition();
    const latlng = [];
    set('latlng', latlng)
      .then(() => {
        this.setState({
          coordId: setInterval(this.findPosition, 3000),
          timerId: setInterval(this.increaseTime, 1000),
          phase: 'during'
        });
      })
      .catch(err => console.error(err));
  }

  restartIntervals() {
    this.setState({
      timerId: setInterval(this.increaseTime, 1000),
      coordId: setInterval(this.findPosition, 3000),
      phase: 'during'
    });
  }

  increaseTime() {
    const time = this.state.time;
    this.setState({
      time: time + 1
    });
  }

  pauseTime() {
    clearInterval(this.state.timerId);
    clearInterval(this.state.coordId);
    this.setState({
      timerId: null,
      coordId: null,
      phase: 'paused'
    });
  }

  stopRun() {
    clearInterval(this.state.timerId);
    clearInterval(this.state.coordId);
    this.setState({
      timerId: null,
      coordId: null,
      phase: 'finished'
    });
  }

  endRun() {
    noSleep.disable();
    this.stopRun();
    this.findPosition();
    this.setState({
      phase: 'end'
    });
  }

  findPosition() {
    window.navigator.geolocation.getCurrentPosition(position => {
      const time = new Date().getTime() / 1000;
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        time
      };
      update('latlng', arr => {
        const newArr = [...arr];
        newArr.push(newPos);
        return newArr;
      });
    });
  }

  triggerNoSleep(event) {
    document.addEventListener('click', function enableNoSleep() {
      document.removeEventListener('click', enableNoSleep, false);
      noSleep.enable();
    }, false);
  }

  modifyTime(time) {
    const seconds = time % 60;
    const minutes = Math.trunc(time / 60);
    const hours = Math.trunc(minutes / 60);
    let s = seconds.toString();
    let m = minutes.toString();
    let h = hours.toString();
    if (s.length < 2) {
      s = '0' + s;
    }
    if (m.length < 2) {
      m = '0' + m;
    }
    if (h.length < 2) {
      h = '0' + h;
    }
    return [h, m, s].join(':');
  }

  render() {
    if (this.state.phase === 'end') return <Redirect to="postPhoto" />;

    let buttonLeft, buttonRight, message;
    if (this.state.phase === 'start') {
      message = 'ready';
      buttonLeft = <Button onClick={this.setTimeInterval}>Start</Button>;
      buttonRight = <Button onClick={this.stopRun}>Stop</Button>;
    } else if (this.state.phase === 'during') {
      message = 'time';
      buttonLeft = <Button onClick={this.pauseTime}>Pause</Button>;
      buttonRight = <Button onClick={this.stopRun}>Stop</Button>;
    } else if (this.state.phase === 'paused') {
      message = 'time';
      buttonLeft = <Button onClick={this.restartIntervals}>Resume</Button>;
      buttonRight = <Button onClick={this.stopRun}>Stop</Button>;
    } else if (this.state.phase === 'finished') {
      message = 'final';
      buttonLeft = <Button onClick={this.restartIntervals}>Resume</Button>;
      buttonRight = <Button onClick={this.endRun}>Finish</Button>;
    }

    const time = this.modifyTime(this.state.time);

    return (
      <>
        <Message message={message} />
        <div className='stopwatch d-flex justify-content-center align-items-center mx-auto border border-3 border-primary rounded-circle'>
          <p className='h1 text-primary'>{time}</p>
        </div>
        <div className="d-flex justify-content-center mt-3 gap-2">
          {buttonLeft}
          {buttonRight}
        </div>
      </>
    );
  }
}
