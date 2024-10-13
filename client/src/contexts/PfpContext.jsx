import { createContext, useContext, useState } from 'react';

const PfpContext = createContext();

export const PfpProvider = ({ children }) => {
  const savedPfp = localStorage.getItem('userPfp');
  const [userPfp, setUserPfp] = useState(savedPfp !== null ? parseInt(savedPfp) : 0);
  return (
    <PfpContext.Provider value={{ userPfp, setUserPfp }}>
      {children}
    </PfpContext.Provider>
  );
};

export const usePfpAuth = () => {
  return useContext(PfpContext);
};

export function withPfpAuth(Component) {
  return function PfpAuthWrapper(props) {
    const { setUserPfp, userPfp } = usePfpAuth();
    return (
      <Component
        {...props}
        setUserPfp={setUserPfp}
        userPfp={userPfp}
      />
    );
  };
}