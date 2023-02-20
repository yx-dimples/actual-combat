import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Tag } from "antd";
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import { getAlbum, getAlbumDynamic } from '../../api'
import { Album, Song } from '../../types'
import { formatDate, formatNumber } from "../../utils";
import SongTable from "../../components/SongTable";
import Comment from '../../components/Comment'
import './index.scss'

interface Dynamic {
  commentCount: number
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
    '& .desc': {
      fontSize: '12px',
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap'
    }
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


const AlbumDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const classes = useStyles();

  const [album, setAlbum] = useState<Album>({
    id: Number(id)
  })

  const [song, setSong] = useState<Song[]>([])

  const [dynamic, setDynamic] = useState<Dynamic>({
    commentCount: 0
  })

  const [showAll, setShowAll] = useState(false)

  const [value, setValue] = React.useState('one');
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    getAlbum(Number(id)).then(res => {
      console.log(res.data);
      setAlbum(res.data.album)
      setSong(res.data.songs)
    })

    getAlbumDynamic(Number(id)).then(res => {
      setDynamic(res.data)
      // setAlbum(res.data.album)
    })
  }, [id])

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const getTotal = (val: any) => {
    setTotal(val)
  }

  return (
    <div className="album">
      <div className="hd">
        <div className="img-wrap">
          <img src={album.blurPicUrl} alt='' />
        </div>
        <div className="right">
          <div className="name">
            <Tag color="#cd201f">专辑</Tag>
            <p>{album.name}</p>
          </div>

          <p className="artist">歌手:<span onClick={() => navigate(`/artist/${album.artist?.id}`)}>{album.artist?.name}</span></p>
          <p className="time">发行时间:&nbsp;&nbsp;{formatDate(album.publishTime, 'yyyy-MM-dd')}</p>
          <p className="company">发行公司:&nbsp;&nbsp;{album.company}</p>

          <div className='btns'>
            <Button>
              <i className='fa fa-play-circle-o' />&nbsp;播放
            </Button>
            <Button>
              <i className='fa fa-folder-open-o' />&nbsp;收藏
            </Button>
            <Button>
              <i className='fa fa-commenting-o' />&nbsp;({formatNumber(dynamic.commentCount)})
            </Button>
          </div>
        </div>
      </div>
     

      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
            <Tab value="one" label="歌曲列表" />
            <Tab value="two" label={'评论 ('+ total + ')'} />
            <Tab value="three" label="专辑介绍" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index="one">
          <SongTable song={song} />
        </TabPanel>
        <TabPanel value={value} index="two">
          <Comment id={Number(id)} type='album'getTotal={getTotal} />
        </TabPanel>
        <TabPanel value={value} index="three">
          <p className="desc">{album.description}</p>
        </TabPanel>
      </div>
    </div>
  )
}

export default AlbumDetail;