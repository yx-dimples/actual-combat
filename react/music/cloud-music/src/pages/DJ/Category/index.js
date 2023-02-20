import React from 'react'
import { connect } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos, PersonOutline } from '@material-ui/icons'
import { Tabs } from 'antd-mobile'
import { getDjCatelist, getDjRecommend } from '../../../api/dj'
import { formatNumber } from '../../../utils'
import './index.less'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: '#fff',
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    }
  }
}));

function Category(props) {
  const getParams = useParams()
  const classes = useStyles()
  const navigate = useNavigate()
  const [categories, setCategories] = React.useState([])
  const [activeKey, setActiveKey] = React.useState(getParams.id)
  const [recommend, setRecommend] = React.useState([])

  React.useEffect(() => {
    getDjCatelist().then(res => {
      setCategories(res.data.categories)
    })
    djRecommend(getParams.id)
  }, [getParams.id])

  const djRecommend = id => {
    getDjRecommend(Number(id)).then(res => {
      setRecommend(res.data.djRadios)
    })
  }

  const toPage = (item, type) => {
    console.log(item);
    console.log(type);
    switch (type) {
      case 'djradio':
        navigate(`/djradio/${item.id}`)
        break
      case 'user':
        navigate(`/user/home/${item.dj.userId}`)
        break
      default:
        break
    }
  }

  return (
    <div className='category'>
      <div className={classes.toolbar}>
        <AppBar position='fixed'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" noWrap>
              电台广场
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Tabs
        activeKey={activeKey}
        onChange={key => {
          setActiveKey(key)
          djRecommend(key)
        }}
      >
        {
          categories.map(item => (
            <Tabs.Tab title={item.name} key={item.id}>
              <RenderContent recommend={recommend} toPage={toPage} />
            </Tabs.Tab>
          ))
        }
      </Tabs>
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
export default connect(mapStateToProps, mapDispatchToProps)(Category)

function RenderContent(props) {
  const { recommend, toPage } = props
  return (
    <ul>
      {
        recommend.map((item, index) => (
          <li key={index}>
            <img src={item.picUrl} onClick={toPage.bind(this, item, 'djradio')} alt='' />
            <div className='info'>
              <p className='info-name' onClick={toPage.bind(this, item, 'djradio')}>{item.name}</p>
              <div className='info-nickname'>
                <PersonOutline style={{ color: '#999' }} />
                <p onClick={toPage.bind(this, item, 'user')}>&nbsp;&nbsp;{item.dj.nickname}</p>
              </div>
              <div className='info-count'>
                共{item.programCount}期
                &nbsp;&nbsp;&nbsp;
                订阅{formatNumber(item.subCount)}次
              </div>
            </div>
          </li>
        ))
      }
    </ul>
  )
}
