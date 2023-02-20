import React, { useState } from 'react';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Input, Dropdown, Avatar, Modal } from 'antd';
import Albums from '@material-ui/icons/Album'
import { HomeOutlined, UserOutlined, FullscreenExitOutlined, SearchOutlined } from '@ant-design/icons'
import { MusicNote, PlaylistPlay, Group } from '@material-ui/icons'
import { getSuggest } from '../../api/search'
import { Song, Artist, Album, Playlist } from '../../types'
import { requestFullScreen } from '../../utils'
import Login from '../Login'
import './index.scss';

interface IProps {
  isLogin: boolean
  userInfo: any
}

const Header = ({ isLogin, userInfo }: IProps) => {
  const navigate = useNavigate()
  const [keywords, setKeywords] = useState<string>('')
  const [songs, setSongs] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [suggest, setSuggest] = useState(false)
  const [open, setOpen] = useState(false); 

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => navigate(`/user/${userInfo.userId}`)}>
          <i className='fa fa-user' style={{ color: '#666' }} />&nbsp;
          我的主页
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <i className='fa fa-power-off' style={{ color: '#666' }} />&nbsp;
          退出
        </div>
      ),
    },
  ];

  const onSearch = (e: any) => {
    const keywords = e.target.value
    setKeywords(keywords)
    if (keywords.length !== 0) {
      setSuggest(true)
      getSuggest(keywords).then(res => {
        const { songs, albums, artists, playlists } = res.data.result
        setSongs(songs)
        setArtists(artists)
        setAlbums(albums)
        setPlaylists(playlists)
      })
    } else {
      setSuggest(false)
    }
  }

  const fullscreen = () => {
    requestFullScreen(document.documentElement)
  }

  const onPressEnter = (e: any) => {
    const keywords = e.target.value
    setSuggest(false)
    navigate(`/search/song/${keywords}/${1}`)
  }

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <div className='header'>
      <div className='left'>
        <ul className='left-ul'>
          <li className='red'><HomeOutlined onClick={() => navigate('')} /></li>
          <li className='green'><FullscreenExitOutlined onClick={fullscreen} /></li>
        </ul>
      </div>
      <div className='right'>
        <div className='search-input'>
          <Input onChange={onSearch} onPressEnter={onPressEnter} size='small' defaultValue={keywords} placeholder="音乐/视频/电台/用户" prefix={<SearchOutlined />} />
        </div>
        {
          suggest && 
          <div className='search-detail'>
            {
              songs.length !==0 && <div className='item'>
                <h3><MusicNote fontSize="small" />&nbsp;单曲</h3>
                <ul>
                  {
                    songs.map((item, index) => (
                      <li key={index}>
                        {item.name}-{
                          item.artists.map((e, i) => (
                            <span key={i}>{e.name}</span>
                          ))
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
            }
            {
              artists.length !== 0 && <div className='item'>
                <h3><Group fontSize="small" />&nbsp;歌手</h3>
                <ul className='odd'>
                  {
                    artists.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))
                  }
                </ul>
              </div>
            }
            {
              albums.length !== 0 && <div className='item'>
                <h3><Albums fontSize='small' />&nbsp;专辑</h3>
                <ul>
                  {
                    albums.map((item, index) => (
                      <li key={index}>{item.name}-{item.artist?.name}</li>
                    ))
                  }
                </ul>
              </div>
            }
            {
              playlists.length !== 0 && <div className='item'>
                <h3><PlaylistPlay fontSize='small' />&nbsp;歌单</h3>
                <ul className='odd'>
                  {
                    playlists.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))
                  }
                </ul>
              </div>
            }
          </div>
        }
        {
          isLogin ?
            <Dropdown menu={{ items }} placement="bottom" arrow>
              <Avatar size="large" src={<img src={userInfo.avatarUrl} alt="avatar" />} />
            </Dropdown>
           : 
           <>
            <Avatar
              icon={<UserOutlined />}
              onClick={showModal} 
              style={{ background: '#bfbfbf' }}
            />
            <Modal
              open={open}
              onOk={hideModal}
              onCancel={hideModal}
              footer={null}
              width='400px'
            >
              <Login hideModal={hideModal} />
            </Modal>
           </>
        }
      </div>
    </div>
  )
}

function mapStateToProps(state: any) {
  return {
    isLogin: state.isLogin,
    userPlayingList: state.userPlayingList,
    userInfo: state.userInfo
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)