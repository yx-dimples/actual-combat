import React, { useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { getPlayListDetail, getPlayTrackAll } from '../../../api/playlist'
import { IconButton, ButtonGroup, Button } from '@material-ui/core'
import {
  ArrowBackIos, Search, MoreHoriz, Add, ChevronRight,
  CreateNewFolderOutlined, CommentOutlined, ShareOutlined
} from '@material-ui/icons'
import { PlayOutline } from 'antd-mobile-icons'
import { formatNumber } from '../../../utils'
import MusicList from '../../../components/MusicList'
import './index.less'

const useStyles = makeStyles((theme) => ({
  headerFooter: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '5px',
    width: '100%',
    '& .MuiButtonGroup-contained': {
      boxShadow: 'none'
    },
    '& .MuiButton-root': {
      backgroundColor: '#fff'
    },
    '& button:first-of-type': {
      borderTopLeftRadius: '100px',
      borderBottomLeftRadius: '100px',
    },
    '& button:last-of-type': {
      borderTopRightRadius: '100px',
      borderBottomRightRadius: '100px',
    }
  }
}))

function PlayList(props) {
  const getParams = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const header = useRef(null)

  const [playlist, setPlaylist] = React.useState({})
  const [songs, setSongs] = React.useState([])

  React.useEffect(() => {
    getPlayListDetail(getParams.id).then(res => {
      setPlaylist(res.data.playlist)
    })
    getPlayTrackAll(getParams.id).then(res => {
      setSongs(res.data.songs)
    })


  }, [getParams.id])

  const getStyle = useMemo(() => {
    const style = {
      background: `url(${playlist.coverImgUrl}) center`,
      width: '100%',
      height: '280px',
      filter: 'blur(15px)',
    }
    return style
  }, [playlist.coverImgUrl])

  return (
    <div className='playlist'>
      <div className='playlist-header'>
        <div style={getStyle} />
        <div className='header-top' ref={header}>
          <IconButton color='inherit' onClick={() => { navigate(-1) }}>
            <ArrowBackIos style={{ fontSize: '30px' }} />
          </IconButton>
          <div className='right'>
            <IconButton color='inherit'>
              <Search style={{ fontSize: '35px' }} />
            </IconButton>
            <IconButton color='inherit'>
              <MoreHoriz style={{ fontSize: '30px' }} />
            </IconButton>
          </div>
        </div>

        <div className='header-content'>
          <div className='img-wrap'>
            <img src={playlist.coverImgUrl} alt='' />
            <div className='play-count'>
              <PlayOutline fontSize={20} />
              {formatNumber(playlist.playCount)}
            </div>
          </div>
          <div className='info'>
            <p className='info-name'> {playlist.name} </p>
            {
              playlist.creator && <div className='info-author'>

                <img src={playlist.creator.avatarUrl} alt='' />
                <p className='info-nickname'>{playlist.creator.nickname}</p>
                {
                  playlist.creator.userId !== props.userInfo.userId &&

                  <div className='info-follow'>
                    <Add />
                    关注
                  </div>
                }
              </div>
            }
            <div className='info-description'>
              <p>{playlist.description}</p>
              <ChevronRight />
            </div>
          </div>
        </div>

        <div className={classes.headerFooter}>
          <ButtonGroup aria-label="button group">
            <Button
              startIcon={<CreateNewFolderOutlined />}
              size='large'
            >{formatNumber(playlist.subscribedCount)}</Button>
            <Button
              startIcon={<CommentOutlined />}
              size='large'
            >{formatNumber(playlist.commentCount)}</Button>
            <Button
              startIcon={<ShareOutlined />}
              size='large'
            >{formatNumber(playlist.shareCount)}</Button>
          </ButtonGroup>
        </div>
      </div>

      <MusicList list={songs} />

    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(PlayList)
