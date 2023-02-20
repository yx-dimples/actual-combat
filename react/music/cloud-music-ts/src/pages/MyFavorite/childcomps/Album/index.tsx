import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { message } from 'antd';
import { getAlbumSublist } from '../../../../api'
import { Album } from '../../../../types'
import Pagination from '../../../../components/Pagination'
import { formatDate } from '../../../../utils';
import './index.scss'

interface IProps {
  isLogin: boolean
}

const Albums = ({ isLogin }: IProps ) => {
  const navigate = useNavigate()

  const [total, setTotal] = React.useState(0)
  const [album, setAlbum] = React.useState<Album[]>([])
  const [pageSize, setPageSize] = React.useState(25)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    if (!isLogin) {
      message.warning('登录后才能查看')
    }
    
    getAlbumSublist({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then(res => {
      setAlbum(res.data.data)
      setTotal(res.data.count)
    })
  }, [currentPage, isLogin, pageSize])

  const onArtistPage = (item: any) => {
    navigate(`/artist/${item.artists[0].id}`)
  }

  const onchange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  return (
    <div className="album">
      <p className='hd'>我收藏的专辑&nbsp;({total})</p>
      <ul className='albums-list'>
        {
          album.map((item, index) => (
            <li key={index}>
              <div className='img-wrap'>
                <img src={item.picUrl} alt='' onClick={() => navigate(`/album/${item.id}`)} />
              </div>
              <p>
                <span className='name' onClick={() => navigate(`/album/${item.id}`)}>{item.name}</span>
                {
                  item.artists &&
                  <span onClick={() => onArtistPage(item)} className='artist'>by{item.artists[0].name}</span>
                }
              </p>
              <p>{formatDate(item.subTime, 'yyyy-MM-dd')}</p>
            </li>
          ))
        }
      </ul>
      <Pagination total={total} pageSize={pageSize} currentPage={currentPage} getPaginations={onchange} />
    </div>
  )
}

function mapStateToProps(state: any) {
  const { userReducer } = state
  return {
    isLogin: userReducer.isLogin
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Albums)