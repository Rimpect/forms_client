import { useState } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">Main Content</main>
      <Footer />
    </div>
  );
} 

export default App
