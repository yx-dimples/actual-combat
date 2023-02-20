import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlbumNew } from '../../../../../../api';
import { Album } from '../../../../../../types';
import Paginations from '../../../../../../components/Pagination';
import { formatDate } from '../../../../../../utils';

import './index.scss'

const areaTags = [
  { area: 'ALL', name: '全部' },
  { area: 'ZH', name: '华语' },
  { area: 'EA', name: '欧美' },
  { area: 'KR', name: '韩国' },
  { area: 'JP', name: '日本' }
]

const TopAlbum: React.FC = () => {
  const navigate = useNavigate();
  const [area, setArea] = React.useState<string>('ALL')
  const [album, setAlbum] = React.useState<Album[]>([])
  const [total, setTotal] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(48)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    topSong()
  }, [])

  const topSong = () => {
    getAlbumNew({
      area,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then(res => {
      console.log(res.data.albums);
      setAlbum(res.data.albums)
      setTotal(res.data.total)
    })
  }

  const typeClick = (item: any) => {
    setArea(item.area)
    setCurrentPage(1)
    topSong()
  }
  
  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    topSong()
  }

  return (
    <div className='new-album'>
      <ul className='menu'>
        {
          areaTags.map((item, index) => (
            <li 
              key={index}
              className={area === item.area ? 'active' : ''}
              onClick={() => typeClick(item)}
            >
              {item.name}
            </li>
          ))
        }
      </ul>

      <ul className='album-list'>
        {
          album.map((item, index) => (
            <li key={index}>
              <div className='img-wrap'>
                <img onClick={() => navigate(`/album/${item.id}`)} src={item.blurPicUrl} alt='' />
              </div>
              <p className='name' onClick={() => navigate(`/album/${item.id}`)}>{item.name}</p>
              <p className='time'>{formatDate(item.publishTime, 'yyyy-MM-dd')}</p>
            </li>
          ))
        }
      </ul>

      <Paginations
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        getPaginations={onChange}
      />
    </div>
  );
}

export default TopAlbum;