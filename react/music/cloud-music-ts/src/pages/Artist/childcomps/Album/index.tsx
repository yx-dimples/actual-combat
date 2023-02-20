import React from "react";
import { useNavigate } from "react-router-dom";
import { Album } from "../../../../types";
import Pagination from '../../../../components/Pagination'
import { formatDate } from "../../../../utils";
import './index.scss';

interface IProps {
  total: any
  currentPage: any
  pageSize: any
  onChange: any
  album: Album[]
}

const Albums = ({ total, currentPage, pageSize, onChange, album }: IProps) => {
  const navigate = useNavigate()
  return (
    <div className="album">
      <ul className="album-list">
        {
          album.map((item, index) => (
            <li key={index}>
              <div className="img-wrap" onClick={() => navigate(`/album/${item.id}`)}>
                <img src={item.picUrl} alt='' />
              </div>
              <p onClick={() => navigate(`/album/${item.id}`)} className="name">{item.name}</p>
              <p>{formatDate(item.publishTime, 'yyyy-MM-dd')}</p>
            </li>
          ))
        }
      </ul>
      <Pagination
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        getPaginations={onChange}
      />
    </div>
  )
}

export default Albums;