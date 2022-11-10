import React from 'react';
import { get } from 'idb-keyval';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }

  calculateCenter() {
    return 0;
  }

  componentDidMount() {
    this.calculateCenter();
    get('latlng').then(arr => {
      const mapCenter = { lat: 33.634929, lng: -117.7405074 };
      const path = [];
      arr.map(obj => {
        const newStr = `|${obj.lat},${obj.lng}`;
        path.push(newStr);
        return obj;
      });
      const pathStyle = 'color:white|geodesic:true';
      const strCoords = pathStyle + path.join('');
      this.setState({
        url: `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=19&size=${window.innerWidth}x400&maptype=satellite&key=${process.env.API}&path=${strCoords}`
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.url) return;

    return (
      <img src={this.state.url} alt="" />
    );
  }
}
