import { Component } from 'react';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { withPfpAuth } from '../../contexts/PfpContext';
//import { save } from '../../services/Services';
import pfp1 from '../../assets/1.png';
import pfp2 from '../../assets/2.png';
import pfp3 from '../../assets/3.png';
import pfp4 from '../../assets/4.png';
import userPic from '../../assets/user.jpg';
import navWrap from '../Form/NavWrap/NavWrap';
import './Settings.css';

const imagePfps = [userPic, pfp1, pfp2, pfp3, pfp4]
const availablePfps = [0, 1, 2, 3, 4];

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPfp: this.props.userPfp || availablePfps[0],
    };
  }

  handlePfpSelect = (pfp) => {
    console.log(pfp)
    this.setState({ selectedPfp: pfp });
  };

  handleSave = () => {
    const { setUserPfp } = this.props;
    const { selectedPfp } = this.state;
    setUserPfp(selectedPfp);
    //save(selectedPfp);
  };

  render() {
    const { username } = this.props;
    const { selectedPfp } = this.state;

    return (
      <div className="settings-container">
        <h2>Welcome, {username}!</h2>

        <h3>Select your profile picture</h3>
        <div className="pfp-selection">
          {imagePfps.map((pfp, index) => (
            <div key={pfp}
              className={`pfp-item-container ${selectedPfp === index ? 'selected' : ''}`}
              onClick={() => this.handlePfpSelect(index)}>
              <img key={index} src={pfp} alt="pfp" className="pfp-item" />
            </div>
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
