import React, { Component } from 'react';
import './App.css';


class Marker extends Component {
  
	state = {
		markers: []
	}

	componentDidMount(){
		this.markerEngine()
	}
	

	markerEngine = () => {
    let markerLocations = this.getLatLng()
    this.setMarkers(markerLocations)
  }

  getLatLng = () => {
    let locations = []

      locations = this.props.allLibraries.map(library => {
        let coords = {}
        coords.name = library.name
        coords.lat = library.location.lat
        coords.lng = library.location.lng
      return coords
    })
    return locations   
  }

  setMarkers = (locs) => {
    let markers = []
    this.props.allLibraries.forEach((library,index) => {
      let marker = new window.google.maps.Marker({
        position: {lat: locs[index].lat, lng: locs[index].lng},
        title: this.state.libraries.name,
        id: index,
      })
      markers.push(marker)
    })
    this.setState({
      markers: markers
    })
    this.setMapOnAll(markers)
    console.log(this.state.markers)

  }

  setMapOnAll = (markers) => {
    markers.forEach(marker => {
      marker.setMap(this.props.map)
    })
  }

  render() {
    return (
      <div className="Marker">

      	<h3>Marker goes here</h3>
        
        
      </div>
    );
  }
}

export default Marker;
