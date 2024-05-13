"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/footer';
import Header from '../components/header';
import Link from 'next/link';

const DashboardPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
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

      const response = await axiosInstance.get('http://localhost:4000/messages', config);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/signin');
  };

  const handleViewMessage = (messageId: any) => {
    router.push(`/messages/${messageId}`); // Navigate to individual message page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <h2 className="text-xl font-bold mb-2">Inbox:</h2>
        <ul>
  {messages.map((message) => (
    <li key={message.id} className="cursor-pointer" onClick={() => handleViewMessage(message.id)}>
      <div>
        <strong>{message.user ? message.user.name : 'Unknown User'}</strong>:
      </div>
      <div>{message.content}</div>
    </li>
  ))}
</ul>
        <Link href="/sendmessage">
          <div className="text-blue-500 underline mb-8 cursor-pointer">Send Message</div>
        </Link>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
