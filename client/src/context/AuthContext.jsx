import { createContext, useContext, useState } from 'react'
const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);

    const login = async(userData)=>{
        setUser(null)
    }

    const logout = ()=>{
        setUser(null)
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
