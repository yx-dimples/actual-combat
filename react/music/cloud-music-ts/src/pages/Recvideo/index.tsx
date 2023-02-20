import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMv } from '../../api';
import Paginations from '../../components/Pagination';
import { Mv } from '../../types';
import { formatNumber, formatDuration } from '../../utils';
import './index.scss';

const areaTags = ['全部', '华语', '港台', '欧美', '日本', '韩国']
const typeTags = ['全部', '官方版', '原生', '现场版', '网易出品']
const orderTags = ['上升最快', '最热', '最新']

const Mvs: React.FC = () => {
  const navigate = useNavigate()

  const [area, setArea] = React.useState('全部')
  const [type, setType] = React.useState('全部')
  const [order, setOrder] = React.useState('上升最快')

  const [pageSize, setPageSize] = React.useState(40)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [mvs, setMvs] = React.useState<Mv[]>([])

  React.useEffect(() => {
    allMv()
  }, [])

  const allMv = () => {
    getAllMv({
      area, 
      type, 
      order,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then(res => {
      setTotal(res.data.count)
      setMvs(res.data.data)
    })
  }

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  return (
    <div className="Recvideo">
      <div className='params'>
        <div className='tabs'>
          <p className='tabs-type'>地区：</p>
          <ul>
            {
              areaTags.map((item, index) => (
                <li
                  key={index}
                  className={area === item ? 'active': ''}
                  onClick={() => {
                    setArea(item)
                    setCurrentPage(1)
                    allMv()
                  }}
                >
                  {item}
                </li>
              ))
            }
          </ul>
        </div>
        <div className='tabs'>
          <p className='tabs-type'>类型：</p>
          <ul>
            {
              typeTags.map((item, index) => (
                <li
                  key={index}
                  className={type === item ? 'active': ''}
                  onClick={() => {
                    setType(item)
                    setCurrentPage(1)
                    allMv()
                  }}
                >
                  {item}
                </li>
              ))
            }
          </ul>
        </div>
        <div className='tabs'>
          <p className='tabs-type'>地区：</p>
          <ul>
            {
              orderTags.map((item, index) => (
                <li
                  key={index}
                  className={order === item ? 'active': ''}
                  onClick={() => {
                    setOrder(item)
                    setCurrentPage(1)
                    allMv()
                  }}
                >
                  {item}
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <ul className='mv-list'>
        {
          mvs.map((item, index) => (
            <li key={index}>
              <div className='img-wrap'>
                <img src={item.cover} alt='' onClick={() => navigate(`/mv/${item.id}`)} />
                <div className='play-count'>
                  <i className='fa fa-video-camera' />
                  {formatNumber(item.playCount)}
                </div>
                <div className='time'>{formatDuration(item.duration)}</div>
              </div>
              <p onClick={() => navigate(`/mv/${item.id}`)}>{item.name}</p>
              <p onClick={() => navigate(`/artist/${item.artistId}`)} className='artist'>{item.artistName}</p>
            </li>
          ))
        }
      </ul>

      <Paginations
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        getPaginations={onChange}
      />
    </div>
  )
};

export default Mvs;