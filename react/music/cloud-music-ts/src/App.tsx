import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Layout from './pages/Layout'
// 发现
import Discover from './pages/Discover'
import Index from './pages/Discover/childcomps/Index'
import PlayLists from './pages/Discover/childcomps/PlayList'
import Ranking from './pages/Discover/childcomps/Ranking'
import Singer from './pages/Discover/childcomps/Singer'
import NewSongs from './pages/Discover/childcomps/NewSongs'
// 搜索
import Search from './pages/Search'
import SongRes from './pages/Search/childcomps/SongRes';
import MvRes from './pages/Search/childcomps/MvRes';
// 推荐视频
import Recvideo from './pages/Recvideo'
// 每日推荐
import RecEveryDay from './pages/RecEveryDay'
// 我的收藏
import MyFavorite from './pages/MyFavorite'
// 歌单详情
import PlayListDetail from './pages/PlayList'
// mv详情
import MvDetail from './pages/Mv'
// 视频详情
import VideoDetail from './pages/Video'
// 歌手详情
import Artist from './pages/Artist'
// 专辑详情
import Album from './pages/Album'
// 用户信息
import User from './pages/User'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          
          <Route path="/" element={<Discover/>} >
            <Route path='' element={<Navigate to='/discover/index' />}  />
            <Route path='/discover/index' element={<Index />} />
            <Route path='/discover/playlist' element={<PlayLists />} />
            <Route path='/discover/ranking' element={<Ranking />} />
            <Route path='/discover/singer' element={<Singer />} />
            <Route path='/discover/newsongs' element={<NewSongs />} />
          </Route>
          
          <Route path="search" element={<Search/>} >
            <Route path='search' element={<Navigate to='/search/song/:keywords/:type' />}  />
            <Route path='/search/song/:keywords/:type' element={<SongRes />} />
            <Route path='/search/mv/:keywords/:type' element={<MvRes />} />
          </Route>
          
          <Route path='/recvideo' element={<Recvideo />} />
          <Route path="receveryday" element={<RecEveryDay/>} />
          <Route path='myfavorite' element={<MyFavorite />} />
        
          <Route path='/playlist/:id' element={<PlayListDetail />} />
          <Route path='/mv/:id' element={<MvDetail />} />
          <Route path='/video/:id' element={<VideoDetail />} />

          <Route path='/artist/:id' element={<Artist />} />
          <Route path='/album/:id' element={<Album />} />

          <Route path='/user/:id' element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;