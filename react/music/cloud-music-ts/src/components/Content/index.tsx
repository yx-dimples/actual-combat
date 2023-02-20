import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { makeStyles, Theme } from '@material-ui/core/styles';
import { 
  AppBar, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow} 
from "@material-ui/core";
import { Add, FavoriteBorder } from '@material-ui/icons'
import { getSongDetail } from '../../api'
import { Song } from '../../types'
import { formatDuration } from "../../utils";
import Comment from '../Comment'

interface IProps {
  id: any
  ids: any
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
  );
}

function a11yProps(index: any) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '10px',
    '& .MuiAppBar-colorPrimary': {
      background: 'none',
      color: '#797979'
    },
    '& .MuiPaper-elevation4': {
      boxShadow: 'none'
    },
    '& .Mui-selected': {
      color: '#d33a31'
    },
    '& .MuiTabs-indicator': {
      background: '#d33a31'
    },
    '& .MuiBox-root': {
      padding: '12px 0'
    },
  },
  table: {
    '& .MuiTableCell-head': {
      color: '#727272',
      fontSize: '12px'
    },
    '& .MuiTableCell-body': {
      color: '#727272',
      fontSize: '12px'
    },
    '& .name': {
      color: '#dcdde4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '200px',
      '&:hover': {
        textDecoration: 'underline'
      },
    },
    '& .hover:hover': {
      textDecoration: 'underline'
    },
    '& .MuiTableCell-root': {
      border: 'none'
    },
    '& .MuiTableRow-root:hover': {
      background: '#2e2e2e'
    },
    '& .index': {
      display: 'flex',
      alignItems: 'center',
      '& .icons': {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px'
      } 
    }
  },
}));

function Content ({ id, ids }: IProps) {
  const classes = useStyles();
  const navigate = useNavigate()
  const [value, setValue] = React.useState('one');
  const [total, setTotal] = React.useState(0);
  const [song, setSong] = React.useState<Song[]>([])

  useEffect(() => {
    if (ids !== undefined && ids.length > 0) {
      const trackIds = ids.map((i: any) => i.id)
      getSongDetail(trackIds).then(res => {
        setSong(res.data.songs)
      })
    }
  }, [ids])

  const formatIndex = (index: number) => {
    if (index < 9) {
      return "0" + (index + 1);
    } else return index + 1;
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const getTotal = (val: any) => {
    setTotal(val)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
          <Tab value="one" label="歌曲列表" {...a11yProps('one')} />
          <Tab value="two" label={'评论 ('+ total + ')'} {...a11yProps('two')} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index="one">
        <TableContainer className={classes.table}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="name">音乐标题</TableCell>
                <TableCell>歌手</TableCell>
                <TableCell>专辑</TableCell>
                <TableCell>时长</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {song.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="index" component="th" scope="row">
                    <span>{formatIndex(index)}</span>
                    <span className='icons'>
                      <Add style={{ fontSize: 18 }} />
                      <FavoriteBorder style={{ fontSize: 18, marginLeft: '10px' }} />
                    </span>
                  </TableCell>
                  <TableCell size="small" className="name">{row.name}</TableCell>
                  <TableCell className="hover" onClick={() => navigate(`/artist/${row.ar[0].id}`)}>{row.ar[0].name}</TableCell>
                  <TableCell className="hover" onClick={() => navigate(`/album/${row.al.id}`)}>{row.al.name}</TableCell>
                  <TableCell>{formatDuration(row.dt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index="two">
       <Comment id={id} type='playlist' getTotal={getTotal} />
      </TabPanel>
    </div>
  )
}

export default Content