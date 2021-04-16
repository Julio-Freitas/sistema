import { useState, createContext } from 'react';

export const UserContext = createContext({
  alunos: '',
  setAlunos: () => false
});

function UserProvider({ children }) {
  const [alunos, setAlunos] = useState('Juliooo');
  return (
    <UserContext.Provider value={{ alunos, setAlunos }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
