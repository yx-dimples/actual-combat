import React from 'react'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles, alpha } from '@material-ui/core/styles'
import {
  IconButton, CssBaseline, Typography, Button
} from '@material-ui/core'
import { Menu, Search, ChevronRight } from '@material-ui/icons'
import { getDjCatelist, getProgramRecommend, getdjProgram, getDjRecommend } from '../../api/dj'
import Slider from 'react-slick'
import './index.less'
import Header from '../../components/Header'
import DrawerView from '../../components/Drawer'

import './index.less'

const drawerWidth = 328

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    flexGrow: 1,
    '& .MuiAppBar-colorPrimary': {
      color: '#fff',
      backgroundColor: '#cd1a17'
    }
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  title: {
    fontSize: '25px',
  },
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }
}))

const settings = {
  dots: true,
  slidesPerRow: 4,
  rows: 2,
  speed: 500,
  slidesToScroll: 1,
  initialSlide: 0,
  nextArrow: <Arrow />,
  prevArrow: <Arrow />
}

function Arrow(props) {
  return (
    <div />
  )
}

function DJ(props) {
  const { userInfo } = props

  const classes = useStyles()
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)
  const [djCatelist, setDjCatelist] = React.useState([])
  const [programs, setPrograms] = React.useState([])

  React.useEffect(() => {

    getDjCatelist().then(res => {
      setDjCatelist(res.data.categories)
    })

    getProgramRecommend().then(res => {
      setPrograms(res.data.programs)
    })


  }, [])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const toCategoryPage = item => {
    navigate(`/djradio/category/${item.id}`)
  }

  const toProgram = item => {
    navigate(`/program/${item.id}`)
  }

  const toDjradio = item => {
    navigate(`/djradio/${item.radio.id}`)
  }

  return (
    <div className='dj'>
      <CssBaseline />
      <CssBaseline />
      <Header drawerWidth={drawerWidth}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <Menu style={{ fontSize: '32px' }} />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          电台
        </Typography>
        <IconButton aria-label="search" color="inherit">
          <Search style={{ fontSize: '32px' }} />
        </IconButton>
      </Header>
      <DrawerView
        drawerWidth={drawerWidth}
        open={open}
        handleDrawerClose={handleDrawerClose}
        drawerHeader={classes.drawerHeader}
        userInfo={userInfo}
      />
      <main
        className={clsx(classes.content)}
      >
        <div className={classes.drawerHeader} />

        {/* 分类 */}
        <div className='catelist'>
          <Slider {...settings}>
            {
              djCatelist.map((item, index) => (
                <div className='catelist-item' key={index} onClick={toCategoryPage.bind(this, item)}>
                  <div className='img-wrap'>
                    <img src={item.pic56x56Url} alt='' />
                  </div>
                  <div>{item.name}</div>
                </div>
              ))
            }
          </Slider>
        </div>

        {/* 推荐节目 */}
        <div className='wrapper program'>
          <div className='wrapper-header'>
            <div className='wrapper-name'>精彩节目推荐</div>
            <div className='wrapper-more'>
              更多
              <ChevronRight />
            </div>
          </div>
          <ul>
            {
              programs.map((item, index) => (
                <li key={index}>
                  <img src={item.coverUrl} alt='' />
                  <div className='info'>
                    <p className='name' onClick={toProgram.bind(this, item)}>{item.name}</p>
                    <p className='brand' onClick={toDjradio.bind(this, item)}>{item.radio.name}</p>
                  </div>
                  <Button className={classes.category} variant="outlined">{item.radio.category}</Button>
                </li>
              ))
            }
          </ul>
        </div>
      </main >
    </div >
  )
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DJ)
