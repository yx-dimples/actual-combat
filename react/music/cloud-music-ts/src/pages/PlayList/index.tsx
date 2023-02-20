import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button } from 'antd'
import { getPlaylistDetail } from '../../api'
import { Playlist } from '../../types'
import { formatDate, formatNumber } from '../../utils'
import Content from '../../components/Content'
import './index.scss'

const PlayListDetail: React.FC = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = React.useState<Playlist>({
    id: Number(params.id),
    name: '',
    playCount: 0
  })

  React.useEffect(() => {
    getPlaylistDetail(Number(params.id)).then(res => {
      const { id, name, playCount, coverImgUrl, creator, createTime,
        tags, description, subscribedCount, commentCount, trackIds 
      } = res.data.playlist
      const newDetail = {
        id, name, playCount, coverImgUrl, creator, createTime, tags,
        description, subscribedCount, commentCount, trackIds
      }
      setDetail(newDetail)
    })
  }, [params.id])

  return (
    <div className='detail'>
      <div className='detail-head'>
        <div className='cover'>
          <img src={detail.coverImgUrl} alt='' />
        </div>
        <div className='info'>
          <div className='title'>
            <Tag color="#cd201f">歌单</Tag>
            <p>{detail.name}</p>
          </div>
          <div className='creator'>
            <img src={detail.creator?.avatarUrl} alt='' />
            <p className='nickname' onClick={() => navigate(`/user/${detail.creator?.userId}`)}>{detail.creator?.nickname}</p>
            <p className='time'>{formatDate(detail.createTime, 'yyyy-MM-dd')}创建</p>
          </div>
          <div className='btns'>
            <Button>
              <i className='fa fa-play-circle-o' />&nbsp;播放
            </Button>
            <Button>
              <i className='fa fa-folder-open-o' />&nbsp;({formatNumber(detail.subscribedCount)})
            </Button>
            <Button>
              <i className='fa fa-commenting-o' />&nbsp;({formatNumber(detail.commentCount)})
            </Button>
          </div>
          <div className='tags'>
            <span>标签：</span>
            {
              detail.tags?.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))
            }
          </div>
          <p className='description'>
            <span>介绍：</span>
            <span>{detail.description}</span>
          </p>
        </div>
      </div>
      <Content ids={detail.trackIds} id={params.id}/>
    </div>
  )
}

export default PlayListDetail