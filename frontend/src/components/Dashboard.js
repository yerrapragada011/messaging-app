import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  // const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`/profile`, {
          credentials: 'same-origin'
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        } else {
          const errorText = await userResponse.text()
          console.error('Error fetching user data 1:', errorText)
          setError('Failed to load user profile')
        }

        const messagesResponse = await fetch(`/profile/messages`, {
          credentials: 'same-origin'
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
    navigate('/')
  }

  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this message?'
    )

    if (confirmDelete) {
      try {
        const response = await fetch(`/send-message/${messageId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageId)
          )
          alert('Message deleted successfully!')
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Failed to delete message')
        }
      } catch (err) {
        setError('Something went wrong')
      }
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
      <h2>Welcome to your Dashboard, {user.username}</h2>

      <button onClick={handleLogout}>Logout</button>

      <section>
        <h3>Your Profile</h3>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Bio:</strong> {user.profile?.bio || 'No bio available'}
        </p>
        <p>
          <strong>Joined on:</strong> {user.createdAt}
        </p>
        <Link to='/edit-profile'>Edit Profile</Link>
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
                <button onClick={() => handleDeleteMessage(message.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <Link to='/send-message'>Send a Message</Link>
      </section>
    </div>
  )
}

export default Dashboard
