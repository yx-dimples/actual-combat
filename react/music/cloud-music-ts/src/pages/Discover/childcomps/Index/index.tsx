import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow } from "swiper";
import { ArrowRightOutlined } from '@ant-design/icons';
import { message } from "antd";
import { 
  getBanner, getHighquality, getPersonalized, getPrivatecontent, getMV, getNewSongs, checkSong, getSongUrl, getSongDetail 
} from '../../../../api'
import { Banner, PlayListTag, Playlist, Mv, SongItem } from '../../../../types'
import PlayListCard from "../../../../components/PlayListCard";
import VoidListCard from "../../../../components/VoidListCard";
import { saveSongDetail, addPlayinglist } from '../../../../action'
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./index.scss";

interface IProps {
  saveSongDetail: any
  addPlayinglist: any
}

const Index = ({ saveSongDetail, addPlayinglist }: IProps) => {
  const navigate = useNavigate()
 
  const [banner, setBanner] = useState<Banner[]>([])
  const [tag, setTag] = useState<PlayListTag[]>([])
  const [playlist, setPlaylist] = useState<Playlist[]>([])
  const [privatecontent, setPrivatecontent] = useState<Mv[]>([])
  const [mv, setMv] = useState<Mv[]>([])
  const [songs, setSongs] = useState<SongItem[]>([])

  useEffect(() => {
    getBanner().then(res => {
      setBanner(res.data.banners)
    })

    getHighquality().then(res => {
      setTag(res.data.tags.slice(0, 5))
    })

    getPersonalized(18).then(res => {
      setPlaylist(res.data.result)
    })

    getPrivatecontent().then(res => {
      setPrivatecontent(res.data.result)
    })

    getMV(4).then(res => {
      setMv(res.data.data)
    })

    getNewSongs(15).then(res => {
      setSongs(res.data.result);
    })
  }, [])

  const toPage = (item: any) => {
    navigate(`/mv/${item.id}`)
  }

  const playMusic = (item: any) => {
    // 音乐是否可用
    checkSong(item.id).then(() => {
      // 获取歌曲详情
      getSongDetail(item.id).then(res => {
        const song = res.data.songs[0]
        saveSongDetail(song)
        addPlayinglist(song)
      })
    }).catch(() => {
      message.warning('暂时无法播放，换首试试')
    })
  }

  return (
    <div className="discover">
     <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
      >
        {
          banner.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item.imageUrl} alt={item.typeTitle} />
            </SwiperSlide>
          ))
        }
      </Swiper>
      
      {/* 热门推荐 */}
      <div className="wrapper">
        <div className="wrapper-header">
          <div className="left">
            <div className="icon" />
            <p className="title">热门推荐</p>
            <ul>
              {
                tag.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))
              }
            </ul>
          </div>
          <div className="right">
            <span onClick={() => navigate('/discover/playlist')}>更多</span>
            <ArrowRightOutlined style={{ color: '#C10D0C' }} />
          </div>
        </div>
        <PlayListCard playlist={playlist} />
      </div>
      
      {/* 最新MV */}
      <div className="wrapper">
        <div className="wrapper-header">
          <div className="left">
            <div className="icon" />
            <p className="title">最新MV</p>
          </div>
          <div className="right">
            <span onClick={() => navigate('/recvideo/mv')}>更多</span>
            <ArrowRightOutlined style={{ color: '#C10D0C' }} />
          </div>
        </div>
        <VoidListCard mv={mv} />
      </div>

      {/* 最新音乐 */}
      <div className="wrapper">
        <div className="wrapper-header">
          <div className="left">
            <div className="icon" />
            <p className="title">最新音乐</p>
          </div>
          <div className="right">
            <span onClick={() => navigate('/discover/newsongs')}>更多</span>
            <ArrowRightOutlined style={{ color: '#C10D0C' }} />
          </div>
        </div>
        <div className="song">
          {
            songs.map((item, index) => (
              <div className="song-item" key={index}>
                <div className="img-wrap" onClick={() => playMusic(item)}>
                  <img src={item.picUrl} alt='' />
                  <div className="play-icon">
                    <i className="fa fa-play-circle fa-lg" />
                  </div>
                </div>
                <div className="item-text">
                  <p className="name">{item.name}</p>
                  <p className="artist" onClick={() => navigate(`/artist/${item.song.artists[0].id}`)}>{item.song.artists[0].name}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* 独家推送 */}
      <div className="wrapper">
        <div className="wrapper-header">
          <div className="left">
            <div className="icon" />
            <p className="title">独家推送</p>
          </div>
        </div>
        <ul className="privatecontent">
          {
            privatecontent.map((item, index) => (
              <li key={index}>
                <div className="img-wrap">
                  <img src={item.picUrl} alt='' onClick={() => toPage(item)} />
                  <i className="fa fa-lg fa-play-circle-o" />
                </div>
                <p className="name" onClick={() => toPage(item)}>{item.name}</p>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveSongDetail: (res: any) => dispatch(saveSongDetail(res)),
    addPlayinglist: (res: any) => dispatch(addPlayinglist(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)