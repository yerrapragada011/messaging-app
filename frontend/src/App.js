import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import SendMessage from './components/SendMessage'
import EditProfile from './components/EditProfile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Dashboard />} />
          <Route path='/send-message' element={<SendMessage />} />
          <Route path='/edit-profile' element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
