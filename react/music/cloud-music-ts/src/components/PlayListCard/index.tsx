import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Playlist } from '../../types'
import { formatNumber } from '../../utils'
import './index.scss'

interface IProps {
  playlist: Playlist[]
}

function PlayListCard({ playlist }: IProps) {

  const navigate = useNavigate()

  const toPage = (item: any) => {
    navigate(`/playlist/${item.id}`)    
  }
  
  const img = (item: any) => {
    if (item.picUrl !== undefined) {
      return item.picUrl
    } else if (item.coverImgUrl !== undefined) {
      return item.coverImgUrl
    }
  }
  return (
    <ul className='card'>
      {
        playlist.map((item, index) => (
          <li key={index}>
            <div className='img-wrap'>
              <img src={img(item)} alt='' onClick={() => toPage(item)} />
              <div className='bottom'>
                <div className='play-count'>
                  <i className='fa fa-headphones' />
                  {formatNumber(item.playCount)}
                </div>
                <div className='play'><i className='fa fa-play-circle-o' /></div>
              </div>
            </div>
            <p onClick={() => toPage(item)}>{item.name}</p>
          </li>
        ))
      }
    </ul>
  )
}

export default PlayListCard