import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Aside from '../../components/Aside';
import Footer from '../../components/Footer';
import './index.scss'

const Layout: React.FC = () => {
  return (
    <div className='layout'>
      <div className='header'>
        <Header />
      </div>
      
      <div className='main'>
        <div className='menu'>
          <Aside />
        </div>
        <div className='content'>
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Layout