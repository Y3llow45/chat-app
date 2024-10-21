import React = require("react");

interface FormComponentProps {
  username: string;
  password: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkFunc?: () => Promise<void>;
}

const FormComponent: React.FC<FormComponentProps> = ({ username, password, handleInputChange }) => {
  return (
    <>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={handleInputChange}
        id="username"
        className='input-form'
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handleInputChange}
        className='input-form'
        required
      />
    </>
  );
}

export default FormComponent;
