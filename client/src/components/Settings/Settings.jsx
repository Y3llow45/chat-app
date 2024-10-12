import React, { Component } from 'react';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { withPfpAuth } from '../../contexts/PfpContext';
import { save } from '../../services/Services';
import navWrap from '../Form/NavWrap/NavWrap';
import './Settings.css';

const availablePfps = [1, 2, 3, 4];

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPfp: this.props.userPfp || availablePfps[0],
    };
  }

  handlePfpSelect = (pfp) => {
    this.setState({ selectedPfp: pfp });
  };

  handleSave = () => {
    const { setUserPfp } = this.props;
    const { selectedPfp } = this.state;
    setUserPfp(selectedPfp);
    save(selectedPfp);
  };

  render() {
    const { username } = this.props;
    const { selectedPfp } = this.state;

    return (
      <div className="settings-container">
        <h2>Welcome, {username}!</h2>

        <h3>Select your profile picture</h3>
        <div className="pfp-selection">
          {availablePfps.map((pfp) => (
            <img
              key={pfp}
              src={`pic${pfp}.jpg`}
              alt={`Profile ${pfp}`}
              className={`pfp-item ${selectedPfp === pfp ? 'selected' : ''}`}
              onClick={() => this.handlePfpSelect(pfp)}
            />
          ))}
        </div>

        <button className="save-button" onClick={this.handleSave}>
          Save
        </button>
      </div>
    );
  }
}

export default navWrap(withUsernameAuth(withPfpAuth(Settings)));
