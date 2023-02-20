import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TopSong from './childcomps/TopSong'
import TopAlbum from './childcomps/TopAlbum'

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
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
      border: '1px solid #3f3f3f',
      color: '#b1b1b1',
      width: '72px',
      minWidth: '72px',
      maxWidth: '72px',
      minHeight: '30px'
    },
    '& .Mui-selected': {
      background: '#3f3f3f',
      color: '#fff',
      border: 'none'
    },
    '& .MuiTabs-indicator': {
      background: 'none',
    }
  },
}));

const NewSongs: React.FC = () => {
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
          aria-label="simple tabs example"
          centered
        >
          <Tab label="新歌" {...a11yProps(0)} />
          <Tab label="新碟" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/* <TopSong /> */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TopAlbum />
      </TabPanel>
    </div>
  );
}

export default NewSongs