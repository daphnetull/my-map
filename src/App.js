import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Map from './Map'




class App extends Component {
  

  state = {
    map: {},
    libraries: [],
    originalLibraries: [],
    markers: []
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
        libraries: response.data.response.venues,
        originalLibraries: response.data.response.venues
      })

 
      console.log(this.state.libraries)
    })
    .catch(error => {
      // Code for handling errors
      console.log("ERROR! " + error)
    })

  }





  searchQuery = (query) => {
      let queryResult = []
      if (!query){
        this.setState({
          libraries: this.state.originalLibraries
        })
        /*this.srcForMap()*/
      }
      else {
        this.state.libraries.forEach(library => {
          if(library.name.toLowerCase().includes(query.toLowerCase())){
            console.log(this.state.libraries)
            queryResult.push(library)
          }
        })

        this.setState({
          libraries: queryResult
        })

      }
    }


  render() {

    return (
      <div className="App">
       <Map 
        map = {this.state.map}
        allLibraries = {this.state.libraries}
       />
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
