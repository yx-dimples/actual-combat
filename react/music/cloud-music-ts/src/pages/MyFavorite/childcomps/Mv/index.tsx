import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getMvSublist } from '../../../../api'
import { Mv } from '../../../../types'
import './index.scss'

const Mvs: React.FC = () => {
  const navigate = useNavigate()
  const [total, setTotal] = React.useState(0)
  const [mv, setMv] = React.useState<Mv[]>([])

  React.useEffect(() => {
    getMvSublist().then(res => {
      setMv(res.data.data)
      setTotal(res.data.count)
    })
  }, [])

  const onCreatorPage = (item: any) => {
    if (item.type === 0) {
      navigate(`/artist/${item.creator[0].userId}`)
    } else {
      navigate(`/user/${item.creator[0].userId}`)
    }
  }
  
  const onVidPage = (item: any) => {
    if (item.type === 0) {
      navigate(`/mv/${item.vid}`)
    } else {
      navigate(`/video/${item.vid}`)
    }
  }

  return (
    <div className="favorite-mv">
      <p className='hd'>我收藏的MV&nbsp;({total})</p>
      <ul className='mv-list'>
        {
          mv.map((item, index) => (
            <li key={index}>
              <div className='img-wrap'>
                <img src={item.coverUrl} alt='' onClick={() => onVidPage(item)} />
              </div>
              <p onClick={() => onVidPage(item)}>{item.title}</p>
              <p className='userName' onClick={() => onCreatorPage(item)}>by{item.creator[0].userName}</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Mvs;