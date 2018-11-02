import React, { Component } from 'react';
import axios from 'axios'
import './App.css';


function loadScript(url){

  const firstScript = window.document.querySelector('script');
  const newScript = window.document.createElement('script');
  newScript.src = url;
  newScript.async = newScript.defer = true;
  firstScript.before(newScript);
  console.log(url)
}

class App extends Component {
  

  state = {
    map: {},
    libraries: []
  }


  componentDidMount(){
    this.getLibaries()
    console.log('its mounted')
  }


  srcForMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBguQJWbS48IZPGPRMHUhbU7elhiCd6PFk&v=3&callback=initMap")
    window.initMap = this.initMap
  }

  getLibaries = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/search?'
    /* https://developer.foursquare.com/docs/api 
     * fetch('https://api.foursquare.com/v2/venues/explore?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=20180323&limit=1&ll=40.7243,-74.0018&query=coffee')
    */
    const parameters = {
      client_id: "VPBZV3MSHPKCLMJOBX5FBFCLRPEQET2EGTC42I34MH20RLY3",
      client_secret: "JXCKO13RELKR4EGKMPY2LCKUR5RPZYLHKRL2JIOGSCWFVNJ2",
      query: "Library",
      near: "Indianapolis",
      v: '20180323'

  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  
  axios.get(endPoint + new URLSearchParams(parameters))
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
    .then(response => {
      // Code for handling API response         
      /*console.log(response.data.response.venues[0].location.lat)*/
      /*console.log('success')*/
      this.setState({
        libraries: response.data.response.venues
      },
      this.srcForMap())


      console.log(this.state.libraries)
    })
    .catch(error => {
      // Code for handling errors
      console.log("ERROR! " + error)
    })

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
    this.markerEngine()
  }

  markerEngine = () => {
    let markerLocations = this.getLatLng()
    this.setMarkers(markerLocations)
  }

  getLatLng = () => {
    let locations = []

      locations = this.state.libraries.map(library => {
        let coords = {}
        coords.name = library.name
        coords.lat = library.location.lat
        coords.lng = library.location.lng
      return coords
    })
    return locations   
  }

  setMarkers = (locs) => {
    this.state.libraries.forEach((library,index) => {
      let marker = new window.google.maps.Marker({
        position: {lat: locs[index].lat, lng: locs[index].lng},
        title: this.state.libraries.name,
        id: index,
        map: this.state.map
      })
    })
  }

  searchQuery = (query) => {
      let queryResult = []
      this.state.libraries.forEach(library => {
        if(library.name.toLowerCase().includes(query.toLowerCase())){
          queryResult.push(library)
        }
      })

      this.setState({
        libraries: queryResult
      })

      this.srcForMap()

    }

  render() {
    return (
      <div className="App">
       <div id="map"></div>
         <input 
            type="text" 
            placeholder="Search by location name"
            onChange={(e) => this.searchQuery(e.target.value)}
          />
          <ol>
            {this.state.libraries.map((library) => (
              <li key={library.id}>
                {library.name}
              </li>
            ))}
          </ol>
        </div>
    );
  }
}

export default App;
