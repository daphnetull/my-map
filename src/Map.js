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

    return (
      <div className="map-container">
        <div id="map" 
          tabIndex="0"
        >
        </div>

        
      </div>
    );
  }
}

export default Map;
