import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layout
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import CreateStory from '../pages/CreateStory'
import EditStory from '../pages/EditStory'
import StoryView from '../pages/StoryView'
import Library from '../pages/Library'
import Notifications from '../pages/Notifications'
import AdminDashboard from '../pages/AdminDashboard'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

const AppRouter = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/create-story" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
          <Route path="/edit-story/:id" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
          <Route path="/story/:id" element={<StoryView />} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppRouter