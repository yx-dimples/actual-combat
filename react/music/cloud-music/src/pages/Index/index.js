import React, { useMemo } from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles, alpha } from '@material-ui/core/styles'
import {
  IconButton, CssBaseline, AppBar, Toolbar, InputBase, Button
} from '@material-ui/core'
import {
  Menu, Search, ChevronRight, PlayArrow
} from '@material-ui/icons'
import Slider from "react-slick"
import { Tabs, Toast } from 'antd-mobile'
import { ExclamationOutline } from 'antd-mobile-icons'
import DrawerView from '../../components/Drawer'
import { getBanner, getPersonalized, getTopSong, getTopAlbum, getCalendar } from '../../api/discovery.js'
import { checkMusic, getSongUrl, getSongDetail } from '../../api/songs'
import { formatNumber, formatStartDate, formaEndtDate } from '../../utils'
import { saveSongUrl, addPlayingList, saveSongDetail } from '../../actions'

import './index.less'

const drawerWidth = 328

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    flexGrow: 1,
    '& .MuiAppBar-colorPrimary': {
      color: '#fff',
      backgroundColor: '#cd1a17'
    }
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }
}))

const settings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 3000,
  autoplay: true,
  nextArrow: <Arrow />,
  prevArrow: <Arrow />
}

function Arrow(props) {
  return (
    <div />
  )
}

