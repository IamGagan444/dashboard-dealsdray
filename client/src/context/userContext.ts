import { useContext, createContext } from "react";
import { User } from "../types/user";
import Cookies from "js-cookie";
export const userContext = createContext({
  userData:null,
  setUserData:(value:any|User)=>{},
  isAuthenticated:false,
  setAuthnticated:(value:boolean)=>{}
});

export const UserContextProvider = userContext.Provider;

export default function CustomUser() {
  return useContext(userContext);
}
