import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import discovery from '../../assets/images/discovery.png'
import discoveryActive from '../../assets/images/discovery-active.png'
import radioStationActive from '../../assets/images/radioStation-active.png'
import radioStation from '../../assets/images/radioStation.png'
import mine from '../../assets/images/mine.png'
import mineActive from '../../assets/images/mine-active.png'

const useStyles = makeStyles(theme => ({
  tabBar: {
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    position: 'fixed',
    '& .MuiBottomNavigationAction-label': {
      fontSize: '18px',
      color: '#b3b3b3'
    },
    '& .Mui-selected': {
      fontSize: '18px',
      color: '#c10d0c'
    },
    '& button': {
      '& .MuiBottomNavigationAction-wrapper': {
        '& img': {
          width: '30px',
          height: '30px'
        }
      }
    }
  },
}))

function TabBar() {

  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const [value, setValue] = useState(0)
  const [showTabbar, setShowTabbar] = useState(true)

  useEffect(() => {
    switch (location.pathname) {
      case '/discovery/index':
        setValue(0)
        setShowTabbar(true)
        break
      case '/discovery/mine':
        setValue(1)
        setShowTabbar(true)
        break
      case '/discovery/dj':
        setValue(2)
        setShowTabbar(true)
        break
      default:
        setValue(0)
        setShowTabbar(false)
        break
    }
  }, [location.pathname])

  return (
    <div className={classes.tabBar}>
      <BottomNavigation
        value={value}
        style={{ display: showTabbar ? 'flex' : 'none' }}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/discovery/index')
              break
            case 1:
              navigate('/discovery/mine')
              break
            case 2:
              navigate('/discovery/dj')
              break
            default:
              break
          }
        }}
        showLabels
      >
        <BottomNavigationAction
          label='发现'
          icon={
            <img src={value === 0 ? discoveryActive : discovery} alt='' />
          }
        />
        <BottomNavigationAction
          icon={
            <img src={value === 1 ? mine : mineActive} alt='' />
          }
          label='我的'
        />
        <BottomNavigationAction
          icon={<img src={value === 2 ? radioStationActive : radioStation} alt='' />}
          label='电台'
        />
      </BottomNavigation>
    </div>
  )
}

export default TabBar