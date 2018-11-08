import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Map from './Map'


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
    libraries: [],
    originalLibraries: [],
    libraryIds: [],
    markers: [],
    queryResult: []
  }


  componentDidMount(){
    this.getLibaries()
    console.log('its mounted')
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
      v: '20181104'
    }

  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  
    axios.get(endPoint + new URLSearchParams(parameters))
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
      .then(response => {
        // Code for handling API response         
        /*console.log(response.data.response.venues[0].location.lat)*/
        /*console.log('success')*/
        this.setState({
          libraries: response.data.response.venues,
          originalLibraries: response.data.response.venues
        },

        this.srcForMap()

      )
        this.getLibraryIds()
        console.log(this.state.libraries)
      })
      .catch(error => {
      // Code for handling errors
        console.log("ERROR! " + error)
    })

  }

  getLibraryIds = () => {
    let idArr = []
    this.state.originalLibraries.forEach(library => {
      idArr.push(library.id)
    })
    console.log(idArr)
    this.setState({
      libraryIds: idArr
    })
    this.getPhotos()
  }

  getPhotos = () => {
    const endPoints = []
    this.state.libraryIds.forEach(id => {
      endPoints.push(`https://api.foursquare.com/v2/venues/${id}/photos?`)
    })
    console.log(endPoints)
    endPoints.forEach(point => {
      let parameters = {
        client_id: "VPBZV3MSHPKCLMJOBX5FBFCLRPEQET2EGTC42I34MH20RLY3",
        client_secret: "JXCKO13RELKR4EGKMPY2LCKUR5RPZYLHKRL2JIOGSCWFVNJ2",
        v: '20181104'
      }
    
      axios.get(point + new URLSearchParams(parameters))
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
        .then(response => {
          // Code for handling API response         
          /*console.log(response.data.response.venues[0].location.lat)*/
          /*console.log('success')*/
          console.log(response)
        })
        .catch(error => {
        // Code for handling errors
          console.log("ERROR! " + error)
      })
    })
    
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
    this.markerEngine()
    
  }

  markerEngine = () => {
    let markerLocations = this.getLatLng()
    this.setMarkers(markerLocations)
    this.createInfoWindows()
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
    let markers = []
    this.state.libraries.forEach((library,index) => {
      let marker = new window.google.maps.Marker({
        position: {lat: locs[index].lat, lng: locs[index].lng},
        title: library.name,
        id: index
      })
      markers.push(marker)
    })
    this.setState({
      markers: markers
    })
    this.setMapOnAll(markers)
  }

  setMapOnAll = (markers) => {
    markers.forEach(marker => {
      let infoWindowContent = 
      marker.setMap(this.state.map)
    })
  }

  createInfoWindows = () => {
    let infoWindow = new window.google.maps.InfoWindow
    this.state.markers.forEach((marker,index) => {
      marker.addListener('click', (e) => {
        infoWindow.setContent(
          '<h1>'+marker.title+'</h1>'
        )
        infoWindow.open(this.state.map,marker)
      })
    })
  }

  searchQuery = (query) => {
      let queryResult = []
      let indexVals = []
      if (!query){
        this.setState({
          libraries: this.state.originalLibraries
        })
        this.state.markers.forEach(marker => {
          marker.setVisible(true)
        })
      }
      else {
        this.state.libraries.forEach((library, index) => {          
          if(library.name.toLowerCase().includes(query.toLowerCase())){
            queryResult.push(library)
            indexVals.push(index)
          }
        })
        console.log(indexVals)
        this.setState({
          libraries: queryResult
        })
        this.updateMarkers(queryResult,indexVals)
      }

    }

  updateMarkers = (results,indexVals) => {
    this.state.markers.forEach(marker => {
      marker.setVisible(false)
    })

    for (let i=0;i<indexVals.length;i++){
      this.state.markers[indexVals[i]].setVisible(true)
    }


  }


  render() {

    return (
      <div className="App">
        <div className="sidebar">
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
        <Map 
          map = {this.state.map}
          allLibraries = {this.state.libraries}
        />
      </div>
    );
  }
}

export default App;
