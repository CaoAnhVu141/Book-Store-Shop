import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'

function Layout() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Outlet/>
    </>
  )
}

export default Layout
