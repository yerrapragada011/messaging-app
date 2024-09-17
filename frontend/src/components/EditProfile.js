import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function EditProfile() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/profile`, {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setEmail(userData.email || '')
          setBio(userData.profile?.bio || '')
        } else {
          const errorText = await response.text()
          console.error('Error fetching user data:', errorText)
          setError('Failed to load user profile')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Something went wrong')
      }
    }

    fetchUserData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, bio }),
        credentials: 'include'
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        navigate('/profile')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Save Changes</button>
      </form>
    </div>
  )
}

export default EditProfile
