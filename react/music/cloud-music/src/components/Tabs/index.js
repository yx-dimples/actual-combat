import React from 'react'
import { Tabs, Tab, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`
  }
}

function TabsView(props) {
  console.log(props);
  const { value, handleChange } = props

  const useStyles = makeStyles((theme) => ({
    root: {

    },
  }))

  const classes = useStyles()

  return (
    <div className={classes.root}>
      
    </div>
  )
}

export default TabsView