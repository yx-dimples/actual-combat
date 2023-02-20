import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux'
import { message } from 'antd';
import { Button } from '@material-ui/core';
import { PlayCircleFilled, Queue } from '@material-ui/icons'
import SongTable from '../../components/SongTable'
import { Song } from '../../types'
import { getRecommend } from '../../api'
import './index.scss';

interface IProps {
  isLogin: boolean
}

const RecEveryDay = ({ isLogin }: IProps )=> {

  const [song, setSong] = useState<Song[]>([])

  useEffect(() => {
    if (!isLogin) {
      message.warning('登录后才能查看')
    }

    getRecommend().then(res => {
      setSong(res.data.data.dailySongs);
    })
  }, [isLogin])

  const getNowDay = useMemo(() => {
    const date = new Date()
    const day = date.getDay()
    const arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]    
    return arr[day]
  }, [])

  const getNowDate = useMemo(() => {
    const date = new Date()
    return date.getDate()
  }, [])

  return (
    <div className='RecEveryDay'>
      {
        isLogin ? 
        <div className='logined'>
          <div className='hd'>
            <div className='nowdata'>
              <p>{getNowDay}</p>
              <p className='date'>
                {getNowDate}
              </p>
            </div>
            <div className='right'>
              <h2>每日歌曲推荐</h2>
						  <p>根据你的音乐口味生成，每天6:00更新</p>
            </div>
          </div>
          <div className='btns'>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<PlayCircleFilled />}
            >播放全部</Button>
            <Button 
              variant="contained"
              startIcon={<Queue />}
            >收藏全部</Button>
          </div>
          <SongTable song={song} />
        </div> : 
        <div className='nologin'>
          <p>登录后才能查看</p>
        </div>
      }
    </div>
  );
};

function mapStateToProps(state: any) {
  const { userReducer } = state
  // console.log(userReducer);
  return {
    isLogin: userReducer.isLogin
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecEveryDay)