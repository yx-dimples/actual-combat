import React, { useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid, Tooltip, IconButton, Drawer, AppBar, Toolbar,
  Typography, List, ListItem, ListItemText, ListItemIcon
} from '@material-ui/core'
import {
  KeyboardArrowDown, Share, GetApp, PlayCircleOutline, PauseCircleOutline,
  FavoriteBorder, MoreVert, Chat, PlaylistPlay, SkipPrevious,
  SkipNext, Favorite, PlayArrow
} from '@material-ui/icons'
import { Tag, Toast } from 'antd-mobile'
import { ExclamationCircleOutline } from 'antd-mobile-icons'
import { getSongUrl, likeSong, getLikelist, getLyric } from '../../api/songs'
import playBar from '../../assets/images/play-bar.png'
import Progress from '../../components/Progress'
import { formatDuration, playModeMap } from '../../utils'
import { changePlayState, setPlayMode, saveSongUrl, saveSongIds } from '../../actions'
import './index.less'

const useStyles = makeStyles((theme) => ({
  topIcons: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  bottomIcons: {
    textAlign: 'center',
    '& .MuiGrid-spacing-xs-3': {
      width: '90%',
      margin: '0 auto',
      alignItems: 'center'
    }
  },
  toolbar: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: '#f5f5f5'
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    },
    '& .MuiTypography-h6': {
      fontWeight: '600'
    }
  }
}))

