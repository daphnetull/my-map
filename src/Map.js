import React, { Component } from 'react';
import './App.css';
import Marker from './Marker'



function loadScript(url){

  const firstScript = window.document.querySelector('script');
  const newScript = window.document.createElement('script');
  newScript.src = url;
  newScript.async = newScript.defer = true;
  firstScript.before(newScript);
  console.log(url)
}



class Map extends Component {
  

  componentDidMount(){
    this.srcForMap()
  }

  srcForMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBguQJWbS48IZPGPRMHUhbU7elhiCd6PFk&v=3&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.768451, lng: -86.070802},
      zoom: 13
    })
    this.setState({
      map: map
    })
    console.log(this.state.map)
/*    this.markerEngine()*/
  }


  render() {
    return (
      <div className="MapComponent">
        <div id="map"></div>
      	<h3>Map goes here</h3>
        <Marker 
          map = {this.props.map}
          allLibraries = {this.props.allLibraries}
        />
        
      </div>
    );
  }
}

export default Map;
