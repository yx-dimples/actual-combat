import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Button } from "@material-ui/core";
import { LibraryAdd, PermIdentity } from '@material-ui/icons'
import { Tag } from "antd";
import { getArtistdetail, getArtistDesc, getArtistMv, getArtistAlbum, getArtistTopSong } from "../../api";
import { Artist, Mv, Album, Song, User } from "../../types";
import Albums from './childcomps/Album'
import Works from './childcomps/Works'
import Desc from './childcomps/Desc'
import MvDetail from './childcomps/Mv'
import './index.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface Introduction {
  ti: string
  txt: string
}

interface DescItem {
  briefDesc: string
  introduction: Introduction[]
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
      color: '#b1b1b1',
    },
    '& .Mui-selected': {
      color: '#dcdde4',
    },
    '& .MuiTabs-indicator': {
      background: '#13030'
    }
  },
}));

const Artistdetail: React.FC = () => {
  const { id } = useParams()
  const classes = useStyles();
  const navigate = useNavigate()

  const [artist, setArtist] = React.useState<Artist>({
    id: Number(id)
  })

  const [user, setUser] = React.useState<User>({})

  const [desc, setDesc] = React.useState<DescItem>({
    briefDesc: '',
    introduction: []
  })

  const [mv, setMv] = React.useState<Mv[]>([])
  const [album, setAlbum] = React.useState<Album[]>([])
  const [song, setSong] = React.useState<Song[]>([])
  const [value, setValue] = React.useState(0);

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(30)
  
  React.useEffect(() => {
    getArtistdetail(Number(id)).then(res => {
      console.log(res.data.data);
      setUser(res.data.data.user)
      setArtist(res.data.data.artist)
    })

    getArtistDesc(Number(id)).then(res => {
      setDesc(res.data);
    })

    getArtistMv(Number(id)).then(res => {
      setMv(res.data.mvs)
    })

    getArtistAlbum({
      id: Number(id),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then(res => {
      setAlbum(res.data.hotAlbums);
    })

    getArtistTopSong(Number(id)).then(res => {
      setSong(res.data.songs)
    })

  }, [currentPage, id, pageSize])

  const alias = useMemo(() => {
    if (artist.alias?.length !== 0) {
      if (artist?.alias?.length === 1) {
        return artist?.alias?.join('')
      } else {
        return artist?.alias?.join(';')
      }
    }
  }, [artist])

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  };
  
  return (
    <div className="artist">
      <div className="hd">
        <div className="img-wrap">
          <img src={artist.cover} alt='' />
          <div className="bottom">
            <Button
              variant="contained"
              color="default"
              startIcon={<PermIdentity />}
              onClick={() => navigate(`/user/${user.userId}`)}
            >
              个人中心
            </Button>
            <Button
              variant="contained"
              color="default"
              startIcon={<LibraryAdd />}
            >
              收藏
            </Button>
          </div>
        </div>

        <div className="right">
          <div className="name">
            <Tag color='#d33a31'>歌手</Tag>
            <p>{artist.name}</p>
            <p className="alias">{alias}</p>
          </div>
          <p className="size">单曲数：{artist.musicSize}</p>
          <p className="size">专辑数：{artist.albumSize}</p>
          <p className="size">MV数：{artist.mvSize}</p>
        </div>
      </div>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="热门作品" />
            <Tab label="所有专辑" />
            <Tab label="相关MV" />
            <Tab label="艺人介绍" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Works song={song} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Albums
            total={artist.albumSize}
            currentPage={currentPage}
            pageSize={pageSize}
            onChange={onChange}
            album={album}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <MvDetail mv={mv} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Desc name={artist.name} desc={desc} />
        </TabPanel>
      </div>
    </div>
  )
}

export default Artistdetail;