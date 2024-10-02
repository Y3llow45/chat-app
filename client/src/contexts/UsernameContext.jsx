import { createContext, useContext, useState } from 'react';

const UsernameContext = createContext();

export function UsernameProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const isAuthenticated = username !== 'Guest';

  return (
    <UsernameContext.Provider value={{ username, setUsername, isAuthenticated }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsernameAuth() {
  return useContext(UsernameContext);
}
