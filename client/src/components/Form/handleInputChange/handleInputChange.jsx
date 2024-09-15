export const handleInputChangeComponent = (event, setStateCallback) => {
    const { name, value } = event.target;
    setStateCallback({ [name]: value });
};