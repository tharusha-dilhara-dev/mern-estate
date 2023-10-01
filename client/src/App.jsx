import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SingIn from './pages/SingIn'
import SingUp from './pages/SingUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SingIn/>} />
        <Route path='/sign-up' element={<SingUp/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        <Route  element={<PrivateRoute/>} >
          <Route path='/profile' element={<Profile/>} />
          <Route path='/create-listing' element={<CreateListing/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App