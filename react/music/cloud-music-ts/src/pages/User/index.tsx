import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Tag  } from 'antd';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserDetail, getUserRecord, getUserAudio, getUserPlaylist } from '../../api'
import { User, Song, DJ, Playlist } from '../../types'
import { formatNumber } from '../../utils';
import SongTable from '../../components/SongTable';
import PlayListCard from '../../components/PlayListCard';
import './index.scss';

interface IProps {
  isLogin: boolean
  userInfo: any
}

interface UserItem {
  level: number
  listenSongs: number
  profile?: User
}

const dateCategory = [
  { title: "所有时间", type: 0 },
  { title: "最近一周", type: 1 },
]

const UserDetail = ({ isLogin, userInfo }: IProps) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserItem>({
    level: 0,
    listenSongs: 0
  })

  const [type, setType] = useState<number>(0)
  const [songs, setSongs] = useState<Song[]>([])
  const [djRadios, setDjRadios] = useState<DJ[]>([])
  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist[]>([])
  const [collectPlaylist, setCollectPlaylist] = useState<Playlist[]>([])


  useEffect(() => {
    getUserDetail(Number(id)).then(res => {
      setUser(res.data)
    })

    userRecord()

    getUserAudio(Number(id)).then(res => {
      setDjRadios(res.data.djRadios);
    }).catch(() => {
      setDjRadios([])
    })

    getUserPlaylist(Number(id)).then(res => {
      const playlist = res.data.playlist
      const collectIndex = playlist.findIndex((item: any) => item.creator.userId !== Number(id))
      if (collectIndex !== -1) {
        setCreatedPlaylist(playlist.slice(1, collectIndex))
        setCollectPlaylist(playlist.slice(collectIndex))
      }
    }).catch(() => {
      setCreatedPlaylist([])
      setCollectPlaylist([])
    })

  }, [id, type])

  const userRecord = () => {
    getUserRecord({
      uid: Number(id),
      type
    }).then(res => {
      if (type === 0) {
        res.data.allData.forEach((item: any) => {
          songs.push(item.song);
        });
      }
      if (type === 1) {
        res.data.weekData.forEach((item: any) => {
          songs.push(item.song);
        });
      }
    }).catch(() => {
      setSongs([])
    })
  }
  
  return (
    <div className='user'>
      <div className='hd'>
        <div className='img-wrap'>
          <img src={user.profile?.avatarUrl} alt='' />
        </div>
        <div className='right'>
          <div className='name'>
            <div className='left'>
              <p>{user.profile?.nickname}</p>
              <Tag>Lv.{user.level}</Tag>
              <Button
                variant="contained" 
                color="primary"
                size="small"
                startIcon={<Add />}
              >
              关注
              </Button>
            </div>
            {
              user.profile?.artistId !== undefined  && <Button
                variant="contained" 
                size="small"
                onClick={() => navigate(`/artist/${user.profile?.artistId}`)}
              >
                查看歌手页
              </Button>
            }
            
          </div>
          <ul className='data'>
            <li>
              <p>{user.profile?.eventCount}</p>
              <p>动态</p>
            </li>
            <li>
              <p>{user.profile?.follows}</p>
              <p>关注</p>
            </li>
            <li>
              <p>{user.profile?.followeds}</p>
              <p>粉丝</p>
            </li>
          </ul>
          <p className='desc'>个人简介：{user.profile?.signature?.length !==0 ? user.profile?.signature : '暂无简介'}</p>
        </div>
      </div>
      {/* 听歌排行 */}
      {
        songs.length !==0 &&
        <div className='wrapper'>
          <div className='wrapper-header'>
            <p>听歌排行<span>累计听歌{user.listenSongs}首</span></p>
            <ul className='right'>
              {
                dateCategory.map((item, index) => (
                  <li
                    key={index}
                    className={type === item.type ? 'active' : ''}
                    onClick={() => {
                      setType(item.type)
                      userRecord()
                    }}
                  >
                    {item.title}
                  </li>
                ))
              }
            </ul>
          </div>

          <SongTable song={songs} />
          
        </div>
      }

      {/* 创建的电台 */}
      {
        djRadios.length !== 0 && 
        <div className='wrapper'>
          <p className='wrapper-header'>{user.profile?.nickname}创建的电台</p>

          <ul className='djRadios'>
            {
              djRadios.map((item, index) => (
                <li key={index}>
                  <img src={item.picUrl} alt='' />
                  <p className='name' onClick={() => navigate(`/djradio/${item.id}`)}>{item.name}</p>
                  <p className='subCount'>订阅{formatNumber(item.subCount)}次</p>
                  <p className='programCount'>{formatNumber(item.programCount)}期</p>
                </li>
              ))
            }
          </ul>
        </div>
      }
      
      {/* 创建的歌单 */}
      {
        createdPlaylist.length !==0 &&
        <div className='wrapper'>
          <p className='wrapper-header'>{user.profile?.nickname}创建的歌单 ({createdPlaylist.length})</p>

          <PlayListCard playlist={createdPlaylist} />
        </div>
      }
      
      {/* 收藏的歌单 */}
      {
        collectPlaylist.length !==0 &&
        <div className='wrapper'>
          <p className='wrapper-header'>{user.profile?.nickname}收藏的歌单 ({collectPlaylist.length})</p>
          <PlayListCard playlist={collectPlaylist} />
        </div>
      }
      
    </div>
  )
}

function mapStateToProps(state: any) {
  const { userReducer } = state
  return {
    isLogin: userReducer.isLogin,
    userPlayingList: userReducer.userPlayingList,
    userInfo: userReducer.userInfo
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail)