import { Component, ChangeEvent, FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { signIn } from '../../services/Services';
import FormComponent from '../Form/FormComponent/FormComponent';
import { displayError, displaySuccess } from '../Notify/Notify';
import navWrap from '../Form/NavWrap/NavWrap';
import { withUsernameAuth } from '../../contexts/UsernameContext';
import { withRoleAuth } from '../../contexts/RoleContext';

interface SignInProps {
  setUsername: (username: string) => void;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  navigate: (path: string) => void;
}

interface SignInState {
  email: string;
  password: string;
  username: string;
}

class SignIn extends Component<SignInProps, SignInState> {
  constructor(props: SignInProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: ''
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as Pick<SignInState, keyof SignInState>);
  };

  handleSign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, password } = this.state;
    const { setUsername, setUserRole, navigate } = this.props;

    try {
      const res = await signIn(username, password);
      const data = await res.json();

      if (res.status !== 200) {
        displayError('Wrong credentials');
        return;
      }

      if (data.token && data.username && data.privateKey) {
        setUsername(data.username);
        setUserRole(data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('privateKey', data.privateKey);
        displaySuccess('Logged in');
        navigate('/chats');
      } else {
        displayError('Status error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className='signup-container-border'>
        <div className='signup-container'>
          <h2 className='form-tittle'>Sign In</h2>
          <form className='signup-form' onSubmit={this.handleSign}>
            <FormComponent
              username={username}
              password={password}
              handleInputChange={this.handleInputChange}
            />
            <br />
            <button type='submit' className='form-submit'>
              Sign In
            </button>
          </form>
          <div className='signin-link'>
            <p>
              Don't have an account? <NavLink to='/signup'>Sign Up</NavLink>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default navWrap(withUsernameAuth(withRoleAuth(SignIn)));
