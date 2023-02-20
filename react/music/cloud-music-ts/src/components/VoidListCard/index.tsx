import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Mv } from '../../types'
import { formatNumber } from '../../utils'
import './index.scss'

interface IProps {
  mv: Mv[]
}

function VoidListCard({ mv }: IProps) {
  const navigate = useNavigate()
  return (
    <ul className='void-list'>
      {
        mv.map((item, index) => (
          <li key={index}>
            <div className='img-wrap'>
              <img src={item.cover} alt='' />
                <div className='play-icon'>
                  <i className="fa fa-play-circle-o" />
                  <span>{formatNumber(item.playCount)}</span>
                </div>
                <div className='mask-playicon'>
                  <i className="fa fa-play-circle fa-2x" onClick={() => navigate(`/mv/${item.id}`)} />
                </div>
            </div>
            <p onClick={() => navigate(`/mv/${item.id}`)}>{item.name}</p>
            <p className='artist-name' onClick={() => navigate(`/artist/${item.artistId}`)}>{item.artistName}</p>
          </li>
        ))
      }
    </ul>
  )
}

export default VoidListCard