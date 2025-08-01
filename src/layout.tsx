import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import AppHeader from './components/layout/app.header'
import { fetchAccountAPI } from './services/api'
import { useCurrentApp } from './components/context/app.context'

function Layout() {

  const {setUser,setIsAuthenticated} = useCurrentApp();

  useEffect(()=> {
    const fetchAccount = async () => {
      const response = await fetchAccountAPI();
      if(response.data){
        setUser(response.data.user);
      }
      console.log("check response: ", response);
    }
    fetchAccount();
  },[]); 

  
  return (
    <>
    <AppHeader/>
      <Outlet/>
    </>
  )
}

export default Layout
