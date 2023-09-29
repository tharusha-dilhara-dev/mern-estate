import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SingIn from './pages/SingIn'
import SingUp from './pages/SingUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SingIn/>} />
        <Route path='/sign-up' element={<SingUp/>} />
        <Route path='/about' element={<About/>} />
        <Route  element={<PrivateRoute/>} >
          <Route path='/profile' element={<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App