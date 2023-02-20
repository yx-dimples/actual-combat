import React, { Component } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Discovery from './pages/Discovery'
import Login from './pages/Login'
import Category from './pages/DJ/Category'
import Program from './pages/DJ/Program'
import Djradio from './pages/DJ/Djradio'
import Comment from './pages/Comment'
import Recommend from './pages/Recommend'
import PlayLists from './pages/PlayLists'
import PlayList from './pages/PlayLists/PlayList'
import UserDetail from './pages/Mine/UserDetail'
import Recent from './pages/Mine/Recent'
import Manage from './pages/PlayLists/Manage'
import Song from './pages/Song'
import Rank from './pages/Rank'
import Album from './pages/Album'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/ranking' element={<Rank />} />
            <Route path='/recent' element={<Recent />} />
            <Route path='/playlists' element={<PlayLists />} />
            <Route path='/recommend' element={<Recommend />} />
            <Route path='/djradio/category/:id' element={<Category />} />
            <Route path='/user/home/:id' element={<UserDetail />} />
            <Route path='/program/:id' element={<Program />} />
            <Route path='/album/:id' element={<Album />} />
            <Route path='/djradio/:id' element={<Djradio />} />
            <Route path='/comment/:id' element={<Comment />} />
            <Route path='/manage/:id' element={<Manage />} />
            <Route path='/playlist/:id' element={<PlayList />} />
            <Route path='/song' element={<Song />} />
            <Route path='/login' element={<Login />} />
            <Route path='/discovery/*' element={<Discovery />} />
            {/* 重定向 */}
            <Route path="*" element={<Navigate to='/discovery/*' />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}
