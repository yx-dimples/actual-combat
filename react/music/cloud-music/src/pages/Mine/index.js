import React from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton, CssBaseline, Typography, Drawer, Button,
  ListItem, List, ListItemIcon, ListItemText
} from '@material-ui/core'
import {
  Menu, Search, Add, MoreVert, KeyboardArrowRight, PlayCircleFilled,
  AddBox, ListAlt
} from '@material-ui/icons'
import { Tabs, Input, Checkbox, Toast } from 'antd-mobile'
import Header from '../../components/Header'
import DrawerView from '../../components/Drawer'
import { userDetail, userPlaylist } from '../../api/user'
import { getRecentSong } from '../../api/songs'
import { getCreatePlayList } from '../../api/playlist'
import beckoning from '../../assets/images/beckoning.png'
import './index.less'

const drawerWidth = 328

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '25px',
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  list: {
    '.MuiListItem-gutters': {
      paddingLeft: 0
    },
    '& .MuiSvgIcon-root': {
      fontSize: '40px'
    },
    '& .MuiTypography-root': {
      marginLeft: '3px',
      fontSize: '20px'
    }
  }
}))


function Mine(props) {
  const { userInfo } = props

  const classes = useStyles()
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)
  const [userDetails, setUserDetails] = React.useState({})
  const [activeKey, setActiveKey] = React.useState('1')
  const [userCreate, setUserCreate] = React.useState([])
  const [likeSongs, setLikeSongs] = React.useState([])
  const [userCollect, setUserCollect] = React.useState([])
  const [recentSong, setRecentSong] = React.useState([])
  const [recentSongTotal, setRecentSongTotal] = React.useState(0)
  const [addOpen, setAddOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [finish, setFinish] = React.useState(true)
  const [privacy, setPrivacy] = React.useState(false)
  const [value, setValue] = React.useState('')

  const [addActiveKey, setAddActiveKey] = React.useState('music')

  const tabItems = [
    { key: '1', title: '创建歌单', list: userCreate },
    { key: '2', title: '收藏歌单', list: userCollect }
  ]

  const AddTabItems = [
    {
      key: 'music', title: '音乐歌单'
    },
    {
      key: 'video', title: '视频歌单'
    }
  ]

  React.useEffect(() => {
    userDetail(userInfo.userId).then(res => {
      setUserDetails(res.data)
    })
    userPlaylist(userInfo.userId).then(res => {
      let create = []
      let collect = []

      res.data.playlist.forEach(item => {
        if (item.userId === userInfo.userId) {
          create.push(item)
        } else {
          collect.push(item)
        }
      })
      setUserCreate(create.splice(1, create.length))
      setLikeSongs(create.splice(0, 1))
      setUserCollect(collect)
    })

    getRecentSong().then(res => {
      setRecentSong(res.data.data.list)
      setRecentSongTotal(res.data.data.total)
    })

  }, [userInfo.userId])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const goUserDetail = () => {
    navigate(`/user/home/${userInfo.userId}`)
  }

  const goRecent = () => {
    navigate('/recent')
  }

  const goPlayList = row => {
    navigate(`/playlist/${row.id}`)
  }

  const handleAddTogger = () => {
    setAddOpen(!addOpen)
  }

  const handleFinish = () => {
    let conceal = ''
    let type = 'NORMAL'
    if (addActiveKey === 'video') {
      type = 'VIDEO'
    }
    if (privacy) {
      conceal = '10'
    }

    console.log(type)

    getCreatePlayList({
      privacy: conceal,
      name: value,
      type
    }).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        Toast.show({
          icon: 'success',
          content: '新建歌单成功'
        })
        setTimeout(() => {
          Toast.show({
            icon: 'loading',
          })
          setTimeout(() => {
            navigate(`/playlist/${res.data.id}`)
          }, 1500)
        }, 2000);
      }
    })
  }

  const handleMoreTogger = () => {
    setMoreOpen(!moreOpen)
  }

  const playmode = (playlist) => {
    console.log(playlist)
  }

  const addDrawer = (
    <div className='add-drawer'>
      <div className='add-header'>
        <div><Button onClick={handleMoreTogger}>取消</Button></div>
        <div><Button onClick={handleFinish} disabled={finish}>完成</Button></div>
      </div>

      <div className='add-tabs'>
        <Tabs
          activeKey={addActiveKey} onChange={key => {
            setAddActiveKey(key)
          }}
        >
          {
            AddTabItems.map(item => (
              <Tabs.Tab title={item.title} key={item.key}>
                <Input
                  placeholder='输入新建歌单标题'
                  clearable
                  value={value}
                  max={20}
                  onChange={val => {
                    setValue(val)
                    setFinish(false)
                  }}
                />

                <div className='check-box'>
                  <Checkbox
                    defaultChecked={privacy}
                    onChange={val => {
                      setPrivacy(val)
                    }}
                  >设为隐私歌单</Checkbox>
                </div>
              </Tabs.Tab>
            ))
          }
        </Tabs>
      </div>
    </div >
  )

  const moreDrawer = (
    <div className='more-drawer'>
      {
        activeKey === '1' ? <>
          <div className='more-header'>
            创建歌单({userCreate.length}个)
          </div>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.list}
          >
            <ListItem button>
              <ListItemIcon onClick={handleAddTogger}>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary="新建歌单" />
            </ListItem>
            <ListItem button>
              <ListItemIcon onClick={() => {
                navigate(`/manage/${activeKey}`)
              }}>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="管理歌单" />
            </ListItem>
          </List>
        </> :
          <>
            <div className='more-header'>
              收藏歌单({userCollect.length}个)
            </div>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.list}
            >
              <ListItem button>
                <ListItemIcon onClick={() => {
                  navigate(`/manage/${activeKey}`)
                }}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="管理歌单" />
              </ListItem>
            </List>
          </>
      }

    </div >
  )

  return (
    <div className='mine'>
      <CssBaseline />
      <Header drawerWidth={drawerWidth}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <Menu style={{ fontSize: '32px' }} />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          我的
        </Typography>
        <IconButton aria-label="search" color="inherit">
          <Search style={{ fontSize: '32px' }} />
        </IconButton>
      </Header>
      <DrawerView
        drawerWidth={drawerWidth}
        open={open}
        handleDrawerClose={handleDrawerClose}
        drawerHeader={classes.drawerHeader}
        userInfo={userInfo}
      />
      <main
        className={clsx(classes.content)}
      >
        <div className={classes.drawerHeader} />

        {/* 我的信息 */}
        <div className='userinfo wrapper'>
          <div className='top'>
            <img
              src={userInfo.avatarUrl}
              alt=''
              onClick={goUserDetail}
            />
            <p className='nickname'>{userInfo.nickname}</p>
          </div>
          <p className='bottom'>
            {userInfo.follows}&nbsp;&nbsp;关注&nbsp;&nbsp;&nbsp;&nbsp;
            {userInfo.followeds}&nbsp;&nbsp;粉丝&nbsp;&nbsp;&nbsp;&nbsp;
            Lv.{userDetails.level}
          </p>
        </div>

        {/* 我喜欢的音乐 */}
        <div className='wrapper likeSongs'>
          {
            likeSongs.map((item, index) => (
              <div className='item' key={index}>
                <img src={item.coverImgUrl} alt='' onClick={() => {
                  navigate(`/playlist/${item.id}`)
                }} />
                <div className='info' onClick={() => {
                  navigate(`/playlist/${item.id}`)
                }} >
                  <p className='name'>我喜欢的音乐</p>
                  <p className='track-count'>{item.trackCount} 首</p>
                </div>
                <div className='beckoning' onClick={playmode.bind(this, item)}>
                  <img src={beckoning} alt='' />
                  <span>心动模式</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* 最近播放 */}
        <div className='recent'>
          <div className='recent-header'>
            <p className='recent-name'>最近播放</p>
            <KeyboardArrowRight onClick={goRecent} />
          </div>
          {
            recentSong.length === 0 ? '1' :
              <>
                {
                  recentSong.slice(0, 1).map((item, index) => (
                    <div key={index}
                      className='list-item'
                      onClick={goRecent}
                    >
                      <img src={item.data.al.picUrl} alt='' />
                      <IconButton
                        color="inherit"
                        aria-label="play"
                        className='play-button'
                      >
                        <PlayCircleFilled style={{ fontSize: '32px', color: '#7e7e7e' }} />
                      </IconButton>
                    </div>
                  ))
                }
              </>
          }
          <div className='count'>已播歌曲 {recentSongTotal}</div>
        </div>

        {/* 创建歌单、收藏歌单 */}
        <div className='tabs' >
          <Tabs activeKey={activeKey} onChange={key => {
            setActiveKey(key)
          }}>
            {tabItems.map(item => (
              <Tabs.Tab title={item.title} key={item.key}>
                <RenderContent
                  tabItems={item}
                  handleAdd={handleAddTogger}
                  handleMore={handleMoreTogger}
                  addOpen={addOpen}
                  moreOpen={moreOpen}
                  addDrawer={addDrawer}
                  moreDrawer={moreDrawer}
                  goPlayList={goPlayList}

                />
              </Tabs.Tab>
            ))}
          </Tabs>
        </div>
      </main >
    </div >
  )
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Mine)

function RenderContent(props) {
  const { tabItems, handleAdd, handleMore, addOpen, moreOpen, addDrawer, moreDrawer, goPlayList } = props
  return (
    <div className='tabs-content'>
      <div key={tabItems.key} className='tabs-content-item wrapper'>
        <div className='item-header'>
          <p> {tabItems.title} ( {tabItems.list.length} 个)</p>
          <div className='item-right'>
            {
              tabItems.key === '1' &&
              <IconButton
                onClick={handleAdd}
                color="inherit"
                aria-label="open add drawer"
              >
                <Add style={{ color: '#7e7e7e' }} />
              </IconButton>
            }
            <IconButton
              onClick={handleMore}
              color="inherit"
              aria-label="open more drawer"
            >
              <MoreVert style={{ color: '#7e7e7e' }} />
            </IconButton>
          </div>
        </div>
        <ul>
          {
            tabItems.list.map((row, index) => (
              <li key={index} onClick={goPlayList.bind(this, row)}>
                <img src={row.coverImgUrl} alt='' />
                <div className='row-right'>
                  <p className='name ellipsis'>{row.name}</p>
                  <div className='track-count'>
                    <span>{row.trackCount}首</span>
                    {
                      tabItems.key === '2' &&
                      <span className='nickname'>by {row.creator.nickname}</span>
                    }
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <Drawer
        variant='temporary'
        anchor='bottom'
        onClose={handleMore}
        open={moreOpen}
        ModalProps={{
          keepMounted: true
        }}
      >
        {moreDrawer}
      </Drawer>

      <Drawer
        variant='temporary'
        anchor='bottom'
        onClose={handleAdd}
        open={addOpen}
        ModalProps={{
          keepMounted: true
        }}
      >
        {addDrawer}
      </Drawer>
    </div >
  )
}