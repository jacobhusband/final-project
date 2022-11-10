import React from 'react';
import Navbar from '../components/navbar';
import Map from '../components/map';
import { get } from 'idb-keyval';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      time: 0
    };
    this.calculateDistance = this.calculateDistance.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
  }

  calculateDistance() {
    get('latlng')
      .then(arr => {
        const newDistances = [];
        for (let i = 1; i < arr.length; i++) {
          newDistances.push(this.findDistance(arr[i - 1].lat, arr[i].lat, arr[i - 1].lng, arr[i].lng));
        }
        this.setState({
          distance: newDistances.reduce((x, y) => x + y)
        });
      })
      .catch(err => console.error(err));
  }

  calculateTime() {
    get('latlng')
      .then(arr => {
        const start = arr[0].time;
        const end = arr[arr.length - 1].time;
        this.setState({
          time: end - start,
        })
      })
      .catch(err => console.error(err));
  }

  calculatePace() {
    if (!this.state.time) return;

    return this.state.distance / (this.state.time / 3600)
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

  render() {
    return (
      <>
        <Navbar />
        <Map />
        <button onClick={this.calculateDistance}>Calculate Distance</button>
      </>
    );
  }
}
