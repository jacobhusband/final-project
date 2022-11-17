import React from 'react';
import Navbar from '../components/navbar';
import Map from '../components/map';
import Button from 'react-bootstrap/Button';
import Redirect from '../components/redirect';
import { get, getMany } from 'idb-keyval';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: null,
      time: null,
      pace: null,
      mapImage: null,
      redirect: null
    };
    this.saveRun = this.saveRun.bind(this);
    this.saveMapImage = this.saveMapImage.bind(this);
  }

  saveMapImage(mapImage) {
    this.setState({
      mapImage
    });
  }

  saveRun(event) {
    const { distance, time, pace } = this.state;
    const { preImageUrl, postImageUrl } = this.props;
    getMany(['mapImg', 'latlng']).then(([mapImg, latlng]) => {
      const details = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Access-Token': this.props.token
        },
        body: JSON.stringify({ preImageUrl, postImageUrl, mapImg, distance, time, latlng, pace })
      };
      fetch('/api/runs', details).then(result => result.json()).then(data => {
        if (event.target.textContent === 'Save') {
          this.setState({
            redirect: 'saved'
          });
        }
        if (event.target.textContent === 'Post') {
          this.props.saveRunId(data.runId);
          this.setState({
            redirect: 'post'
          });
        }
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  }

  modifyTime(seconds) {
    let clockSeconds = (seconds % 60).toString();
    const minutes = Math.trunc(seconds / 60);
    let clockMinutes = (minutes % 60).toString();
    let hours = (Math.trunc(minutes / 60)).toString();
    if (clockSeconds.length !== 2) clockSeconds = '0' + clockSeconds;
    if (clockMinutes.length !== 2) clockMinutes = '0' + clockMinutes;
    if (hours.length !== 2) hours = '0' + hours;
    if (hours === '00') {
      return `${clockMinutes}:${clockSeconds}`;
    }
    return `${hours}:${clockMinutes}:${clockSeconds}`;
  }

  findDistance(lat1, lat2, lng1, lng2) {
    lng1 = (lng1 * Math.PI) / 180;
    lng2 = (lng2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    const dlng = lng2 - lng1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.pow(Math.sin(dlng / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371;

    return (c * r);
  }

  componentDidMount() {
    get('latlng')
      .then(arr => {
        const newDistances = [];
        let distance, pace;
        for (let i = 1; i < arr.length; i++) {
          newDistances.push(this.findDistance(arr[i - 1].lat, arr[i].lat, arr[i - 1].lng, arr[i].lng));
        }
        const start = arr[0].time;
        const end = arr[arr.length - 1].time;
        if (newDistances.length > 1) {
          distance = newDistances.reduce((x, y) => x + y, 0).toFixed(2);
        } else if (newDistances.length === 1) {
          distance = newDistances[0].toFixed(2);
        } else {
          distance = (0).toFixed(2);
        }
        const time = this.modifyTime(Math.trunc(end - start));
        if (Number(distance)) {
          pace = this.modifyTime(Math.trunc((end - start) / distance));
        } else {
          pace = '00:00';
        }
        this.setState({
          time,
          distance,
          pace
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.redirect === 'saved') return <Redirect to="saved" />;
    if (this.state.redirect === 'post') return <Redirect to="post" />;
    if (this.state.pace === null || this.props.postImageUrl === null || this.props.preImageUrl === null) return;

    const pace = this.state.pace + ' pace';
    const time = this.state.time + ' time';
    const distance = this.state.distance + ' miles';

    return (
      <div className="stats">
        <Navbar />
        <div className='mx-auto'>
          <div className="desktop-images container d-flex justify-content-between p-0">
            <div className='map-image w-100'>
              <Map saveMapImage={this.saveMapImage} />
            </div>
            <div className='desktop-image'>
              <img className='rounded' src={this.props.preImageUrl} alt="" />
            </div>
            <div className='desktop-image'>
              <img className='rounded' src={this.props.postImageUrl} alt="" />
            </div>
          </div>
          <div className="container">
            <h1 className='fw-bold m-3'>Statistics</h1>
            <h4 className='fw-bold m-2 mb-1'>DISTANCE</h4>
            <p className='h4 m-2 mt-1 mb-4'>{distance}</p>
            <h4 className='fw-bold m-2 mb-1'>TIME</h4>
            <p className='h4 m-2 mt-1 mb-4'>{time}</p>
            <h4 className='fw-bold m-2 mb-1'>PACE</h4>
            <p className='h4 m-2 mt-1 mb-4'>{pace}</p>
            <div className='images d-flex justify-content-around'>
              <div className='image'>
                <img className='rounded' src={this.props.preImageUrl} alt="" />
              </div>
              <div className='image'>
                <img className='rounded' src={this.props.postImageUrl} alt="" />
              </div>
            </div>
            <div className="buttons mt-1">
              <Button className='m-2' onClick={this.saveRun}>Save</Button>
              <Button className='m-2' onClick={this.saveRun}>Post</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
