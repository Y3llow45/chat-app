import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface PfpContextType {
  userPfp: number;
  setUserPfp: React.Dispatch<React.SetStateAction<number>>;
}

const PfpContext = createContext < PfpContextType | undefined > (undefined);

interface PfpProviderProps {
  children: ReactNode;
}

export const PfpProvider: FC<PfpProviderProps> = ({ children }) => {
  const savedPfp = localStorage.getItem('userPfp');
  const [userPfp, setUserPfp] = useState < number > (savedPfp !== null ? parseInt(savedPfp) : 0);

  return (
    <PfpContext.Provider value={{ userPfp, setUserPfp }}>
      {children}
    </PfpContext.Provider>
  );
};

export const usePfpAuth = (): PfpContextType => {
  const context = useContext(PfpContext);
  if (!context) {
    throw new Error('usePfpAuth must be used within a PfpProvider');
  }
  return context;
};

interface WithPfpAuthProps {
  setUserPfp: React.Dispatch<React.SetStateAction<number>>;
  userPfp: number;
}

export function withPfpAuth<T>(Component: React.ComponentType<T & WithPfpAuthProps>) {
  return function PfpAuthWrapper(props: T) {
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
