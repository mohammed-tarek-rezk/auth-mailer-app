import { Navigate, Route, Routes } from "react-router-dom"
import {FloatingShapes, ForgetEmail, Login, Register, ResetEmail, VerifyEmail} from "./components"
import { MAIN_LINKS } from "./srevices/links.services"
import {Toaster} from "react-hot-toast"
import { useAuth } from "./store/authStore"
import { Children, useEffect, useState } from "react"
import HomePage from "./components/HomePage"

const ProtectedRoutes = ({children})=>{
  const {isAuthenticated, user}=useAuth()
  if(!isAuthenticated)return  <Navigate to="/login" />
  if(!user?.isVerified)return <Navigate to="/verify-email" />
  return children
}

const RedirectAuthnticatedUser = ({children})=>{
  const {isAuthenticated, user}=useAuth()
  if(isAuthenticated  && user?.isVerified) return <Navigate to="/" />

  return children
}
function App() {
  let {isCheckingAuth , checkAuthFun , user , isAuthenticated}=useAuth()
  console.log("🚀 ~ App ~ user:", user)
  console.log("🚀 ~ App ~ isAuthenticated:", isAuthenticated)
  useEffect(()=> {
    checkAuthFun()
  },[checkAuthFun])
  
  return (
    <div className="w-screen h-screen bg-gradient-to-r relative  from-gray-900 via-green-900 to-emerald-900  flex justify-center items-center overflow-hidden">
			<FloatingShapes color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShapes color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShapes color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

      <Routes>
        <Route path="/"  element={<ProtectedRoutes><HomePage /></ProtectedRoutes>}/>
        <Route path={MAIN_LINKS.LOGIN}  element={<Login/>}/>
        <Route path={MAIN_LINKS.REGISTER}  element={ <RedirectAuthnticatedUser><Register/></RedirectAuthnticatedUser>}/>
        <Route path={MAIN_LINKS.VERIFY_EMAIL}  element={<VerifyEmail/>}/>
        <Route path={MAIN_LINKS.FORGET_PASSWORD}  element={<ForgetEmail/>}/>
        <Route path="/reset-password/:token"  element={<ResetEmail/>}/>
        <Route path="*"  element={<HomePage/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
