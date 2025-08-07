import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import AppHeader from './components/layout/app.header'
import { fetchAccountAPI } from './services/api'
import { useCurrentApp } from './components/context/app.context'
import { ScaleLoader } from 'react-spinners'

function Layout() {

  const { setUser, setIsAuthenticated, isLoadingApp, setIsLoadingApp } = useCurrentApp();


  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     const response = await fetchAccountAPI();
  //     if (response.data) {
  //       setUser(response.data.user);
  //       setIsAuthenticated(true);
  //     }
  //     // set time to loading icon
  //     setTimeout(() => {
  //     setIsLoadingApp(false);
  //   }, 1500);
  //   }
  //   fetchAccount();
  // }, []);


  // return (
  //   <>
  //     {isLoadingApp === false ?   // if isLoadingApp == false ==> show information header
  //       <div>
  //         <AppHeader />
  //         <Outlet />
  //       </div>
  //       :
  //       <div className='scale-loading' style={{
  //         position: "fixed", left: "50%", top: "50%"
  //       }}>
  //         <ScaleLoader
  //           height={35}
  //           aria-label="Loading Spinner"
  //           data-testid="loader"
  //           color='#92A5FD'
  //         />
  //       </div>
  //     }

  //   </>
  // )

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default Layout
