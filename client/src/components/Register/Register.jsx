import React, { Component } from 'react';
import './Register.css';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { signUp, checkDuplicate } from '../../services/Services';
import FormComponent from '../Form/FormComponent/FormComponent';
import { handleInputChangeComponent } from '../Form/handleInputChange/handleInputChange';
import { displayError, displayInfo, displaySuccess } from '../Notify/Notify';
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: ''
    };
  }

  componentDidMount() {
    document.getElementById("email").addEventListener("blur", this.checkEmail);
    document.getElementById("username").addEventListener("blur", this.checkUsername);
  }

  componentWillUnmount() {
    document.getElementById("email").removeEventListener("blur", this.checkEmail);
    document.getElementById("username").removeEventListener("blur", this.checkUsername);
  }

  handleInputChange = (event) => {
    handleInputChangeComponent(event, this.setState.bind(this));
  }

  checkEmail = async () => {
    await checkDuplicate('Email', this.state.email)
  }

  checkUsername = async () => {
    await checkDuplicate('Username', this.state.username);
  }

  handleSignUp = async (event) => {
    try {
      event.preventDefault();
      if (!passwordPattern.test(this.state.password)) {
        displayInfo("Weak password")
        return
      }
      signUp(this.state.username, this.state.email, this.state.password)
        .then(async (res) => {
          const { message } = await res.json();
          if (res.status === 201) {
            displaySuccess("Account created")
            this.props.history.push('/signin')
          } else if (res.status === 400) {
            displayInfo(`${message}`)
          }
          else {
            displayError("No response from server")
          }
        })
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  };

  render() {
    return (
      <div className="signup-container-border">
        <div className='signup-container'>
          <h2 className='form-tittle'>Sign Up</h2>
          <form className="signup-form" onSubmit={this.handleSignUp}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleInputChange}
              className='input-form'
              id="email"
              required
            />
            <FormComponent
              username={this.state.username}
              password={this.state.password}
              handleInputChange={this.handleInputChange}
              checkFunc={this.checkUsername}
            />
            <br></br>
            <button type="submit" className='form-submit'>Sign Up</button>
          </form>
          <div className="signin-link">
            <p>Already have an account? <NavLink to="/signin">Sign In</NavLink></p>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
