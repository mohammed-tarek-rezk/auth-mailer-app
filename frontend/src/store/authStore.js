import { create } from 'zustand'
import axios from 'axios'

let backEnd_url = "http://localhost:5500/api/users"
axios.defaults.withCredentials = true;
export const useAuth = create((set) => ({
  isLoading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  isCheckingAuth: true,

  signUpUser: async(name , email , password)=>{
    set({isLoading: true})
    try{
        const res = await axios.post(`${backEnd_url}/signup` , {name: name, email: email, password: password})
        set({isLoading: false , user: res.data.data, isAuthenticated: true})
    }catch(e){
        set({isLoading: false , error: e.response.data.message})
        throw e;
    }
  },
  loginUserFu: async( email , password)=>{
    set({isLoading: true , error: null})
    try{
        const res = await axios.post(`${backEnd_url}/login`,{email , password} )
        set({isLoading: false , user: res.data.data, isAuthenticated: true})
    }catch(e){
        set({isLoading: false , error: e.response.data.message})
        throw e;
    }
  },

  verifyEmailFun: async(code)=>{
    set({isLoading: true})
    try{
        const res = await axios.post(`${backEnd_url}/verify-email` , {code: code})
        set({isLoading: false , user: res.data.data , isAuthenticated: true})
        return res.data
    }catch(e){
        set({isLoading: false , error: e.response.data.message})
        throw e;
    }
  },

  checkAuthFun: async()=>{
    set({isLoading: true , isCheckingAuth: true , error: null})
    try{
        const res = await axios.get(`${backEnd_url}/check` )
        set({isLoading: false , user: res.data.data , isAuthenticated: true , isCheckingAuth: false})
        return res.data
    }catch(e){
        set({isLoading: false , error: null , isCheckingAuth: false, isAuthenticated: false})
        throw e;
    }
  },
  forgotPassword: async(email)=>{
    set({ isLoading: true, error: null });
    try {
        await axios.post(`${backEnd_url}/forget-password`, {email});
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
        set({ error: error, isLoading: false });
        throw error;
    }
  },
  resetPassword: async(token, password)=>{
    set({ isLoading: true, error: null });
    try {
        await axios.post(`${backEnd_url}/reset-password/${token}`, {password});
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
        set({ error: error, isLoading: false });
        throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
        await axios.post(`${backEnd_url}/logout`);
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
        set({ error: "Error logging out", isLoading: false });
        throw error;
    }
},}))