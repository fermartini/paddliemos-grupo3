import React from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Inicio from './components/Inicio'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Inicio />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;