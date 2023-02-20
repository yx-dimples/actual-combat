import React, { useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Tab, AppBar, Tabs } from '@material-ui/core'

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface Item {
  label: any
  key: any
  path: any
}

function TabPanel(props: TabPanelProps) {
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
        <Box>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme: Theme) => ({
  search: {
    '& .MuiAppBar-colorPrimary': {
      background: 'none',
      color: '#797979'
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    },
    '& .Mui-selected': {
      color: '#fff'
    },
    '& .MuiTabs-indicator': {
      background: '#C10D0C'
    },
    '& .MuiBox-root': {
      marginTop: '10px'
    }
  },
}));

const item: Item[] = [
  { label: '单曲', key: '1', path: 'song' }, // 务必填写 key
  { label: '歌手', key: '100', path: 'singer' },
  { label: '专辑', key: '10', path: 'album' },
  { label: '视频', key: '1014', path: 'video' },
  { label: '歌单', key: '1000', path: 'playlist' },
  { label: 'MV', key: '1004', path: 'mv' },
  { label: '歌词', key: '1006', path: 'lyric' },
  { label: '用户', key: '1002', path: 'user' },
];

const Search: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState('1');
  const params = useParams()
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    item.forEach(item => {
      if (item.key === newValue) {
        navigate(`/search/${item.path}/${params.keywords}/${item.key}`)
      }
    })
    setValue(newValue);
    
  };

  return (
    <div className={classes.search}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
          {
            item.map((item, index) => (
              <Tab
                value={item.key}
                label={item.label}
                key={index}
                {...a11yProps(item.key)}
          />
            ))
          }
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={value}>
        <Outlet />
      </TabPanel>
  </div>
  );
};

export default Search;