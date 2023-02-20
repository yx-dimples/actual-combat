import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { getTopList } from '../../api/rank'
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
  }
}))


function Ranking(props) {
  const classes = useStyles()
  const navigate = useNavigate()

  const [rankfeature, setRankfeature] = React.useState([])
  const [rankglobal, setRankglobal] = React.useState([])

  React.useEffect(() => {
    getTopList().then(res => {
      let allRankInfo = res.data.list
      setRankglobal(allRankInfo.slice(4, allRankInfo.length))
      setRankfeature(allRankInfo.slice(0, 4))
    })
  }, [])

  const goBack = () => {
    navigate(-1)
  }

  const toTopList = item => {
    navigate(`/playlist/${item.id}`)
  }

  return (
    <div className='ranking'>
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
              排行榜
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className='wrapper content'>
        <p className='title'>云音乐特色榜</p>
        {
          rankfeature.map((item, index) => (
            <div className='feature' key={index}>
              <div className='feature-header'>
                <p>{item.name}</p>
                <p className='updateFrequency'>{item.updateFrequency}</p>
              </div>
              <div className='feature-content'>
                <img src={item.coverImgUrl} alt='' onClick={toTopList.bind(this, item)} />
                <div className='tracks'>
                  {item.tracks && item.tracks.map((row, rowIndex) => (
                    <div key={rowIndex} className='row'>
                      <div className='rowIndex'>{rowIndex + 1}</div>
                      <div className='info'>
                        <span className='first'>{row.first}</span>
                        <span> - {row.second}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        }

      </div>

      <div className='wrapper'>
        <p className='title'>全球媒体榜</p>
        <ul>
          {
            rankglobal.map((item, index) => (
              <li key={index}>
                <div className='img-wrap'>
                  <img src={item.coverImgUrl} alt='' onClick={toTopList.bind(this, item)} />
                </div>
              </li>
            ))
          }
        </ul>
      </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(Ranking)