function Song(props) {
  const navigate = useNavigate()
  const classes = useStyles()
  const audio = useRef(null)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [totalSecond, setTotalSecond] = React.useState(0)
  const [showLyric, setShowLyric] = React.useState(false)
  const [islike, setIslike] = React.useState(
    props.likeSongIds !== 0 ?
      props.likeSongIds.includes(props.newSongDetail.id) :
      false
  )
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [lyric, setLyric] = React.useState([])
  const [isActive, setIsActive] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(null)

  const { al: { picUrl, name: alName }, name, ar, dt } = props.newSongDetail

  const getStyle = useMemo(() => {
    const style = {
      background: `url(${picUrl}) center`,
    }
    return style
  }, [picUrl])

  const currentMode = useMemo(() => {
    return playModeMap[props.playMode]
  }, [props.playMode])

  const playModeText = useMemo(() => {
    return currentMode.name
  }, [currentMode.name])

  const modeIcon = useMemo(() => {
    return currentMode.icon
  }, [currentMode.icon])

  React.useEffect(() => {
    getLyric(props.newSongDetail.id).then(res => {
      const lrc = res.data.lrc.lyric
      // 解析歌词
      const lyrics = lrc.split('\n')
      const lrcObj = []
      for (let i = 0;i < lyrics.length;i++) {
        const lyric = decodeURIComponent(lyrics[i])
        const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g
        const timeRegExpArr = lyric.match(timeReg)
        if (!timeRegExpArr) continue
        const content = lyric.replace(timeReg, '')
        for (let k = 0, h = timeRegExpArr.length;k < h;k++) {
          const t = timeRegExpArr[k]
          const min = Number(String(t.match(/\[\d*/i)).slice(1))
          const sec = Number(String(t.match(/:\d*/i)).slice(1))
          const time = min * 60 + sec
          if (content !== '') {
            lrcObj.push({ time: time, content })
          }
        }
      }
      setLyric(lrcObj)
    })
  }, [props.newSongDetail.id])

  const progressEnd = (value) => {
    audio.current.currentTime = value * dt
    setCurrentTime(audio.current.currentTime)
  }

  const onCanPlay = () => {
    setTotalSecond(audio.current.duration)
    props.changePlayState(true)
    audio.current.play()
  }

  const onTimeupdate = () => {
    setCurrentTime(audio.current.currentTime)
    if (audio.current.currentTime === audio.current.duration) {
      props.changePlayState(false)
    }
  }
  // 播放
  const play = () => {
    if (props.playingList.length === 0) {
      Toast.show({
        icon: <ExclamationCircleOutline />,
        content: '播放列表为空'
      })
    } else {
      if (props.songUrl !== '') {
        audio.current.play()
        props.changePlayState(true)
      } else {
        getSongUrl(props.newSongDetail.id).then(res => {
          props.saveSongUrl(res.data.data[0].url)
        })
      }

    }
  }
  // 暂停
  const pause = () => {
    audio.current.pause()
    props.changePlayState(false)
  }

  // 改变播放模式
  const onChangePlayMode = () => {
    const modeKeys = Object.keys(playModeMap)
    const currentModeIndex = modeKeys.findIndex(
      key => playModeMap[key].code === props.playMode
    )
    const nextIndex = (currentModeIndex + 1) % modeKeys.length
    const nextModeKey = modeKeys[nextIndex]
    const nextMode = playModeMap[nextModeKey]
    props.setPlayMode(nextMode.code)
  }

  // 单曲循环
  const loopPlay = () => {
    audio.current.loop = true
    audio.current.play()
  }

  // 切歌
  const toggleSong = (type) => {
    console.log(props.playingList);
    if (props.playingList.length === 0) {
      Toast.show({
        icon: <ExclamationCircleOutline />,
        content: '播放列表为空'
      })
    } else if (props.playingList.length === 1) {
      Toast.show({
        icon: <ExclamationCircleOutline />,
        content: '当前播放列表只有一首歌'
      })
      play()
    } else {
      if (props.playMode === 'loop' || props.playMode === 'one') {
        orderPlay(type)
      } else if (props.playMode === 'shuffle') {
        randomPlay()
      }
    }
  }
  // 1 顺序模式
  const orderPlay = (type) => {
  }

  // 随机播放
  const randomPlay = () => {
  }

  // 下载
  const downloadCurrentMusic = () => {
  }

  // 喜欢
  const likeNowSongBy = () => {
    let like = islike ? false : true
    likeSong({
      id: props.newSongDetail.id,
      like
    }).then(() => {
      getLikelist(props.userInfo.userId).then(res => {
        props.saveSongIds(res.data.ids)
        if (islike === true) {
          Toast.show({
            icon: 'success',
            content: '已添加到我喜欢的音乐'
          })
          setIslike(true)
        } else {
          Toast.show({
            icon: 'success',
            content: '取消喜欢成功'
          })
          setIslike(false)
        }
      })
    })

  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLyricToggle = () => {
    setShowLyric(!showLyric)
  }

  // 点击歌词播放
  const lyricClick = (lyric) => {
    audio.current.currentTime = lyric.time
    setIsActive(false)
  }

  // 歌词上是否显示时间
  const showTime = index => {
    setCurrentIndex(index)
    setIsActive(true)
  }

  const drawer = (
    <div className='song-drawer'>
      <div className={classes.toolbar}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" >
              {name}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className='content'>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={'歌手: ' + ar[0].name} />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={'歌手: ' + ar[0].name} />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={'专辑: ' + alName} />
          </ListItem>
        </List>
      </div>
    </div>
  )

  return (
    <>
      <div className='song-mask' style={getStyle} />
      <div className='song-wraps'>
        <div className='song-header'>
          <div className='icon' onClick={() => navigate(-1)}>
            <KeyboardArrowDown style={{ color: '#fff', fontSize: '40px' }} />
          </div>
          <div className='song-info'>
            <div className='name'>
              <p>{name}</p>
            </div>
            <div className='ar'>
              <p>{ar[0].name}</p>
              <Tag
                color='#ccc'
                style={{ '--border-radius': '6px' }}
              >关注</Tag>
            </div>
          </div>
          <div className='icon'>
            <Share style={{ color: '#fff', fontSize: '25px' }} />
          </div>
        </div>

        {
          showLyric ?
            <div className='song-content'>
              <div className='song-content-head'>
                head
              </div>
              <div className='lyric'>
                {/* {console.log(formatlyric.length)} */}
                {
                  lyric.length !== 0 ? <ul>
                    {
                      lyric.map((item, index) => (
                        <li
                          key={index}
                          onClick={lyricClick.bind(this, item)}
                          onMouseOver={showTime.bind(this, index)}
                          onMouseLeave={() => setIsActive(false)}
                        >
                          {
                            isActive && currentIndex === index &&
                            <IconButton
                              color='inherit'
                              aria-label='play icon'
                              className='playIcon'>
                              <PlayArrow />
                            </IconButton>
                          }
                          <span className='lyric-item'>{item.content.trim()}</span>
                          {
                            isActive && currentIndex === index &&
                            <span className='time'>{formatDuration(item.time)}</span>
                          }
                        </li>
                      ))
                    }
                  </ul> :
                    <p className='no-lyric' >
                      暂无歌词，请您欣赏
                    </p>
                }
              </div>
            </div>
            :
            <div className='song-content' onClick={handleLyricToggle}>
              <img src={playBar} className={props.isPlaying ? 'play-bar imgabc' : 'play-bar'} alt='' />
              <div className='img-outer-bg'>
                <div className='img-outer-border'>
                  <div className='img-outer'>
                    <div className="img-wrap">
                      <img src={picUrl} alt='' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='info-icons'>
                <div className={classes.topIcons}>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <IconButton
                        color='inherit'
                        aria-label='down music'
                        onClick={downloadCurrentMusic}
                      >
                        <GetApp style={{ fontSize: '30px' }} />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3}>
                      {
                        islike ?
                          <IconButton
                            color='inherit'
                            aria-label='like song'
                            onClick={likeNowSongBy}
                          >
                            <Favorite style={{ color: '#cd1a17', fontSize: '30px' }} />
                          </IconButton> :
                          <IconButton
                            color='inherit'
                            aria-label='like song'
                            onClick={likeNowSongBy}>
                            <FavoriteBorder style={{ fontSize: '30px' }} />
                          </IconButton>
                      }
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton
                        color='inherit'
                        aria-label='comment'
                      >
                        <Chat style={{ fontSize: '30px' }} />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton
                        color='inherit'
                        aria-label='apen dwawer'
                        onClick={handleDrawerToggle}
                      >
                        <MoreVert style={{ fontSize: '30px' }} />
                      </IconButton>
                      <Drawer
                        // container={container}
                        variant="temporary"
                        anchor='bottom'
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                          paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                          keepMounted: true,
                        }}
                      >
                        {drawer}
                      </Drawer>
                    </Grid>
                  </Grid>
                </div>
              </div>


            </div>
        }

        <div className='song-footer'>
          <div className='time-progress'>
            <span>{formatDuration(currentTime)}</span>
            <Progress
              percent={currentTime / dt}
              dragEnd={progressEnd}
            />
            <span>{formatDuration(totalSecond)}</span>
          </div>
          <div className={classes.bottomIcons}>
            <Grid container spacing={3}>
              <Grid item xs>
                <Tooltip title={playModeText}>
                  <i onClick={onChangePlayMode} className={`iconfont icon-${modeIcon} icons`} />
                </Tooltip>
              </Grid>
              <Grid item xs>
                <SkipPrevious onClick={toggleSong.bind(this, 0)} style={{ fontSize: '30px' }} />
              </Grid>
              <Grid item xs>
                {
                  props.isPlaying ?
                    <PauseCircleOutline onClick={pause} style={{ fontSize: '50px' }} /> :
                    <PlayCircleOutline onClick={play} style={{ fontSize: '50px' }} />
                }
                {/* <ChatBubbleOutline style={{ fontSize: '50px' }} /> */}
              </Grid>
              <Grid item xs>
                <SkipNext onClick={toggleSong.bind(this, 0)} style={{ fontSize: '30px' }} />
              </Grid>
              <Grid item xs>
                <PlaylistPlay style={{ fontSize: '35px' }} />
              </Grid>
            </Grid>
          </div>
        </div>

        <audio
          src={props.songUrl}
          ref={audio}
          autoPlay
          onTimeUpdate={onTimeupdate}
          preload={'auto'}
          onCanPlay={onCanPlay}
          onEnded={props.playMode === 'one' ? loopPlay() : toggleSong.bind(this, 1)}
        />

      </div>
    </>
  )
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    newSongDetail: state.newSongDetail,
    isPlaying: state.isPlaying,
    playingList: state.playingList,
    songUrl: state.songUrl,
    playMode: state.playMode,
    likeSongIds: state.likeSongIds
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changePlayState: res => dispatch(changePlayState(res)),
    setPlayMode: res => dispatch(setPlayMode(res)),
    saveSongUrl: res => dispatch(saveSongUrl(res)),
    saveSongDetail: res => dispatch(saveSongUrl(res)),
    saveSongIds: res => dispatch(saveSongIds(res))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song)
