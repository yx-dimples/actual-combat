import React from 'react';
import { connect } from "react-redux";
import { Button, message } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { VolumeUp, VolumeOff } from '@material-ui/icons'
import { getTopSong, checkSong, getSongUrl } from '../../../../../../api';
import { Song } from '../../../../../../types';
import { formatDuration } from '../../../../../../utils';
import { saveSongDetail, addPlayinglist, changePlayState, addAllSong } from '../../../../../../action'
import './index.scss'

interface IProps {
  saveSongUrl: any
  saveSongDetail: any
  addPlayinglist: any
  changePlayState: any
  addAllSong: any
  isPlaying: boolean
  nowSongDetail: any
}

const typeTags = [
  { type: 0, name: '全部' },
  { type: 7, name: '华语' },
  { type: 96, name: '欧美' },
  { type: 8, name: '日本' },
  { type: 16, name: '韩国' }
]

const useStyles = makeStyles({
  table: {
    marginTop: '10px',
    '& .MuiTableCell-root': {
      border: 'none',
    },
    '& .MuiTableRow-root': {
      '&:hover': {
        background: '#2a2a2a'
      }
    },
    '& .MuiTableCell-body': {
      color: '#606266',
      fontSize: '12px',
      
    },
    '& .hover:hover': {
      textDecoration: 'underline'
    },
    '& img': {
      width: '60px',
      height: '60px'
    },
    '& .name': {
      color: '#dcdde4',
      cursor: 'pointer'
    }
  },
});

const TopSong = ({ 
 saveSongDetail, addPlayinglist, changePlayState, addAllSong, isPlaying, nowSongDetail
}: IProps) => {
  const classes = useStyles();
  const [type, setType] = React.useState<number>(0)
  const [song, setSong] = React.useState<Song[]>([])

  React.useEffect(() => {
    topSong()
  }, [])

  const topSong = () => {
    getTopSong(type).then(res => {
      setSong(res.data.data);
    })
  }

  const typeClick = (item: any) => {
    setType(item.type)
    topSong()
  }

  // 播放全部
  const playAll = () => {
    let formatSongList: any = []
    song.forEach((item: any) => {
      formatSongList.push(getSongInfo(item))      
    })
    // 播放全部
    addAllSong(formatSongList)

    const id = formatSongList[0].id
    checkSong(id).then(() => {
      // 保存当前歌曲详情
      saveSongDetail(formatSongList[0])
    })
  }

  const playMusic = (row: any) => {
    // 音乐是否可用
    checkSong(row.id).then(({ data }) => {
      if (data.success) {
        // 更新播放状态
        changePlayState(true)
        const song = getSongInfo(row)
        // 保存当前歌曲详情
        saveSongDetail(song)
        // 添加到播放列表
        addPlayinglist(song)
      } else {
        message.warning('暂时无法播放，换首试试')
      }
    }).catch(() => {
      message.warning('暂时无法播放，换首试试')
    })
  }

  const getSongInfo = (song: any) => {
    let nowSongInfo: any = { al: {}, ar: [{}] };
		nowSongInfo.id = song.id; //歌曲id
		nowSongInfo.name = song.name; //歌曲名
		nowSongInfo.dt = song.duration; //歌曲时长
		nowSongInfo.al.picUrl = song.album.picUrl; //专辑封面
		nowSongInfo.al.name = song.album.name; //专辑名
		nowSongInfo.al.id = song.album.id; //专辑id
		nowSongInfo.ar[0].name = song.artists[0].name; //歌手名
		nowSongInfo.ar[0].id = song.artists[0].id; //歌手id
		if (song.mvid !== 0) {
			nowSongInfo.mv = song.mvid; //mv的id
		}
		return nowSongInfo;
  }

  return (
    <div className='new-song'>
      <ul className='menu'>
        {
          typeTags.map((item, index) => (
            <li 
              key={index}
              className={type === item.type ? 'active' : ''}
              onClick={() => typeClick(item)}
            >
              {item.name}
            </li>
          ))
        }
      </ul>

      <div className='song-list'>
        <Button size='small' onClick={playAll}>
          <i className='fa fa-play-circle-o' />
          播放全部
        </Button>
        <TableContainer className={classes.table}>
          <Table aria-label="simple table">
            <TableBody>
              {song.map((row, index) => (
                <TableRow key={index} onClick={() => playMusic(row)}>
                  <TableCell component="th" scope="row">
                    {
                      row.id === nowSongDetail.id ? 
                        <span>
                          {
                            isPlaying ? <VolumeUp style={{ fontSize: '16px', color: '#d33a31' }} /> : <VolumeOff style={{ fontSize: '16px', color: '#d33a31' }} />
                          }
                        </span> : 
                        <span>{index + 1}</span>
                    }
                    
                  </TableCell>
                  <TableCell>
                    <img src={row.album.blurPicUrl} alt='' />
                  </TableCell>
                  <TableCell className='name'>{row.name}</TableCell>
                  <TableCell className='hover'>{row.album.name}</TableCell>
                  <TableCell className='hover'>{row.artists[0].name}</TableCell>
                  <TableCell>{formatDuration(row.duration)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

function mapStateToProps(state: any) {
  console.log(state);
  
  return {
    isPlaying: state.isPlaying,
    nowSongDetail: state.nowSongDetail
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveSongDetail: (res: any) => dispatch(saveSongDetail(res)),
    addPlayinglist: (res: any) => dispatch(addPlayinglist(res)),
    changePlayState: (res: any) => dispatch(changePlayState(res)),
    addAllSong: (res: any) => dispatch(addAllSong(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopSong)