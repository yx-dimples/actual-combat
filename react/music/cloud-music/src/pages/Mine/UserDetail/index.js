import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { IconButton, Button } from '@material-ui/core'
import {
  ArrowBackIos, MoreVert, Favorite, HourglassFull, Add
} from '@material-ui/icons'
import { Tabs } from 'antd-mobile'
import { userDetail, userPlaylist, getUserEvent } from '../../../api/user'
import { getLikelist } from '../../../api/songs'
import { formatDate, formatNumber } from '../../../utils'
import './index.less'

function UserDetail(props) {
  const navigate = useNavigate()
  const params = useParams()

  const [profile, setProfile] = React.useState({})
  const [level, setLevel] = React.useState(0)
  const [subcount, setSubcount] = React.useState({})
  const [likelist, setLikeList] = React.useState(0)
  const [userCreate, setUserCreate] = React.useState([])
  const [userCollect, setUserCollect] = React.useState([])
  const [events, setEvents] = React.useState([])

  React.useEffect(() => {
    userDetail(params.id).then(res => {
      setProfile(res.data.profile)
      const { level, profile, createDays, listenSongs } = res.data
      const { follows, followeds } = profile
      const count = {
        follows, followeds, createDays, listenSongs
      }
      setSubcount(count)
      setLevel(level)
    })

    getLikelist(params.id).then(res => {
      setLikeList(res.data.ids.length)
    })

    userPlaylist(params.id).then(res => {
      let create = []
      let collect = []

      res.data.playlist.forEach(item => {
        if (item.userId === Number(params.id)) {
          create.push(item)
        } else {
          collect.push(item)
        }
      })
      setUserCreate(create.splice(1, create.length))
      setUserCollect(collect)
    })

    getUserEvent({
      uid: params.id
    }).then(res => {
      setEvents(res.data.events)
    })

  }, [params.id])

  const getStyle = useMemo(() => {
    return {
      width: '100vw',
      height: '240px',
      backgroundImage: `url(${profile.backgroundUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }
  }, [profile.backgroundUrl])

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className='user-detail'>
      <div style={getStyle} className='user-header'>
        <div>
          <IconButton
            color="inherit"
            aria-label="go back"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIos style={{ color: '#fff', fontSize: '30px' }} />
          </IconButton>
        </div>
        <div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={goBack}
          >
            <MoreVert style={{ color: '#fff', fontSize: '34px' }} />
          </IconButton>
        </div>
      </div>

      <div className='userinfo wrapper'>
        <div className='img-wrap'>
          <img src={profile.avatarUrl} alt='' />
        </div>
        <div className='nickname'>{profile.nickname}</div>
        {
          profile.allAuthTypes &&
          <div className='auth-types'>
            <span>
              {profile.allAuthTypes[0].desc}
            </span>
            {
              profile.allAuthTypes[0].tags.map((item, index) => (
                <span key={index}>{item}</span>
              ))
            }
          </div>
        }
        <div className='count'>
          {subcount.follows}&nbsp;&nbsp;关注&nbsp;&nbsp;&nbsp;&nbsp;
          {subcount.followeds}&nbsp;&nbsp;粉丝&nbsp;&nbsp;&nbsp;&nbsp;
          Lv.{level}
        </div>
        {
          props.userInfo.userId !== Number(params.id) &&
          <Button startIcon={<Add />} className='follow'>关注</Button>
        }
      </div>

      <div className='tabs'>
        <Tabs>
          <Tabs.Tab title='主页' key='1'>
            <RenderHomePage
              profile={profile}
              subcount={subcount}
              likelist={likelist}
              userCreate={userCreate}
              userCollect={userCollect}
            />
          </Tabs.Tab>
          <Tabs.Tab title='动态' key='2'>
            <RenderUserEvent events={events} />
          </Tabs.Tab>
        </Tabs>
      </div>
    </div >
  )
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetail)


// 主页
function RenderHomePage(props) {
  const { profile, subcount, likelist, userCreate, userCollect } = props

  return (
    <div className='home-page'>
      <div className='information wrapper'>
        <p className='information-header'>基本信息</p>
        <div className='information-content'>
          <p>村龄：{subcount.createDays}天 ({formatDate(profile.createTime, 'yyyy年MM月')}注册)</p>
          <p>年龄：{formatDate(profile.birthday, 'yyyy年MM日')}</p>
        </div>
      </div>

      <div className='taste wrapper'>
        <p className='taste-header'>音乐品味</p>

        <ul>
          <li>
            <div className='item-header'>我的喜欢</div>
            <div className='item-count'>{likelist}首</div>
            <div className='item-footer'><Favorite style={{ fontSize: '15px' }} />喜欢的音乐</div>
          </li>
          <li>
            <div className='item-header'>累计听歌</div>
            <div className='item-count'>{subcount.listenSongs}首</div>
            <div className='item-footer'><i className='iconfont icon-ranking' />听歌排行</div>
          </li>
          <li>
            <div className='item-header'>关键词</div>
            <div className='item-count'>每一首歌都心动</div>
            <div className='item-footer'><HourglassFull style={{ fontSize: '15px' }} />黑胶时光机</div>
          </li>
        </ul>
      </div>

      <div className='create wrapper'>
        <p className='create-header'>
          创建的歌单 <span>({userCreate.length}个)</span>
        </p>
        <ul>
          {
            userCreate.map((item, index) => (
              <li key={index}>
                <img src={item.coverImgUrl} alt='' />
                <div className='info'>
                  <p className='name'>{item.name}</p>
                  <div className='count'>
                    {formatNumber(item.trackCount)} 首，
                    <span>
                      {item.playCount !== 0 && <>
                        播放 {item.playCount} 次
                      </>
                      }
                    </span></div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>

      <div className='create wrapper'>
        <p className='create-header'>
          收藏的歌单 <span>({userCollect.length})</span>
        </p>
        <ul>
          {
            userCollect.map((item, index) => (
              <li key={index}>
                <img src={item.coverImgUrl} alt='' />
                <div className='info'>
                  <p className='name'>{item.name}</p>
                  <div className='count'>
                    {item.trackCount} 首，
                    By {item.creator.nickname}
                    ，
                    <span>
                      {item.playCount !== 0 && <>
                        播放 {formatNumber(item.playCount)} 次
                      </>
                      }
                    </span>

                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>

    </div >
  )
}

function RenderUserEvent(props) {
  const { events } = props
  return (
    <div className='user-event'>
      {
        events.length === 0 ?
          <div className='empty'>
            暂无相关动态
          </div> :
          <>2</>
      }
    </div>
  )
}