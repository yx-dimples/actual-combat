import { AppBar, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

function Header(props) {
  const { children, drawerWidth } = props

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      '& .MuiAppBar-colorPrimary': {
        color: '#333',
        backgroundColor: '#fff',
      },
      '& .MuiToolbar-root': {
        justifyContent: 'space-between'
      },
      '& .MuiPaper-elevation4': {
        boxShadow: 'none'
      },
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }))

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          {children}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header