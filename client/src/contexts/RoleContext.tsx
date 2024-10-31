import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface RoleContextType {
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const RoleContext = createContext < RoleContextType | undefined > (undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: FC<RoleProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState < string | null > (null);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleAuth = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleAuth must be used within a RoleProvider');
  }
  return context;
};

interface WithRoleAuthProps {
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
}

export function withRoleAuth<T>(Component: React.ComponentType<T & WithRoleAuthProps>) {
  return function RoleAuthWrapper(props: T) {
    const { setUserRole, userRole } = useRoleAuth();

    return (
      <Component
        {...props}
        setUserRole={setUserRole}
        userRole={userRole}
      />
    );
  };
}
