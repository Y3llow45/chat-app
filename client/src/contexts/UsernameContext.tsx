import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface UsernameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  isAuthenticated: boolean;
}

const UsernameContext = createContext < UsernameContextType | undefined > (undefined);

interface UsernameProviderProps {
  children: ReactNode;
}

export const UsernameProvider: FC<UsernameProviderProps> = ({ children }) => {
  const [username, setUsername] = useState < string > (localStorage.getItem('username') || 'Guest');
  const isAuthenticated = username !== 'Guest';

  return (
    <UsernameContext.Provider value={{ username, setUsername, isAuthenticated }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsernameAuth = (): UsernameContextType => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error('useUsernameAuth must be used within a UsernameProvider');
  }
  return context;
};

interface WithUsernameAuthProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  isAuthenticated: boolean;
}

export function withUsernameAuth<T>(Component: React.ComponentType<T & WithUsernameAuthProps>) {
  return function UsernameAuthWrapper(props: T) {
    const { setUsername, username, isAuthenticated } = useUsernameAuth();

    return (
      <Component
        {...props}
        setUsername={setUsername}
        username={username}
        isAuthenticated={isAuthenticated}
      />
    );
  };
}
