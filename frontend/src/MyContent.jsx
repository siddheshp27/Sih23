import { createContext, useState } from 'react';
export const ClientContext = createContext({});

export const ClientProvider = ({ children }) => {
  const [loggedUserData, setloggedUserData] = useState('py');

  const values = {
    loggedUserData,
    setloggedUserData
  };
  return <ClientContext.Provider value={values}>{children}</ClientContext.Provider>;
};
