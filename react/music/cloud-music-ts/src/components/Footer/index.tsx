import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess, FormatIndentIncrease, VolumeUp, VolumeOff,
  SkipPrevious, SkipNext, PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons'
import { Drawer } from '@material-ui/core';
import { message, Tooltip, Slider } from 'antd'
import { setPlayMode, changePlayState, setCurrentTime, saveSongDetail } from '../../action'
import { formatDuration, playModeMap, formatDate, getRandomNumber } from '../../utils'
import { getSongUrl } from '../../api';
import PlayList from '../PlayList'
import Player from '../Player'
import './index.scss'

interface IProps {
  isPlaying: boolean
  nowSongDetail: any
  currentTime: number
  playMode: string
  setPlayMode: any
  changePlayState: any
  setCurrentTime: any
  playingList: any
  saveSongDetail: any
}

const useStyles = makeStyles({
  drawerPaper: {
    width: '400px',
    marginBottom: '60px',
    height: 'calc(100vh - 63px)',
    zIndex: 1001,
    background: '#363636',
    color: '#b1b1b1',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  drawerPlayer: {
    zIndex: 99,
    marginBottom: '60px',
    height: 'calc(100vh - 63px)',
    background: '#363636',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
})

const Footer = (props: IProps) => {
  const { isPlaying, nowSongDetail, currentTime, playMode, setPlayMode } = props
  const classes = useStyles()
  const img = require('../../assets/img/default_album.jpg')

  const [open, setOpen] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.75)
  const [lastVolume, setLastVolume] = useState<number>(1)
  const [songUrl, setSongUrl] = useState<string>('')
  const [isPlayerShow, setIsPlayerShow] = useState<boolean>(true)
  const [isChanging, setIsChanging] = useState(false); // 是否正在滑动

  const [progress, setProgress] = useState(0); // 滑块进度

  const duration = nowSongDetail.dt

  const audioRef: any = useRef();

  useEffect(() => {
    if (!nowSongDetail.id) {
      return 
    }
    
    getSongUrl(nowSongDetail.id).then(res => {
      setSongUrl(res.data.data[0].url);
    })
    
    // 设置音量
    audioRef.current.volume = volume

  }, [nowSongDetail.id, volume])

   // 切换歌曲时播放音乐
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying]);

  const togglePlayerShow = () => {
    setIsPlayerShow(!isPlayerShow)
  }

  // 切歌
  const toggleSong = (type: number) => {
    if (props.playingList.length === 0) {
      message.warning('请添加播放列表', 0.5)
    } else {
      orderPlay(type)
    }
  }

  const playMusic = () => {
    console.log('playMusic');
    if (props.playingList.length === 0) {
      message.warning('播放列表为空')
    } else {
      props.changePlayState(true)
      audioRef.current.play()
      audioRef.current.currentTime = currentTime
    }
  }

  const pauseMusic = () => {
    audioRef.current.pause()
    props.changePlayState(false)
  }

  const onChangePlayMode = () => {
    const modeKeys = Object.keys(playModeMap)
    const currentModeIndex = modeKeys.findIndex(
      key => playModeMap[key].code === playMode
    )
    const nextIndex = (currentModeIndex + 1) % modeKeys.length
    const nextModeKey = modeKeys[nextIndex]
    const nextMode = playModeMap[nextModeKey]
    setPlayMode(nextMode.code)
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const cancelMute = () => {
    setVolume(lastVolume)
    audioRef.current.volume = volume
  }

  const muteVolume = () => {
    setLastVolume(volume)
    setVolume(0)
    audioRef.current.volume = 0
  }

  // 更改音量
  const changingVolume = (value: any) => {
    audioRef.current.volume = value / 100;
  }

  // 滑动滑块时触发
  const progressChange = useCallback ((value: number) => {
    // 滑动滑块时:更改标识变量为false(touch move for changing state),此时不会触发onTimeUpdate(歌曲播放事件)
    setIsChanging(true);
    // 更改"当前播放时间"要的是毫秒数: 241840(总毫秒)   1 * 241840 / 1000 241.84 / 60  4.016667
    const currentTime = (value / 100) * duration;
    props.setCurrentTime(currentTime);
    // 更改进度条值
      setProgress(value);
    }, [duration, props]
  );

  // 手指抬起时触发
  const progressAfterChange = useCallback ((value: number) => {
    // 重新设置当前播放时长 value(进度)/100 * duration(总毫秒数) / 1000 得到当前播放的"秒数"
    const currentTime = ((value / 100) * duration) / 1000;
    audioRef.current.currentTime = currentTime;
    // 设置当前播放时间的state,设置的是'毫秒',所以需要*1000
    props.setCurrentTime(currentTime);
    setIsChanging(false);
    // 更改播放状态
    props.changePlayState(true)
    // 播放音乐
    audioRef.current.play();
    },
  [duration, props]);

  // 歌曲播放触发
  const timeUpdate = (e: any) => {
    let currentTime = e.target.currentTime;
    if (!isChanging) {
      props.setCurrentTime(currentTime)
      setProgress(((currentTime * 1000) / duration) * 100);
    }
  }
  
  // 当前歌曲播放结束后
  const handleTimeEnd = () => { 
    if (currentMode.code === 'loop')  {
      audioRef.current.loop = true
      audioRef.current.play();
    } else {
      orderPlay(1)
      props.changePlayState(true)
    }
  }

  const orderPlay = (type: number) => {
    let nowIndex = props.playingList.findIndex((item: any) => nowSongDetail.id === item.id)
    let toggleIndex

    if (currentMode.code === 'random') {
      let random = getRandomNumber(props.playingList.length)
      let randomSong = props.playingList[random];
      props.saveSongDetail(randomSong)
      getSongUrl(randomSong.id).then(res => {
        setSongUrl(res.data.data[0].url);
      })
    } else {
      console.log(nowIndex);
      switch (nowIndex) {
        case -1:
          toggleIndex = 0
          break;
        case 0:
          toggleIndex = type === 0 ? props.playingList.length - 1 : nowIndex + 1;
					break;
        case props.playingList.length - 1:
          toggleIndex = type === 0 ? nowIndex - 1 : 0;
          break
        default:
          toggleIndex = type === 0 ? nowIndex - 1 : nowIndex + 1
          break;
      }
      let togglesong = props.playingList[toggleIndex]
      props.saveSongDetail(togglesong)
      getSongUrl(togglesong.id).then(res => {
        setSongUrl(res.data.data[0].url);
      })
    }

  }


  const currentMode = useMemo(() => {
    return playModeMap[playMode]
  }, [playMode])
  
  const modeIcon = useMemo(() => {
    return `mode-icon iconfont icon-${currentMode.icon}`
  }, [currentMode.icon])
  
  const playModeText = useMemo(() => {
    return currentMode.name
  }, [currentMode.name])

  return (
    <>
      <div className='mini-player'>
        <div className='song'>
        {
          Object.keys(nowSongDetail).length !== 0 ?
            // 有音乐时
            <div className='cover-content'>
              <div className='cover' onClick={togglePlayerShow}>
                <img src={nowSongDetail.al.picUrl} alt='' />
                <div className='bottom'>
                  {
                    isPlayerShow ? <ExpandMore /> : <ExpandLess />
                  }
                </div>
              </div>
              <div className='content'>
                <div className='top'>
                  <p className='name'>{nowSongDetail.name}</p>
                  <p className='artist'> - {nowSongDetail.ar[0].name}</p>
                </div>
                <p className='time'>{formatDuration(currentTime)} / {formatDate(duration, 'mm:ss')}</p>
              </div>
            </div>
          :
            // 没有音乐时
            <div className='cover-content'>
              <div className='cover'>
                <img src={img} alt='' />
              </div>
              <p className='songname'>暂无音乐</p>
            </div>
          }
        </div>
        <div className='control'>
          <SkipPrevious style={{fontSize: '30px', color: '#d33a31'}} onClick={() => toggleSong(-1)} />
            {
              isPlaying ? 
                <PauseCircleFilled onClick={pauseMusic} style={{fontSize: '48px', color: '#d33a31'}} /> : 
                <PlayCircleFilled onClick={playMusic} style={{fontSize: '48px', color: '#d33a31'}} />
            }
          <SkipNext style={{fontSize: '30px', color: '#d33a31'}} onClick={() => toggleSong(1)} />
        </div>
        <div className='mode'>
          {/* 模式 */}
          <Tooltip title={playModeText}>
            <i className={modeIcon} onClick={onChangePlayMode} />
          </Tooltip>
          {/* 播放列表 */}
          <div className='list-item'>
            <FormatIndentIncrease style={{ color: '#b1b1b1' }} onClick={handleDrawerOpen} />
            <Drawer
              anchor="right"
              open={open}
              onClose={handleDrawerClose}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <PlayList />
            </Drawer>
          </div>
          {/* 音量 */}
          <div className='volume-item'>
            <div className='volume-icons'>
              {
                volume === 0 ?
                  <VolumeOff onClick={cancelMute} style={{ color: '#b1b1b1' }} />: 
                  <VolumeUp onClick={muteVolume} style={{ color: '#b1b1b1' }} />
              }
            </div>
            <div className='volume-progress'>
              <Slider value={volume * 100} onChange={changingVolume} />
            </div>
          </div>
        </div>
        <div className='progress-bar-wrap'>
          <Slider
            defaultValue={0}
            value={progress}
            onChange={progressChange}
            onAfterChange={progressAfterChange}
          />
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={timeUpdate}
          onEnded={handleTimeEnd}
          preload="auto"
          src={songUrl}
        />
      </div>
      {
        (isPlayerShow && Object.keys(nowSongDetail).length !== 0) ? <Player /> : ''
      }
    </>
  )
}

function mapStateToProps(state: any) {
  return {
    isPlaying: state.isPlaying,
    nowSongDetail: state.nowSongDetail,
    currentTime: state.currentTime,
    playMode: state.playMode,
    playingList: state.playingList
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setPlayMode: (res: string) => dispatch(setPlayMode(res)),
    changePlayState: (res: boolean) => dispatch(changePlayState(res)),
    setCurrentTime: (res: number) => dispatch(setCurrentTime(res)),
    saveSongDetail: (res: any) => dispatch(saveSongDetail(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
