"use client";
// Import necessary libraries
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Footer from '../components/footer';
import Header from '../components/header';

import axios from 'axios';

// Define the DashboardPage component
const DashboardPage = () => {
  
  const router = useRouter();
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    // Fetch recipients after login
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:4000/messages');
      // Assuming the response contains an array of recipient names
      setRecipients(response.data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  // Define handleLogout function to clear access token from local storage and redirect to login page
  const handleLogout = () => {
    

    if (localStorage.getItem("token")==null) router.push("/signin");
    const handleLogout = () => {
      axios.post("http//localhost:4000/auth/logout",{},
        {
          headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization : "Bearer"+localStorage.getItem("token")
          }
        }
      ).then((res)=>{localStorage.clear();
        router.push("/signin");
      }) .catch((err)=>{
        console.log(err);
      })
    }

  };

  // Return the JSX for the DashboardPage component
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <h2 className="text-xl font-bold mb-2">People You've Exchanged Messages With:</h2>
        <ul>
          {recipients.map((recipient, index) => (
            <li key={index}>{recipient}</li>
          ))}
        </ul>
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

