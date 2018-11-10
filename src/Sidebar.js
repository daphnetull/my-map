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
          />
          <ol>
            {this.props.allLibraries.map((library) => (
              <li key={library.id} onClick={(e) => this.props.handleListClick(e.target)}>
                {library.name}
                <p className="hidden">{library.location.formattedAddress[0]}</p>
              </li>
            ))}
          </ol>
        </div>
    );
  }
}

export default Sidebar;
