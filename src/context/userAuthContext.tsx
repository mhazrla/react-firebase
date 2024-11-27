/* eslint-disable react-hooks/rules-of-hooks */
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";

interface IUserAuthProviderProps {
  children: React.ReactNode;
}

type AuthContextData = {
  user: User | null;
  logIn: typeof logIn;
  signUp: typeof signUp;
  logOut: typeof logOut;
  oAuth: typeof oAuth;
};

const logIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  signOut(auth);
};

const oAuth = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

export const userAuthContext = createContext<AuthContextData>({
  user: null,
  logIn,
  signUp,
  logOut,
  oAuth,
});

export const UserAuthProvider: React.FunctionComponent<
  IUserAuthProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
      }

      return () => {
        unsubscribe();
      };
    });
  });

  const value: AuthContextData = {
    user,
    logIn,
    signUp,
    logOut,
    oAuth,
  };

  return (
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
