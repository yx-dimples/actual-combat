import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Button } from '@material-ui/core'
import { MailOutline, ChevronRight, Settings, Brightness2, Info } from '@material-ui/icons'
import './index.less'


export default function DrawerView(props) {

  const { drawerWidth, open, handleDrawerClose, userInfo } = props

  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      '& img': {
        width: '45px',
        height: '45px',
        borderRadius: '100px'
      },
      '& .MuiTypography-body1': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginLeft: '5px'
      }
    },
  }))

  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <img src={userInfo.avatarUrl} alt='' />
        <Typography>{userInfo.nickname}</Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRight />
        </IconButton>
      </div>
      <Divider />
      <div className='drawer'>
        <div className='drawer-item'>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListItem button>
              <ListItemIcon>
                <MailOutline />
              </ListItemIcon>
              <ListItemText primary="消息中心" />
              <ChevronRight />
            </ListItem>
          </List>
        </div>

        <div className='drawer-item'>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                其它
              </ListSubheader>
            }
          >
            <ListItem button>
              <ListItemIcon>
                <MailOutline />
              </ListItemIcon>
              <ListItemText primary="消息中心" />
              <ChevronRight />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="设置" />
              <ChevronRight />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Brightness2 />
              </ListItemIcon>
              <ListItemText primary="深色模式" />
              <ChevronRight />
            </ListItem>
          </List>
        </div>

        <div className='drawer-item'>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListItem button>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary="关于" />
              <ChevronRight />
            </ListItem>
          </List>
        </div>

        <Button>退出登录</Button>
      </div>
    </Drawer>
  )
}