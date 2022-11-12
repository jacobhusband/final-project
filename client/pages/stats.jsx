import React from 'react';
import Navbar from '../components/navbar';
import Map from '../components/map';
import Button from 'react-bootstrap/Button';
import { get, getMany } from 'idb-keyval';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      time: 0,
      pace: null,
      preImage: null,
      postImage: null
    };
    this.saveRun = this.saveRun.bind(this);
  }

  saveRun() {
    const { distance, time, preImage, postImage } = this.state;
    getMany(['mapImg', 'latlng']).then(([mapImg, latlng]) => {
      const details = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preImage, postImage, mapImg, distance, time, latlng })
      };
      fetch('/api/runs', details).then(result => result.json()).then(data => {
      }).catch(err => console.error(err));
    }).catch(err => console.error(err));
  }

  doCalculations() {
    get('latlng')
      .then(arr => {
        const newDistances = [];
        for (let i = 1; i < arr.length; i++) {
          newDistances.push(this.findDistance(arr[i - 1].lat, arr[i].lat, arr[i - 1].lng, arr[i].lng));
        }
        const start = arr[0].time;
        const end = arr[arr.length - 1].time;
        const distance = newDistances.reduce((x, y) => x + y).toFixed(2);
        const time = this.modifyTime(Math.trunc(end - start));
        let pace;
        if (parseInt(distance)) {
          pace = this.modifyTime(Math.trunc((end - start) / distance));
        } else {
          pace = 'Not available';
        }
        this.setState({
          time,
          distance,
          pace
        });
      })
      .catch(err => console.error(err));
  }

  modifyTime(seconds) {
    const clockSeconds = seconds % 60;
    const minutes = Math.trunc(seconds / 60);
    const clockMinutes = minutes % 60;
    const hours = Math.trunc(minutes / 60);
    if (!hours && !minutes) {
      return `${clockSeconds} seconds`;
    } else if (!hours) {
      return `${clockMinutes} minutes, ${clockSeconds} seconds`;
    }
    return `${hours} hours, ${clockMinutes} minutes, ${clockSeconds} seconds`;
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
    getMany(['preImage', 'postImage']).then(([preImage, postImage]) => {
      this.setState({
        preImage,
        postImage
      });
    });
    this.doCalculations();
  }

  render() {
    if (this.state.pace === null || this.state.preImage === null || this.state.postImage === null) return;

    const pace = (this.state.pace === 'Not available') ? this.state.pace : this.state.pace + ' per mile';

    return (
      <div className="stats">
        <Navbar />
        <div className='mx-auto'>
          <div className="desktop-images container d-flex justify-content-between p-0">
            <div className='map-image w-100'>
              <Map />
            </div>
            <div className='desktop-image'>
              <img className='rounded' src={this.state.preImage} alt="" />
            </div>
            <div className='desktop-image'>
              <img className='rounded' src={this.state.postImage} alt="" />
            </div>
          </div>
          <div className="container">
            <h1 className='fw-bold m-3'>Statistics</h1>
            <h4 className='fw-bold m-2 mb-1'>DISTANCE</h4>
            <p className='h4 m-2 mt-1 mb-4'>{this.state.distance + ' miles'}</p>
            <h4 className='fw-bold m-2 mb-1'>TIME</h4>
            <p className='h4 m-2 mt-1 mb-4'>{this.state.time}</p>
            <h4 className='fw-bold m-2 mb-1'>PACE</h4>
            <p className='h4 m-2 mt-1 mb-4'>{pace}</p>
            <div className='images d-flex justify-content-around'>
              <div className='image'>
                <img className='rounded' src={this.state.preImage} alt="" />
              </div>
              <div className='image'>
                <img className='rounded' src={this.state.postImage} alt="" />
              </div>
            </div>
            <div className="buttons mt-1">
              <Button href='#saved' className='m-2' onClick={this.saveRun}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
