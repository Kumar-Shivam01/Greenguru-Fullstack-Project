import { createContext, useContext, useState,useEffect } from 'react'
import {login as loginApi, logout as logoutApi,getCurrentUser} from '../api/authApi'

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        checkAuth()
    },[])

    const checkAuth = async () => {
    try {
      const response = await getCurrentUser();

      setUser(response.data.data); //depends on the actualJSON structure returned by your login controller
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }; 

    const login = async(credentials)=>{
      const response = await loginApi(credentials)
      setUser(response.data.user)
      return response
    }

    const logout = async()=>{
        try{
          await logoutApi()
        }finally{
          setUser(null)
        }
    }

    return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  ); 
}
export function useAuth(){
    return useContext(AuthContext);
}
