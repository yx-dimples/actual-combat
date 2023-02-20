import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { Tabs } from 'antd-mobile-v2'
import { getPlayListHot, getPersonalized, getTopPlaylist } from '../../api/playlist'
import Sticky from '../../components/Sticky'
import MPullToRefresh from '../../components/MPullToRefresh'
import './index.less'


const useStyles = makeStyles((theme) => ({
  toolbar: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: '#fff',
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    },
    '& .adm-tabs-header': {
      borderBottom: 'none'
    }
  },
  tab: {
    marginTop: '56px',
  }
}))


function PlayLists(props) {

  const classes = useStyles()
  const navigate = useNavigate()

  const [navList, setNavList] = useState([])
  const [activeTitle, setActiveTitle] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [personalize, setPersonalize] = useState([])
  const [playlists, setPlaylists] = useState([])
  let [page, setPage] = useState(12)

  React.useEffect(() => {
    getPlayListHot().then(res => {
      setNavList(res.data.tags)
      setActiveTitle('推荐')
    })
    getPersonalized({
      limit: 100
    }).then(res => {
      setPersonalize(res.data.result)
    })
  }, [])

  const topPlaylist = (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const limit = 12
        const { title, page } = params
        getTopPlaylist({
          cat: title,
          limit,
          offset: (page - 1) * limit
        }).then(res => {
          const playlist = res.data.playlists
          setPlaylists(playlist)
          setPlaylists(page === 1 ? playlist : playlists.concat(playlist))
          setPage(page)
          setHasMore(playlists.length < res.data.total)
          resolve()
        })
      }, 800)
    })

  }

  const refresh = () => {
    const params = {
      title: activeTitle,
      page: 1
    }
    return topPlaylist(params)
  }

  const loadMore = () => {
    const params = {
      title: activeTitle,
      page: page + 1
    }
    return topPlaylist(params)
  }

  const conversion = (taglist) => {
    let newArr = [{ id: 0, title: '推荐' }]
    taglist.forEach((item) => {
      newArr.push({
        id: item.id,
        title: item.name
      })
    })
    return newArr
  }

  const goBack = () => {
    navigate(-1)
  }

  const tagChange = modules => {
    let { title } = modules
    const params = {
      title, page: 1
    }
    setActiveTitle(title)
    topPlaylist(params)
  }

  const toPlaylist = item => {
    navigate(`/playlist/${item.id}`)
  }

  return (
    <div className='playlists'>
      <div className={classes.toolbar}>
        <AppBar position='fixed' >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={goBack}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" noWrap>
              歌单广场
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className={classes.toolbar}>
        <AppBar position='fixed'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={goBack}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" noWrap>
              歌单广场
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Sticky height={56}>

        <Tabs
          tabs={conversion(navList)}
          tabBarUnderlineStyle={{ border: '2px solid rgb(227, 96, 73)' }}
          onChange={(modules) => { tagChange(modules) }}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
        >
          {
            activeTitle === '推荐' ?
              <RenderPersonalize
                personalize={personalize}
                toPlaylist={toPlaylist}
              />
              :
              <div style={{
                height: '100vh',
                overflow: 'auto'
              }}>
                <MPullToRefresh hasMore={hasMore} refresh={refresh} loadMore={loadMore} >
                  <RenderPlaylists playlists={playlists} toPlaylist={toPlaylist} />
                </MPullToRefresh>
              </div>
          }
        </Tabs>
      </Sticky>
    </div >
  )
}

function mapStateToProps(state) {
  return {
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayLists)

function RenderPersonalize(props) {
  const { personalize, toPlaylist } = props
  return (
    <ul className='playlist-content'>
      {
        personalize.map((item, index) => (
          <li key={index} onClick={toPlaylist.bind(this, item)}>
            <div className='img-wrap'>
              <img src={item.picUrl} alt='' />
            </div>
            <p className='name'>{item.name}</p>
          </li>
        ))
      }
    </ul>
  )
}

function RenderPlaylists(props) {
  const { playlists, toPlaylist } = props
  return (
    <ul className='playlist-content'>
      {
        playlists.map((item, index) => (
          <li key={index} onClick={toPlaylist.bind(this, item)}>
            <div className='img-wrap'>
              <img src={item.coverImgUrl} alt='' />
            </div>
            <p className='name'>{item.name}</p>
          </li>
        ))
      }
    </ul>
  )
}