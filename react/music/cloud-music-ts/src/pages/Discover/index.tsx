import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';

interface Item {
  label: string
  key: number
  path: string
}

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
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
      fontSize: '13px',
      color: '#b1b1b1',
      width: '100px',
      minWidth: '100px',
      maxWidth: '100px',
    },
    '& .Mui-selected': {
      color: '#d33a31',
    },
    '& .MuiTabs-indicator': {
      background: '#d33a31',
    },
    '& .MuiBox-root': {
      marginTop: '20px'
    }
  },
}));

const item: Item[] = [
  { label: '个性推荐', key: 0, path: 'index' }, // 务必填写 key
  { label: '歌单', key: 1, path: 'playlist' },
  { label: '排行榜', key: 2, path: 'ranking' },
  { label: '歌手', key: 3, path: 'singer' },
  { label: '最新音乐', key: 4, path: 'newsongs' }
];

const Discover: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    const { path } = item[newValue]
    navigate(`/discover/${path}`)
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
          {
            item.map((item, index) => (
              <Tab label={item.label} key={index} />
            ))
          }
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={value}>
        <Outlet />
      </TabPanel>
    </div>
  );
}

export default Discover