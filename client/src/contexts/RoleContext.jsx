import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleAuth = () => {
  return useContext(RoleContext);
};