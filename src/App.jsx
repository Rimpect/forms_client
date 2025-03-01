import { useState } from 'react'
import { useForm } from 'react-hook-form';
import Header from './components/Header';
import Footer from './components/Footer';
import Form_registration from './components/Form_registration';
import Personal_account from "./components/Personal_account";
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
    <Router>
      <Header /> {/* Header будет отображаться на всех страницах */}
      <Routes>
        <Route path="/" element={<Form_registration />} /> {/* Форма регистрации */}
        <Route path="/components/Personal_account" element={<Personal_account />} /> {/* Личный кабинет */}
      </Routes>
      <Footer /> {/* Footer будет отображаться на всех страницах */}
    </Router>
    </div>
  );
} 

export default App
