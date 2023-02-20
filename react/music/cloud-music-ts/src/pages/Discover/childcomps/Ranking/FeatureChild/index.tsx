import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import './index.scss'

import { getTrackAll } from '../../../../../api'
import { Song } from '../../../../../types'

interface IProps {
  item: any
}

function RankfeatureChild  ({ item }: IProps) {
  const navigate = useNavigate()
  const [song, setSong] = useState<Song[]>([])
  useEffect(() => {
    getTrackAll({
      id: item.id,
      limit: 5
    }).then(res => {
      console.log(res.data.songs);
      setSong(res.data.songs)
    })

  }, [item])

  return (
    <div className="feature">
      <img src={item.coverImgUrl} alt='' onClick={() => navigate(`/playlist/${item.id}`)} />
      <ul>
        {
          song.map((el, i) => (
            <li key={i}>
              <span className={i < 3 ? 'hot' : ''}>{i + 1}</span>
              <span className="name">{el.name}</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
 
}

export default RankfeatureChild 