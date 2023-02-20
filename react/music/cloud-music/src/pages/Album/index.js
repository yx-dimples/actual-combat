import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAlbum } from '../../api/album'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, ButtonGroup, Button } from '@material-ui/core'
import {
  ArrowBackIos, MoreVert, ChevronRight, CreateNewFolderOutlined, CommentOutlined, ShareOutlined
} from '@material-ui/icons'
import { formatDate, formatNumber } from '../../utils'
import MusicList from '../../components/MusicList'
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
      // backgroundColor: '
      //  border-top-left-radius: ;
      borderTopLeftRadius: '100px',
      borderBottomLeftRadius: '100px',
    },
    '& button:last-of-type': {
      // backgroundColor: '
      //  border-top-left-radius: ;
      borderTopRightRadius: '100px',
      borderBottomRightRadius: '100px',
    }
  }
}))

function Album() {
  const getParams = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const [album, setAlbum] = React.useState({})
  const [songs, setSongs] = React.useState([])

  React.useEffect(() => {
    getAlbum(getParams.id).then(res => {
      setSongs(res.data.songs)
      setAlbum(res.data.album)
    })
  }, [getParams.id])

  const getStyle = useMemo(() => {
    const style = {
      background: `url(${album.picUrl}) center`,
      width: '100%',
      height: '280px',
      filter: 'blur(15px)',
    }
    return style
  }, [album.picUrl])

  return (
    <div className="album">
      <div className='album-header'>
        <div style={getStyle} />
        <div className='header-top'>
          <IconButton color='inherit' onClick={() => { navigate(-1) }}>
            <ArrowBackIos style={{ fontSize: '30px' }} />
          </IconButton>
          <IconButton color='inherit'>
            <MoreVert style={{ fontSize: '30px' }} />
          </IconButton>
        </div>

        <div className='header-content'>
          <div className='img-wrap'>
            <img src={album.picUrl} alt='' />
            <span className='mask' />
          </div>

          <div className='info'>
            <p className='info-name'> {album.name} </p>
            {
              album.artists &&
              <div className='info-author'>
                歌手：<span className='author-name'>{album.artists[0].name}</span>
                <ChevronRight />
              </div>
            }
            <div className='info-bottom'>
              <div className='publishTime'>
                发行时间：{formatDate(album.publishTime, 'yyyy-MM-dd')}
              </div>
              <div className='description'>
                <p>{album.description}</p>
                <ChevronRight />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.headerFooter}>
          {
            album.info &&

            <ButtonGroup aria-label="button group">
              <Button
                startIcon={<CreateNewFolderOutlined />}
                size='large'
              >{formatNumber(album.info.likedCount)}</Button>
              <Button
                startIcon={<CommentOutlined />}
                size='large'
              >{formatNumber(album.info.commentCount)}</Button>
              <Button
                startIcon={<ShareOutlined />}
                size='large'
              >{formatNumber(album.info.shareCount)}</Button>
            </ButtonGroup>
          }
        </div>
      </div>

      <MusicList list={songs} />
    </div>
  )
}

export default Album