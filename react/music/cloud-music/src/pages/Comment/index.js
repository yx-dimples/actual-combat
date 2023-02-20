import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar, Toolbar, IconButton, Typography, Tabs, Tab
} from '@material-ui/core'
import { ArrowBackIos, ChevronRight } from '@material-ui/icons'
import { getCommentDj, getCommentMusic } from '../../api/comment'
import { getDjProgramDetail } from '../../api/dj'
import CommentList from '../../components/CommentList'
// import useContainerScroll from '../../components/Scroll'
import './index.less'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div p={3}>
          {children}
        </div>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const DJ_TYPE = 'dj'
const MUSIC_TYPE = 'music'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: '#fff',
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    }
  },
  tabs: {
    '& .MuiTab-root': {
      fontSize: '20px',
      color: '#999'
    },
    '& .Mui-selected': {
      color: '#333',
      fontWeight: 'bold'
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#e4e4e4'
    }
  },
  tabPanel: {
    padding: '15px',
    backgroundColor: '#fff',
  }
}))

function Comment(props) {
  const classes = useStyles()
  const getParams = useParams()
  const navigate = useNavigate()
  const currentLocation = useLocation()
  const [value, setValue] = React.useState(0)
  const [total, setTotal] = React.useState(0)
  const [program, setProgram] = React.useState({})
  const [hotComments, setHotComments] = React.useState([])
  const [comments, setComments] = React.useState([])
  const [topComments, setTopComments] = React.useState([])
  const [startx, setStartX] = React.useState()
  const [starty, setStartY] = React.useState()
  const [isFoot, setIsFoot] = React.useState()
  const [finished, setFinished] = React.useState()
  const onPullUp = useRef()

  React.useEffect(() => {
    const commentRequestMap = {
      [DJ_TYPE]: getCommentDj,
      [MUSIC_TYPE]: getCommentMusic
    }

    const detailRequestMap = {
      [DJ_TYPE]: getDjProgramDetail
    }

    const commentRequest = commentRequestMap[currentLocation.state]
    const detailRequest = detailRequestMap[currentLocation.state]
    commentRequest({
      id: Number(getParams.id),
      limit: 20
      // id: Number(1809100933)
    }).then(res => {
      setHotComments(res.data.hotComments)
      setComments(res.data.comments)
      setTopComments(res.data.topComments)
      setTotal(res.data.total)
    })

    detailRequest(Number(getParams.id)).then(res => {
      setProgram(res.data.program)
    })

  }, [currentLocation, getParams.id])


  const goBack = () => {
    navigate(-1)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <div className='comment' ref={onPullUp}>
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
              评论({total})
            </Typography>
          </Toolbar>
        </AppBar>
      </div >

      <div className='comment-header'>
        <div className='img-wrap'>
          <img src={program.coverUrl} alt='' />
        </div>
        <div className='info'>
          <div className='info-name'>
            {program.name}
          </div>
          {
            program.radio && <div className='radio'>
              <span className='category'>{program.radio.category}</span>
              <span className='radio-name'>{program.radio.name}</span>
            </div>
          }
        </div>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
        >
          <ChevronRight />
        </IconButton>
      </div>

      <div className='content'>
        <div className='content-left'>评论区</div>
        <div className={classes.tabs}>
          <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
            <Tab label="推荐" {...a11yProps(0)} />
            <Tab label="最热" {...a11yProps(1)} />
            <Tab label="最新" {...a11yProps(2)} />
          </Tabs>
        </div>
      </div>

      <div className={classes.tabPanel}>
        <TabPanel value={value} index={1}>
          <CommentList
            comment={topComments}
          />
          <useContainerScroll />
        </TabPanel>
        <TabPanel value={value} index={0}>
          <CommentList
            comment={hotComments}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CommentList
            comment={comments} />
        </TabPanel>
      </div >

      {/* <div className='send-out'>发送评论</div> */}
    </div >

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
export default connect(mapStateToProps, mapDispatchToProps)(Comment)
