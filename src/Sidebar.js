import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';



class Sidebar extends Component {
  
  static propTypes = {
    allLibraries: PropTypes.array.isRequired,
  }

  render() {

    return (
      <div className="sidebar">
          <input 
            type="text" 
            placeholder="Search by location name"
            onChange={(e) => this.props.searchQuery(e.target.value)}
            role="textbox"
            aria-label="search text box"
          />
          <ol>
            {this.props.allLibraries.map((library) => (
              <li key={library.id} onClick={(e) => this.props.handleListClick(e.target)} tabIndex="0" aria-expanded="false">
                {library.name}
                <p className="hidden library-address" aria-label="address of library">{library.location.formattedAddress[0]}</p>
              </li>
            ))}
          </ol>
        </div>
    );
  }
}

export default Sidebar;
