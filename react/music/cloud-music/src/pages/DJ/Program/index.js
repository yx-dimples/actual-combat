import React from 'react'
import { connect } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiAppBar-colorPrimary': {
      color: '#333',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiTypography-h5': {
      marginLeft: '100px'
    }
  },
  text: {
  }
}));

function Program(props) {
  const getParams = useParams()
  console.log(getParams);
  const classes = useStyles()
  const navigate = useNavigate()


  React.useEffect(() => {

  }, [getParams.id])

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.header}>
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
            电台节目
          </Typography>
        </Toolbar>
      </AppBar>
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
export default connect(mapStateToProps, mapDispatchToProps)(Program)
