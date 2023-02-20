import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from 'antd'
import type { PaginationProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getCatlist, getPlayList } from '../../../../api'
import { Playlist, PlayListTag } from "../../../../types";
import { formatNumber } from "../../../../utils";
import './index.scss';

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>上一步</a>;
  }
  if (type === 'next') {
    return <a>下一步</a>;
  }
  return originalElement;
};

const PlayLists: React.FC = () => {
  const navigate = useNavigate()
  const layer = useRef<any>(null)
  const [cat, setCat] = useState<string>('')
  const [langage, setLangage] = useState<PlayListTag []>([])
  const [playlist, setPlaylist] = useState<Playlist[]>([])
  const [isShowCat, setIsShowCat] = useState<boolean>(false)
  const [limit] = useState<number>(54)
  const [order] = useState<string>('hot')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setToal] = useState<number>(0)

  useEffect(() => {
    getPlayList({
      order,
      limit,
      offset: (currentPage- 1) * limit,
      cat
    }).then(res => {
      setCat(res.data.cat);
      setToal(res.data.total);
      setPlaylist(res.data.playlists)
    })
  }, [cat, limit, order, currentPage, langage])


  const openLayer = () => {
    setIsShowCat(true)
    setTimeout(() => {
      window.addEventListener('click', closeLayer)
    }, 10)
  }

  const closeLayer = (e: any) => {
    if (!layer.current) { 
      return false
    }
    if (!layer.current.contains(e.target)) {
      setIsShowCat(false)
      window.removeEventListener('click', closeLayer)
    }
  }

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="playlist">
      <div className="playlist-header">
        <div className="left">
          <div className="default-tile">{cat}</div>
          <Button size="small" onClick={openLayer}>选择分类 <DownOutlined /></Button>
          {
            isShowCat && 
            <div className="tags-wrapper" ref={layer}>
              <div className="hd">全部分格</div>
            </div>
          } 
        </div>
      </div>

      <ul className="list">
        {
          playlist.map((item, index) => (
            <li key={index}>
              <div className="img-wrap">
                <img src={item.coverImgUrl} alt='' onClick={() => navigate(`/playlist/${item.id}`)} />
                <div className='bottom'>
                  <div className='play-count'>
                    <i className='fa fa-headphones' />
                    {formatNumber(item.playCount)}
                  </div>
                  <div className='play'><i className='fa fa-play-circle-o' /></div>
                </div>
              </div>
              <p onClick={() => navigate(`/playlist/${item.id}`)}>{item.name}</p>
            </li>
          ))
        }
      </ul>

      <div className="pagination">
        <Pagination
          total={total}
          current={currentPage} 
          itemRender={itemRender}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default PlayLists