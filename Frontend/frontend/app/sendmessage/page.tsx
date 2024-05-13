// SendMessagePage.js
"use client";
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';

const SendMessagePage = () => {
  const router = useRouter();
  const [recipientUsername, setRecipientUsername] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        router.push('/signin');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const data = {
        recipientUsername,
        content
      };

      await axiosInstance.post('http://localhost:4000/messages', data, config);
      // Optionally, you can redirect the user to the inbox after sending the message
      router.push('/dashboard');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Send a Message</h1>
      {error && <p>{error}</p>}
      <input type="text" placeholder="Recipient Username" value={recipientUsername} onChange={(e) => setRecipientUsername(e.target.value)} />
      <textarea placeholder="Message Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default SendMessagePage;
