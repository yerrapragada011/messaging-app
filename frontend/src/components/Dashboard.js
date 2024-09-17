import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('/profile', {
          credentials: 'include'
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        } else {
          const errorText = await userResponse.text()
          console.error('Error fetching user data 1:', errorText)
          setError('Failed to load user profile')
        }

        const messagesResponse = await fetch('/profile/messages', {
          credentials: 'include'
        })
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData)
        } else {
          const errorText = await messagesResponse.text()
          console.error('Error fetching messages:', errorText)
          setError('Failed to load messages')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Something went wrong')
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/auth/login')
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2>Welcome to your Dashboard, {user.username}</h2>

      <button onClick={handleLogout}>Logout</button>

      <section>
        <h3>Your Profile</h3>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>{' '}
        <p>
          <strong>Joined on:</strong> {user.createdAt}
        </p>
      </section>

      <section>
        <h3>Your Messages</h3>
        {messages.length === 0 ? (
          <p>No messages to display</p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>From:</strong> {message.sender.username} <br />
                <strong>To:</strong> {message.receiver.username} <br />
                <strong>Message:</strong> {message.content} <br />
                <strong>Sent on:</strong>{' '}
                {new Date(message.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard
