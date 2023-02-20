import React, { useMemo } from 'react';
import { connect } from 'react-redux'
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { formatDuration } from '../../utils';
import { checkSong } from '../../api';
import { saveSongDetail, addPlayinglist, clearPlaylist, clearHistory } from '../../action';
import { Song } from '../../types';
import './index.scss'

interface IProps {
  playingList: any
  historyPlay: any
  nowSongDetail: any
  addPlayinglist: any
  saveSongDetail: any,
  clearPlaylist: any
  clearHistory: any
}

interface TabPanelProps {
  lable: string;
  value: number;
}

const tabs: TabPanelProps[] = [
  { lable: '播放列表', value: 0 },
  { lable: '历史记录', value: 1 },
]

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
      color: '#797979',
    },
    '& .Mui-selected': {
      color: '#fff',
    },
    '& .MuiTabs-indicator': {
      background: 'none',
    }
  },
  table: {
    marginTop: '60px',
    '& .MuiTableCell-root': {
      border: 'none',
      padding: '10px'
    },
    '& .MuiTableCell-head': {
      color: '#606266',
      fontSize: '12px',
      '&:first-of-type': {
        color: '#b1b1b1',
      }
    },
    '& .MuiTableCell-body': {
      color: '#606266',
      fontSize: '12px',
      '& .name': {
        width: '150px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textIOverflow: 'ellipsis',
        color: '#b1b1b1',
      },
      '& .active': {
        color: '#d33a31 !important'
      },
      '& .artist': {
         width: '150px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textIOverflow: 'ellipsis',
      }
    },
  }
}));

const Playlist = ({ 
  playingList, historyPlay, nowSongDetail, saveSongDetail, addPlayinglist, clearPlaylist, clearHistory
}: IProps) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  const playMusic = (row: any) => {
    checkSong(row.id).then(() => {
      saveSongDetail(row)
      addPlayinglist(row)
    })
  }

  const clear = () => {
    if (value === 0) {
      console.log(1);
      clearPlaylist()
    } else {
      console.log(2);
      clearHistory()
    }
  }

  const dataSource: Song[] = useMemo(() => {
    return value === 0 ? playingList : historyPlay
  }, [historyPlay, playingList, value])


  return (
    <div className='playlist'>
      <div className='tabs'>
        <ul>
          {
            tabs.map((item, index) => (
              <li
                key={index}
                className={value === item.value ? 'selected' : ''}
                onClick={() => handleChange(item.value)}
              >{item.lable}</li>
            ))
          }
        </ul>

        <div className='hd'>
          <p>总共{dataSource.length}首</p>
          {
            dataSource.length !== 0 && <div className='delete' onClick={clear}>
              <Delete style={{ fontSize: '16px' }} />
              <p>清空</p>
            </div>
          }
        </div>
      </div>
      {
        dataSource.length !==0 ? 
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>音乐标题</TableCell>
                <TableCell>歌手</TableCell>
                <TableCell>时长</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                dataSource.map((row, index) => (
                  <TableRow key={index} onClick={() => playMusic(row)}>
                    <TableCell component="th" scope="row">
                      <p className={nowSongDetail.id === row.id ? 'active name' : 'name'}>
                        {row.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className='artist'>
                        {row.ar[0].name}
                      </p>
                    </TableCell>
                    <TableCell>{formatDuration(row.dt)}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer> : 
        <div className='empty'>
          你还没有添加任何歌曲
        </div>
      }
    </div>
  );
}
function mapStateToProps(state: any) {
  return {
    playingList: state.playingList,
    historyPlay: state.historyPlay,
    nowSongDetail: state.nowSongDetail
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveSongDetail: (res: any) => dispatch(saveSongDetail(res)),
    addPlayinglist: (res: any) => dispatch(addPlayinglist(res)),
    clearPlaylist: () => dispatch(clearPlaylist()),
    clearHistory: () => dispatch(clearHistory())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)