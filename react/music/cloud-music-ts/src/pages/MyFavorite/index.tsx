import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import Album from './childcomps/Album'
import Singer from './childcomps/Singer'
import Mv from './childcomps/Mv'


interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel (props: TabPanelProps) {
  const { children, index, value, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {
        value === index && (
          <Box>{children}</Box>
        )
      }
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    '& .MuiAppBar-colorPrimary': {
      background: 'none'
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    },
    '& .MuiTab-root': {
      fontSize: '12px',
      color: '#b1b1b1',
    },
    '& .Mui-selected': {
      color: '#dcdde4',
    },
    '& .MuiTabs-indicator': {
      background: '#C10D0C',
    },
    '& .MuiBox-root': {
      marginTop: '10px'
    }
  },
});

export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          centered
        >
          <Tab label="专辑" />
          <Tab label="歌手" />
          <Tab label="视频" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Album />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Singer />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Mv />
      </TabPanel>
    </div>
  );
}