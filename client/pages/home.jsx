import React from 'react';
import Navbar from '../components/navbar';

export default function Home(props) {
  return (
    <div>
      <Navbar home={props.home} />
    </div>
  );
}
