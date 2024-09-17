import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SendMessage() {
  const [recipients, setRecipients] = useState([])
  const [selectedRecipient, setSelectedRecipient] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await fetch('/send-message/users', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setRecipients(data)
        } else {
          setError('Failed to load recipients')
        }
      } catch (err) {
        setError('Something went wrong')
      }
    }

    fetchRecipients()
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedRecipient,
          content: messageContent
        }),
        credentials: 'include'
      })

      if (response.ok) {
        alert('Message sent successfully!')
        setSelectedRecipient('')
        setMessageContent('')
        navigate('/profile')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to send message')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div>
      <h2>Send a Message</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSendMessage}>
        <div>
          <label htmlFor='recipient'>Recipient:</label>
          <select
            id='recipient'
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            required
          >
            <option value=''>Select a recipient</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='message'>Message:</label>
          <textarea
            id='message'
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default SendMessage