function Index(props) {
  const { userInfo } = props

  const classes = useStyles()
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)
  const [banner, setBanner] = React.useState([])
  const [navList] = React.useState([
    {
      icon: 'iconfont icon-recommend',
      text: '每日推荐',
      path: '/recommend'
    },
    {
      icon: 'iconfont icon-fm',
      text: '私人FM',
    },
    {
      icon: 'iconfont icon-songList',
      text: '歌单',
      path: '/playlists'
    },
    {
      icon: 'iconfont icon-ranking',
      text: '排行榜',
      path: '/ranking'
    }
  ])
  const [recommend, setRecommend] = React.useState([])
  const [topSong, setTopSong] = React.useState([])
  const [topAlbum, setTopAlbum] = React.useState([])
  const [calendar, setCalendar] = React.useState([])

  // react中使用计算属性
  const getData = useMemo(() => {
    let nowDate = new Date()
    return nowDate.getDate()
  }, [])

  React.useEffect(() => {
    // banner
    getBanner().then(res => {
      setBanner(res.data.banners)
    })
    // 推荐歌单
    getPersonalized().then(res => {
      setRecommend(res.data.result)
    })
    // 新歌
    getTopSong().then(res => {
      setTopSong(res.data.data.splice(0, 6))
    })
    // 新碟
    getTopAlbum({
      type: 'new'
    }).then(res => {
      setTopAlbum(res.data.weekData.splice(0, 6))
    })

    const now = new Date()
    const nowDay = now.getDate()
    const nowMonth = now.getMonth()
    let nowYear = now.getYear()
    nowYear += (nowYear < 2000) ? 1900 : 0
    // 获取今天的开始时间
    const getTodayStartDate = new Date(nowYear, nowMonth, nowDay)
    // 获取今天的结束时间
    const getTodayEndDate = new Date(nowYear, nowMonth, nowDay)
    // 音乐日历
    getCalendar({
      startTime: Date.parse(formatStartDate(getTodayStartDate)),
      endTime: Date.parse(formaEndtDate(getTodayEndDate)),
    }).then(res => {
      setCalendar(res.data.data.calendarEvents)
    })

  }, [])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const toPage = (item, type) => {
    switch (type) {
      case 'songs':
        checkMusic(item.id).then(res => {
          if (res.data.message === 'ok') {
            getSongUrl(item.id).then(res => {
              props.saveSongUrl(res.data.data[0].url)
            })
            getSongDetail(item.id).then(res => {
              props.addPlayingList(res.data.songs[0])
              props.saveSongDetail(res.data.songs[0])
              navigate('/song')
            })
          }
        }).catch(() => {
          Toast.show({
            icon: <ExclamationOutline />,
            content: '暂时无法播放，换首试试',
          })
        })

        break;
      case 'navList':
        if (item.text === '私人FM') {
          // navigate(`/song/${props.userInfo.userId}`)
        } else {
          navigate(item.path)
        }
        break
      case 'album':
        console.log(item.id)
        navigate(`/album/${item.id}`)
        break
      default:
        break
    }


  }

  const toPlayListDetail = item => {
    navigate(`/playlist/${item.id}`)
  }

  return (
    <div className='index'>
      <CssBaseline />
      <div className={classes.toolbar}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <Menu />
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>

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

        {/* banner */}
        <div className='banner'>
          <Slider {...settings}>
            {
              banner.map((item, index) => (
                <div key={index}>
                  <img src={item.imageUrl} alt='' />
                </div>
              ))
            }
          </Slider>
        </div>
        {/* nav导航 */}
        <div className='nav'>
          {
            navList.map((item, index) => (
              <div className='nav-item' key={index} onClick={toPage.bind(this, item, 'navList')}>
                <div className='nav-top'>
                  <i className={item.icon}></i>
                  {
                    item.text === '每日推荐' &&
                    <p className='nav-item-date'>
                      {
                        getData
                      }
                    </p>
                  }
                </div>
                <p className='text'>{item.text}</p>
              </div>
            ))
          }
        </div>

        {/* 推荐歌单 */}
        <div className='recommend wrapper'>
          <div className='wrapper-head'>
            <div className='title'>推荐歌单</div>
            <Button
              className={classes.btn}
              variant="outlined"
              endIcon={<ChevronRight />}
              size='small'
              onClick={() => navigate('/playlists')}
            >更多</Button>
          </div>
          <ul className='recommend-list'>
            {
              recommend.map((item, index) => (
                <li key={index} onClick={toPlayListDetail.bind(this, item)}>
                  <div className='img-wrap'>
                    <img src={item.picUrl} alt='' />
                    <div className='play-count'>
                      <PlayArrow />
                      {formatNumber(item.playCount)}
                    </div>
                  </div>
                  <p>{item.name}</p>
                </li>
              ))
            }
          </ul>
        </div>

        {/* 新歌 新碟 */}
        <div className='tabs wrapper'>
          <Tabs>
            <Tabs.Tab title='新歌' key={'1'}>
              <ul>
                {
                  topSong.map((item, index) => (
                    <li key={index}>
                      <img onClick={toPage.bind(this, item, 'songs')} src={item.album.blurPicUrl} alt='' />
                      <div className='info'>
                        <div className='info-name'>
                          <span onClick={toPage.bind(this, item, 'songs')}> {item.name}</span>
                          <span> - {item.artists[0].name}</span>
                        </div>
                        <div className='info-company'>
                          {item.album.company}
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </Tabs.Tab>
            <Tabs.Tab title='新碟' key={'2'}>
              <ul>
                {
                  topAlbum.map((item, index) => (
                    <li key={index} >
                      <img onClick={toPage.bind(this, item, 'album')} src={item.picUrl} alt='' />
                      <div className='info'>
                        <div className='info-name'>
                          <span onClick={toPage.bind(this, item, 'album')}> {item.name}</span>
                          <span> - {item.artists[0].name}</span>
                        </div>
                        <div className='info-company'>
                          {item.company}
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </Tabs.Tab>
          </Tabs>
        </div>

        {/* 音乐日历 */}
        <div className='calendar wrapper'>
          <div className='wrapper-head'>
            <div className='title'>音乐日历</div>
            <Button
              className={classes.btn}
              variant="outlined"
              endIcon={<ChevronRight />}
              size='small'
            >今日{calendar.length}条</Button>
          </div>
          <ul className='calendar-list'>
            {
              calendar.map((item, index) => (
                <li key={index}>
                  <div className='list-left'>
                    <Button className='tag' size='small'>{item.tag}</Button>
                    <div className='title'>{item.title}</div>
                  </div>
                  <div className='list-right'>
                    <img src={item.imgUrl} alt='' />
                  </div>
                </li>
              ))
            }
          </ul>
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
    saveSongUrl: res => dispatch(saveSongUrl(res)),
    saveSongDetail: res => dispatch(saveSongDetail(res)),
    addPlayingList: res => dispatch(addPlayingList(res))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
