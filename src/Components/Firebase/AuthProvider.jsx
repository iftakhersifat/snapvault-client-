import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from './Firebase';
export const AuthContext = createContext();
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    // console.log(user);
    
    // for google login
    const googleProvider = (provider)=>{
        return signInWithPopup(auth, provider);
    }

    const createUser =(email, password)=>{
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const LogIn =(email, password)=>{
        return signInWithEmailAndPassword(auth, email, password)
    }

    // hold login info
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
        });
        return ()=>{
            unsubscribe();
        }
    },[])

    // logout
    const logOut =()=>{
        return signOut(auth);
    }

    // update user
    const UpdateUser =(updatedData)=>{
        return updateProfile(auth.currentUser, updatedData);
    }

    const authData ={
        user,
        setUser,

        createUser,
        LogIn,
        logOut,
        UpdateUser,
        googleProvider,
    }
    return <AuthContext.Provider value={authData}>
        {children}
    </AuthContext.Provider>
};

export default AuthProvider;