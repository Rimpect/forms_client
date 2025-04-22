import { useState } from 'react'
import { useForm } from 'react-hook-form';
import Header from './components/Header';
import Footer from './components/Footer';
import Start_page from './components/Start_page';
import Form_registration from './components/Form_registration';
import Personal_account from "./components/Personal_account";
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
function App() {
  return (
    <div className="min-h-screen flex flex-col">
    <Router>
      <Routes>
        <Route path="/" element={<Start_page />} />
        <Route path="/components/Personal_account" element={<Personal_account />} /> 
      </Routes>
      <Footer />
    </Router>
    </div>
  );
} 

export default App
