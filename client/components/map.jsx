import React from 'react';
import { get } from 'idb-keyval';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }

  calculateCenter(arr) {
    const lats = arr.map(obj => obj.lat);
    const lngs = arr.map(obj => obj.lng);

    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);

    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);

    const center = { lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2 };

    return { center, minLat, minLng, maxLat, maxLng };
  }

  calculateZoom(center, centerMinMaxObj) {
    const { minLat, minLng, maxLat, maxLng } = centerMinMaxObj;
    const miles = this.findDistance(minLat, maxLat, minLng, maxLng);
    const milesPerPx = miles / 400;
    let zoom = (0.060470747293397 * Math.cos(center.lat * Math.PI / 180) / milesPerPx) ** (1 / 2);
    if (zoom > 22) {
      zoom = 22;
    } else {
      Math.trunc(zoom);
    }
    return zoom;
  }

  componentDidMount() {
    get('latlng').then(arr => {
      const centerMinMaxObj = this.calculateCenter(arr);
      const mapCenter = centerMinMaxObj.center;
      const zoom = this.calculateZoom(mapCenter, centerMinMaxObj);
      const path = [];
      arr.map(obj => {
        const newStr = `|${obj.lat},${obj.lng}`;
        path.push(newStr);
        return obj;
      });
      const pathStyle = 'color:black';
      const strCoords = pathStyle + path.join('');
      this.setState({
        url: `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}&size=${window.innerWidth}x400&key=${process.env.API}&path=${strCoords}`
      });
    }).catch(err => console.error(err));
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
    if (!this.state.url) return;

    return (
      <img src={this.state.url} alt="" />
    );
  }
}
