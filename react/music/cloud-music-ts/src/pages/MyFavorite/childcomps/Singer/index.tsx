import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtistSublist } from '../../../../api'
import { Artist } from '../../../../types'
import './index.scss'

const Artists: React.FC = () => {
  const navigate = useNavigate()
  const [total, setTotal] = React.useState(0)
  const [artist, setArtist] = React.useState<Artist[]>([])

  React.useEffect(() => {
    getArtistSublist().then(res => {
      setArtist(res.data.data)
      setTotal(res.data.count)
    })
  }, [])

  return (
    <div className="artist">
      <p className='hd'>我收藏的歌手&nbsp;({total})</p>
      <ul className='artist-list'>
        {
          artist.map((item, index) => (
            <li key={index}>
              <img src={item.picUrl} alt='' onClick={() => navigate(`/artist/${item.id}`)} />
              <div className='right'>
                <p className='name' onClick={() => navigate(`/artist/${item.id}`)}>{item.name}</p>
                <p>
                  {item.albumSize}个专辑&nbsp;&nbsp;&nbsp;{item.mvSize}个MV
                </p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Artists;