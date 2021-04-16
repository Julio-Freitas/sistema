import { createContext, useEffect, useState } from 'react';
import firebase from '../services/firebaseConection';
import { toast } from 'react-toastify';
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem('SistemaUser');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }

    loadStorage();
  }, []);

  async function siginUp(email, password, name) {
    try {
      setLoadingAuth(true);

      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const { uid } = userCredential.user;

      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .set({ name, avatarUrl: null })
        .then(() => {
          const data = {
            uid,
            name,
            email: userCredential.user.email,
            avatarUrl: null
          };
          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success('Bem vindo!');
        });
    } catch (error) {
      setLoadingAuth(true);
      toast.error('Algo deu errado!');
      console.log(error);
    }
  }

  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }

  async function signOUt() {
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }

  async function singIn(email, password) {
    try {
      setLoadingAuth(true);
      const loginAuth = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const { uid } = loginAuth.user;

      const userProfiler = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get();

      const data = {
        uid,
        name: userProfiler.data().name,
        avatarUrl: userProfiler.data().avatarUrl,
        email
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success('Bem vindo!');
    } catch (error) {
      setLoadingAuth(true);
      toast.error('Algo deu errado!');
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        siginUp,
        signOUt,
        singIn,
        loadingAuth,
        setUser,
        storageUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
