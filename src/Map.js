import React, { Component } from 'react';
import './App.css';
/*import Marker from './Marker';*/
import PropTypes from 'prop-types';



class Map extends Component {
  
  static propTypes = {
    allLibraries: PropTypes.array.isRequired,
    map: PropTypes.object.isRequired
  }



  render() {

    const { map, allLibraries } = this.props

    return (
      <div className="map-container">
        <div id="map"></div>
      	<h3>Map goes here</h3>

        
      </div>
    );
  }
}

export default Map;
