import React from 'react';
import { connect } from 'react-redux'
import { getLyric } from '../../api'
import { lyricParser, isDef } from '../../utils'
import { changePlayState } from '../../action'
import Comment from '../Comment'
import './index.scss'

interface IProps {
  nowSongDetail: any
  isPlaying: boolean
  currentTime: any
  changePlayState: any
}

interface LyricItem {
  time: string
  content: string
  contents: any
}

const Player = (props: IProps) => {

  const playBarSupport = require('../../assets/img/play-bar-support.png')
  const playBar = require('../../assets/img/play-bar.png')

  const [lyric, setLyric] = React.useState<any>([])
  const [tlyric, setTlyric] = React.useState<any>([])
  const [nolyric , setNolyric ] = React.useState<boolean>(false)

  const scroller = React.createRef<any>()

  React.useEffect(() => {
    getLyric(props.nowSongDetail.id).then(res => {
      setNolyric(!isDef(res.data.lrc) || !res.data.lrc.lyric)
      if (!nolyric) {
        const { lyric, tlyric } =  lyricParser(res.data)
        setLyric(lyric)
        setTlyric(tlyric)
      }

    })
  }, [nolyric, props.nowSongDetail.id])
  
  const getActiveCls = (index: number) => {
    return activeLyricIndex === index ? 'active' : ''
  }

  const lyricWithTranslation = React.useMemo(() => {
    let ret: LyricItem[] = []
    // 空内容的去除
    const lyricFiltered = lyric.filter(({ content }: { content: any }) => Boolean(content))
    if (lyricFiltered.length) {
      lyricFiltered.forEach((element: any) => {
        const { time, content } = element
      
        const lyricItem: LyricItem  = { time, content, contents: [content] }

        const sameTimeTLyric = tlyric.find(
          ({ time: tLyricTime }: { time: any, tLyricTime : any }) => tLyricTime === time
        )

        if (sameTimeTLyric) {
          const { content: tLyricContent } = sameTimeTLyric
          if (content) {
            lyricItem.contents.push(tLyricContent)
          }
        }
        ret.push(lyricItem)
      }) 
    } else {
      ret = lyricFiltered.map(({ time, content }: { time: any, content: any }) => ({
        time,
        content,
        contents: [content]
      }))
    }
    
    return ret
  }, [lyric, tlyric])

  const activeLyricIndex = React.useMemo(() => {
    return lyricWithTranslation
    ? lyricWithTranslation.findIndex((l, index) => {
        const nextLyric = lyricWithTranslation[index + 1]
        return (
          props.currentTime >= l.time &&
          (nextLyric ? props.currentTime < nextLyric.time : true)
        )
      })
    : -1
  }, [lyricWithTranslation, props.currentTime])

  return (
    <div className='player'>
      <div className='content'>
        <div className='song'>
          <div className='left' >
            <img className='play-bar-support' src={playBarSupport} alt='' />
            <img className={`play-bar ${props.isPlaying && 'playing'}` } src={playBar} alt='' />
            <div className='img-outer-border' onClick={() => props.changePlayState(!props.isPlaying)}>
              <div className={`img-outer ${!props.isPlaying && 'paused'}`}>
                <div className='img-wrap'>
                  <img src={props.nowSongDetail.al.picUrl} alt='' />
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className='name-wrap'>
              <p className='name'>{props.nowSongDetail.name}</p>
              {
                props.nowSongDetail.mv ? <span>mv</span> : ''
              }
            </div>
            <div className='artists'>
            歌手：<span>{props.nowSongDetail.ar[0].name}</span>
            </div>

            {
              nolyric && <p className='empty'>没有歌词哦!!!</p>
            }

            <div className='lyric-wrap' ref={scroller}>
              {
                lyricWithTranslation.map((l , index) => (
                  <div
                    className={`lyric-item ${getActiveCls(index)}`}
                    key={index}
                  >
                    {
                      l.contents.map((content: any, contentIndex: number) => (
                        <p key={contentIndex}>{content}</p>
                      ))
                    }
                  </div>
                ))}
            </div>

          </div>
        </div>
        <div className='bottom'>
          <Comment id={props.nowSongDetail.id} type='music' />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    nowSongDetail: state.nowSongDetail,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime 
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    changePlayState: (res: any) => dispatch(changePlayState(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)