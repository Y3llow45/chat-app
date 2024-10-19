interface SignUpState {
  username: string;
  email: string;
  password: string;
}

export const handleInputChangeComponent = (
  event: React.ChangeEvent<HTMLInputElement>,
  setStateCallback: React.Dispatch<React.SetStateAction<SignUpState>>
) => {
  const { name, value } = event.target;
  setStateCallback((prevState: SignUpState) => ({ ...prevState, [name]: value }));
};
