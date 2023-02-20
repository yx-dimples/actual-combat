import { Button, Tag } from 'antd'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { getMVDetail, getMVUrl, getSimiMv } from '../../api'
import { Mv } from '../../types'
import { formatDuration, formatNumber } from '../../utils'
import Comments from '../../components/Comment'
import './index.scss'

const MvDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mv, setMv] = React.useState<Mv>({
    id: Number(id),
    duration: 0,
    creator: []
  })
  const [simiMv, setSimiMv] = React.useState<Mv[]>([])
  const [url, setUrl] = React.useState<string>('')
  const [total, setTotal] = React.useState<number>(0)

  React.useEffect(() => {
    getMVDetail(Number(id)).then(res => {
      setMv(res.data.data)
      console.log(res.data.data)
    })
    getMVUrl(Number(id)).then(res => {
      setUrl(res.data.data.url)
    })
    getSimiMv(Number(id)).then(res => {
      console.log(res.data.mvs)
      setSimiMv(res.data.mvs)
    })
    
  }, [id])

  const getTotal = (total: number) => {
    setTotal(total);
  }

  return (
    <div className='mv'>
      <div className='left'>
        <div className='top'>
          <Tag>MV</Tag>
          <p className='name'>{mv.name}</p>
          <p 
            className='artist-name'
            onClick={() => navigate(`/artist/${mv.artistId}`)}
          >{mv.artistName}</p>
        </div>
        <div className='video-play'>
          <ReactPlayer
            url={url}
            controls
            loop
            width='640'
            height='360'
          />
        </div>
        <div className='btns'>
          <Button>
            <i className='fa fa-thumbs-o-up' />&nbsp;点赞
          </Button>
          <Button>
              <i className='fa fa-folder-open-o' />&nbsp;({formatNumber(mv.subCount)})
          </Button>
          <Button>
              <i className='fa fa-share-alt' />&nbsp;({formatNumber(mv.shareCount)})
          </Button>
        </div>
        <div className='comment'>
          <div className='comment-header'>
            <p>评论</p>
            <p className='total'>共({total})条评论</p>
          </div>
          <Comments
            id={Number(id)} 
            type='mv'
            getTotal={getTotal} />
          </div>
      </div>
      <div className='right'>
        <div className='desc'>
          <p className='title'>MV简介</p>
          <p className='count'>
            发布时间：{mv.publishTime}
          </p>
          <p className='count'>
            播放次数：{formatNumber(mv.playCount)}次
          </p>
          <p className='description'>{mv.desc}</p>
        </div>
        <div className='desc simi'>
          <p className='title'>热门推荐</p>
          <ul>
            {
              simiMv.map((item, index) => (
                <li key={index}>
                  <div className='img-wrap'>
                    <img onClick={() => navigate(`/mv/${item.id}`)} src={item.cover} alt='' />
                  </div>
                  <div className='right-info'>
                    <p className='name' onClick={() => navigate(`/mv/${item.id}`)}>{item.name}</p>
                    {
                      item.duration &&
                    <p >{formatDuration(item.duration)}</p>
                    }
                    <p onClick={() => navigate(`/artist/${item.artistId}`)}>by <span>{item.artistName}</span></p>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MvDetail