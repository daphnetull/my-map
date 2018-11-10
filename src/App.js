import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Map from './Map'
import Sidebar from './Sidebar'


/*
 * This function is a work-around to insert the <script> tag into the page
 * as would normally be done according to Google Maps JS API Documentation
 * https://developers.google.com/maps/documentation/javascript/tutorial
 * Technique inspired by: https://www.fullstackreact.com/articles/Declaratively_loading_JS_libraries/index.html
 * and Yahya's walkthrough: https://www.youtube.com/channel/UCcWSbBe_s-T_gZRnqFbtyIA
*/

function loadScript(url){

  const firstScript = window.document.querySelector('script');
  const newScript = window.document.createElement('script');
  newScript.src = url;
  newScript.async = newScript.defer = true;
  firstScript.before(newScript);
}

class App extends Component {
  
  state = {
    map: {},
    libraries: [],
    originalLibraries: [],
    libraryIds: [],
    addresses: [],
    markers: [],
    queryResult: [],
    isItemClicked: false,
    clickedItems: []
  }


  componentDidMount(){
    this.getLibaries()

    /*
     * This function runs in the unlikely event that the Google Map experienced an authentication error
     * https://stackoverflow.com/questions/45633672/detect-query-limit-message-on-map-load-with-google-maps-javascript-api
     * It's attached to the window object tomake it global
    */
    window.gm_authFailure = () =>  { 
        alert("Google Maps failed to load"); // a very simple alert to the user
    }
  }

  getLibaries = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/search?'
    /* https://developer.foursquare.com/docs/api 
     * fetch('https://api.foursquare.com/v2/venues/explore?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=20180323&limit=1&ll=40.7243,-74.0018&query=coffee')
    */
    const parameters = {
      client_id: "VPBZV3MSHPKCLMJOBX5FBFCLRPEQET2EGTC42I34MH20RLY3",
      client_secret: "JXCKO13RELKR4EGKMPY2LCKUR5RPZYLHKRL2JIOGSCWFVNJ2",
      query: "Public Library Marion County",
      near: "Indianapolis",
      radius: "8000",
      v: '20181104'
    }

    /*
     * Using npm package Axios to help with the fetching
     * https://www.npmjs.com/package/axios
    */ 
    axios.get(endPoint + new URLSearchParams(parameters)) // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
      .then(response => {
        // geting the venues, and then storing them as a state         
        this.setState({
          libraries: response.data.response.venues,
          originalLibraries: response.data.response.venues
        },
        // begins to initialize the map
        this.srcForMap()
      )
        this.getLibraryIds()
      })
      .catch(error => {
      // Code for handling errors
        alert("error: " + error)
    })
  }

  /*
   * This method retrieves the ID numbers of each library.
  */
  getLibraryIds = () => {
    let idArr = []
    this.state.originalLibraries.forEach(library => {
      idArr.push(library.id)
    })
    this.setState({
      libraryIds: idArr
    })
    this.getAddresses()
  }

  /*
   * This sends the URL to the loadScript method to insert it into the DOM
  */
  srcForMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBguQJWbS48IZPGPRMHUhbU7elhiCd6PFk&v=3&callback=initMap")
    window.initMap = this.initMap // attaching initMap to window object to make it global
  }

  /*
   * The actual initMap method to create the map.  It's triggered by the callback in the Google Map URL
  */
  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.7689, lng: -86.1599},
      zoom: 12
    })
    this.setState({
      map: map
    })
    this.markerEngine()    
  }

  /*
   * Initiating te methods to create the markers
  */
  markerEngine = () => {
    let markerLocations = this.getLatLng()
    this.setMarkers(markerLocations)
    this.createInfoWindows()
  }

  /*
   * a helper function to retrieve just the latitude and longitude of each location for 
   * for easier marker creation
  */
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

  /*
   * creating the markers
  */
  setMarkers = (locs) => {
    let markers = []
    this.state.libraries.forEach((library,index) => {
      let marker = new window.google.maps.Marker({
        position: {lat: locs[index].lat, lng: locs[index].lng},
        title: library.name,
        id: index,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      })
      markers.push(marker)
    })
    this.setState({
      markers: markers
    })
    this.setMapOnAll(markers)
  }

  /*
   * This binds all of the markers to the map
  */
  setMapOnAll = (markers) => {
    markers.forEach(marker => {
      marker.setMap(this.state.map)
    })
  }

  /*
   * digging through the libraries array to find the address of each location
  */
  getAddresses = () => {
    let addressArr = []
    this.state.libraries.forEach(library => {
        addressArr.push(library.location.formattedAddress)
    })
    this.setState({
      addresses: addressArr
    })
  }

  /*
   * Creating the Info Windows and populating them with the address of each venue
  */
  createInfoWindows = () => {
    let infoWindow = new window.google.maps.InfoWindow()
    this.state.markers.forEach((marker,index) => {
      marker.addListener('click', (e) => {
        infoWindow.setContent(
          '<h3>'+marker.title+'</h3>'+
          '<p>'+this.state.addresses[index][0]+'</p>'+
          '<p>'+this.state.addresses[index][1]+'</p>'
        )
        infoWindow.open(this.state.map,marker)
        /*
         * Setting focus on open infowindow
         * got help from this stackoverflow answer
         * https://stackoverflow.com/questions/32520538/set-focus-on-google-maps-infowindow-on-marker-mouseover
        */
        if (infoWindow.open){
          let openInfoWindow = document.querySelector('.gm-style-iw')
          openInfoWindow.setAttribute('tabindex', '0')
          window.google.maps.event.addListener(infoWindow, 'domready', function(){
            openInfoWindow.blur();
            openInfoWindow.focus();
          });
        }
      })
    })
  }

  /*
   * Initiated whenever user types into the search box
  */
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
      this.state.originalLibraries.forEach((library, index) => {          
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

  /*
   * updating visibility of markers according to the query results
  */
  updateMarkers = (results,indexVals) => {
    this.state.markers.forEach(marker => {
      marker.setVisible(false)
    })

    for (let i=0;i<indexVals.length;i++){
      this.state.markers[indexVals[i]].setVisible(true)
    }
  }


  /*
   * initiated whenever a user clicks on an item in the list menu
  */
  handleListClick = (item) => {
    let allParas = document.querySelectorAll('.hidden')
    let allListItems = document.querySelectorAll('li')
    allListItems.forEach(item => {
      item.setAttribute('aria-expanded','false')
    })
    allParas.forEach(para => {
      para.style.display = 'none'
    })
    item.querySelector('p').style.display = 'block'
    item.setAttribute('aria-expanded', 'true')
    let nameOfClickedItem = item.firstChild.data
    let matchedMarker = this.state.markers.filter(marker => marker.title === nameOfClickedItem)
    matchedMarker = matchedMarker[0]
    this.state.markers.forEach(marker => {
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
      marker.setAnimation(null)
    })
    matchedMarker.setAnimation(window.google.maps.Animation.BOUNCE)
    matchedMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  }


  render() {


    return (
      <div className="App">
        <div className="main-content">
          <Sidebar 
            map = {this.state.map}
            allLibraries = {this.state.libraries}
            searchQuery = {this.searchQuery}
            handleListClick = {this.handleListClick}
          />
          <Map 
            map = {this.state.map}
            allLibraries = {this.state.libraries}
          />
        </div>
        <footer>
          <p className="footer-text">
            Powered by <a href='https://developers.google.com/maps/documentation/'>Google Maps API</a> and <a href='https://developer.foursquare.com/'>Foursquare</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
