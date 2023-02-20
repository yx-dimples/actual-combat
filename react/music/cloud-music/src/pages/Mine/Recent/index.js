import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Toolbar, IconButton, TableContainer, Checkbox, TableRow, TableCell, TableBody, Table } from '@material-ui/core'
import { ArrowBackIos, PlayCircleFilled, MoreVert } from '@material-ui/icons'
import { Tabs } from 'antd-mobile-v2'
import { PlayOutline, ClockCircleOutline } from 'antd-mobile-icons'
import { getRecordRecent } from '../../../api/recent'
import MusicList from '../../../components/MusicList'
import { formatDuration, formatDate, formatNumber } from '../../../utils'

import './index.less'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    }
  },
  table: {
    width: '100%',
    '& .MuiTableCell-root': {
      padding: '0'
    },
    '& .row-right': {
      padding: '0 10px',
      lineHeight: '3.5',
      '& .row-name': {
        fontWeight: 'bold',
        fontSize: '18px',
        width: '244px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      '& .row-bottom': {
        color: '#7e7e7e',
        display: 'flex'
      }
    },
  }
}))


function Recent(props) {
  const classes = useStyles()
  const navigate = useNavigate()

  const [page, setPage] = React.useState('song')
  const [recent, setRecent] = React.useState([])

  const tabItems = [
    { key: 'song', title: '歌曲' },
    { key: 'video', title: '视频' },
    { key: 'voice', title: '声音' },
    { key: 'playlist', title: '歌单' },
    { key: 'album', title: '专辑' },
    { key: 'dj', title: '播客' }
  ]

  React.useEffect(() => {
    RecordRecent(page)
  }, [page])


  const RecordRecent = (type) => {
    getRecordRecent(type).then(res => {
      setRecent(res.data.data.list)
    })
  }

  const tagChange = modules => {
    setPage(modules.key)
    RecordRecent(modules.key)
  }

  const toPlayList = row => {
    navigate(`/playlist/${row.data.id}`)
  }

  const toAlbum = row => {
    navigate(`/album/${row.data.id}`)
  }

  const toDj = row => {
    navigate(`/djradio/${row.data.id}`)
  }

  return (
    <div className='recent'>
      <div className={classes.toolbar}>
        <AppBar position='fixed'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="go back"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" noWrap>
              最近播放
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className='tabs'>
        <Tabs
          tabs={tabItems}
          tabBarUnderlineStyle={{ border: '2px solid rgb(227, 96, 73)' }}
          onChange={(modules) => { tagChange(modules) }}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
          page={page}
        >
          <div>

            {
              page === 'song' && <div>
                <MusicList list={recent} />
              </div>
            }
            {
              page === 'video' &&
              <RenderVideoContent
                recent={recent}
              />
            }

            {
              page === 'voice' &&
              <RenderVoiceContent
                recent={recent}
                className={classes.table}
              />
            }
            {
              page === 'playlist' &&
              <RenderPlaylistContent
                recent={recent}
                toPlayList={toPlayList}
              />
            }
            {
              page === 'album' &&
              <RenderAlbumContent
                recent={recent}
                toAlbum={toAlbum}
              />
            }
            {
              page === 'dj' &&
              <RenderDjContent
                recent={recent}
                toDj={toDj}
              />
            }
          </div>
        </Tabs>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Recent)


function RenderVideoContent(props) {
  return (
    <ul className='video'>
      {
        props.recent.map((item, index) => (
          // item.data && item.data.creator &&
          <li key={index}>
            <div className='img-wrap'>
              <img src={item.data.coverUrl} alt='' />
            </div>
            <div className='video-info'>
              <p className='title line-clamp'>{item.data.title || item.data.name}</p>
              <div className='bottom'>
                <div className='bottom-name'>
                  <div>
                    {formatDuration(item.data.duration)}, by
                  </div>
                  {
                    item.data.creator !== undefined ? <>
                      {
                        item.data.creator && <div>{item.data.creator.nickname}</div>
                      }</> :
                      <>
                        {
                          item.data.artists && <div>{item.data.artists[0].name}</div>
                        }
                      </>
                  }
                </div>
                <div>{formatDate(item.playTime, 'MM月dd日')}</div>
              </div>
            </div>
          </li>
        ))
      }
    </ul >
  )
}

function RenderVoiceContent(props) {
  const { className, recent } = props
  return (
    <div className='voice'>
      <div className='voice-header'>
        <PlayCircleFilled style={{ color: '#ff393b', fontSize: '35px', marginRight: '5px' }} />
        播放全部 <span>({recent.length})</span>
      </div>
      <TableContainer>
        <Table
          className={className}
          aria-labelledby="tableTitle"
          aria-label="enhanced table"
        >
          <TableBody>
            {
              recent.map((row, index) => {
                let picUrl, name, adjustedPlayCount, duration
                if (row.data && row.data.pubDJProgramData && row.data.pubDJProgramData.radio) {
                  picUrl = row.data.pubDJProgramData.radio.picUrl
                  name = row.data.pubDJProgramData.name
                  adjustedPlayCount = row.data.pubDJProgramData.adjustedPlayCount
                  duration = row.data.pubDJProgramData.duration
                }
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <img src={picUrl} className='picUrl' alt='' />
                    </TableCell>
                    <TableCell className='row-right'>
                      <div className='row-name'>
                        {name}
                      </div>
                      <div className='row-bottom'>
                        <div>{formatDate(row.playTime, 'MM-dd')}&nbsp; &nbsp;</div>
                        <div><PlayOutline /> {formatNumber(adjustedPlayCount)}&nbsp; &nbsp;</div>
                        <div><ClockCircleOutline /> {formatDuration(duration)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <MoreVert style={{ color: '#7e7e7e' }} />
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

function RenderPlaylistContent(props) {
  return (
    <ul className='list'>
      {
        props.recent.map((item, index) => (
          <li key={index} onClick={props.toPlayList.bind(this, item)}>
            <div className='img-wrap'>
              <img src={item.data.coverImgUrl} alt='' />
            </div>
            <div className='list-info'>
              <p className='title line-clamp'>{item.data.name}</p>
              <div className='bottom'>
                <div className='bottom-name'>
                  {
                    item.data.creator && <div>by {item.data.creator.nickname}</div>
                  }
                </div>
                <div>{formatDate(item.playTime, 'MM月dd日')}</div>
              </div>
            </div>
          </li>
        ))
      }
    </ul >
  )
}

function RenderAlbumContent(props) {
  return (
    <ul className='list'>
      {
        props.recent.map((item, index) => (
          <li key={index} onClick={props.toAlbum.bind(this, item)}>
            <div className='img-wrap'>
              <img src={item.data.picUrl} alt='' />
            </div>
            <div className='list-info'>
              <p className='title line-clamp'>{item.data.name}</p>
              <div className='bottom'>
                <div className='bottom-name'>
                  {
                    item.data.artist && <div>{item.data.artist.name}</div>
                  }
                </div>
                <div>{formatDate(item.playTime, 'MM月dd日')}</div>
              </div>
            </div>
          </li>
        ))
      }
    </ul >
  )
}

function RenderDjContent(props) {
  return (
    <ul className='list'>
      {
        props.recent.map((item, index) => (
          <li key={index} onClick={props.toDj.bind(this, item)}>
            <div className='img-wrap'>
              <img src={item.data.picUrl} alt='' />
            </div>
            <div className='list-info'>
              <p className='title line-clamp'>{item.data.name}</p>
              <div className='bottom'>
                <div className='bottom-name'>
                  {
                    item.data.dj && <div>by {item.data.dj.nickname}</div>
                  }
                </div>
                <div>{formatDate(item.playTime, 'MM月dd日')}</div>
              </div>
            </div>
          </li>
        ))
      }
    </ul >
  )
}