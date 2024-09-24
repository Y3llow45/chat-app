import React from 'react';

const FormComponent = ({ username, password, handleInputChange, checkFunc }) => {
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
