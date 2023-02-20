import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton, Typography } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { getRecommendSongs } from '../../api/songs'
import MusicList from '../../components/MusicList'
import './index.less'

export default function Recommend() {
  const navigate = useNavigate()
  const header = useRef(null)

  const [dailySongs, setDailySongs] = React.useState([])
  const [headerClass, setHeaderClass] = React.useState('header-top')

  React.useEffect(() => {
    getRecommendSongs().then(res => {
      setDailySongs(res.data.data.dailySongs)
    })
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.addEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    console.log(header.current.getBoundingClientRect().height)
    if (header.current.getBoundingClientRect().top < 0) {
      setHeaderClass(
        'header-top header-top_fixed'
      )
    } else {
      setHeaderClass(
        'header-top'
      )
    }
  }

  // react中使用计算属性
  const getData = useMemo(() => {
    let nowDate = new Date()
    return nowDate.getDate()
  }, [])

  const getMonth = useMemo(() => {
    let nowDate = new Date()
    return nowDate.getMonth() + 1
  }, [])


  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className='recommend'>
      <div className='recommend-header'>
        <div className={headerClass} ref={header}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={goBack}
          >
            <ArrowBackIos />
          </IconButton>
          <Typography variant="h5" noWrap>
            每日推荐
          </Typography>
        </div>
        <div className='header-bottom'>
          <div className='month-data'>
            <Typography variant="h3">
              {getMonth}
            </Typography>
            <Typography variant="h5">
              /
            </Typography>
            <Typography variant="h5">
              {getData}
            </Typography>
          </div>
          <p>定制你今日的专属好音乐~</p>
        </div>
      </div>
      <MusicList list={dailySongs} />
    </div>
  )
}
