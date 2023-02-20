import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { 
  getPlaylistComment, getMvComment, getVideoComment, getAlbumComment,
  getMusicComment, getHotComment
 } from '../../api'
import { Comment } from '../../types'
import Paginations from "../Pagination";
import './index.scss'

interface IProps {
  id: string | Number
  type: string
  getTotal?: any
}

const MUSIC_TYPE = 'music'
const MV_TYPE = 'mv'
const VIDEO_TYPE = 'video'
const ALBUM_TYPE = 'album'
const PLAYLIST_TYPE = 'playlist'

const sortCategory = [
  { title: "按热度排序", sortType: 3 },
	{ title: "按时间排序", sortType: 2 }
]

function Comments ({ id, type, getTotal }: IProps) {
  const navigate = useNavigate()
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [total, setTotal] = useState(0)
  const [hotTotal, setHotTotal] = useState(0)
  const [sortType, setSortType] = useState(3)
  const [comments, setComments] = useState<Comment[]>([])
  const [hotComments, setHotComments] = useState<Comment[]>([])

  useEffect(() => {
    const commentRequestMap = {
      [MV_TYPE]: getMvComment,
      [VIDEO_TYPE]: getVideoComment,
      [ALBUM_TYPE]: getAlbumComment,
      [MUSIC_TYPE]: getMusicComment,
      [PLAYLIST_TYPE]: getPlaylistComment
    }

    commentRequestMap[type]({
      id: Number(id),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then((res: any) => {
      if (getTotal) {
        getTotal(res.data.total)
      }
      setTotal(res.data.total)
      
      setComments(res.data.comments)
    })

    let typeNumber
    switch (type) {
      case MV_TYPE:
        typeNumber = 1
        break;
      case VIDEO_TYPE:
          typeNumber = 5
          break;
      case ALBUM_TYPE:
        typeNumber = 3
        break;
      case MUSIC_TYPE:
        typeNumber = 0
        break;
      case PLAYLIST_TYPE:
        typeNumber = 2
        break;
      default:
        break;
    }

    getHotComment({
      id: Number(id),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      type: typeNumber
    }).then(res => {
      setHotComments(res.data.hotComments)
      setHotTotal(res.data.total)
    })


  }, [currentPage, getTotal, id, pageSize, type])

  const changeSort = (sortType: number, index: number) => {
    setCurrentIndex(index)
    setSortType(sortType)
    // setCurrentPage(index)
  }

  const count = (sortType: number) => {
    if (sortType === 3) {
      return hotTotal
    } else {
      return total
    }
  }

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  };

  return (
    <div className="comment">
      <p>{sortType === 3 ? `热门评论(${hotTotal})` : `最新评论(${total})`}</p>
      <div className="sort-category">
        {
          sortCategory.map((item, index) => (
            <span
              onClick={() => changeSort(item.sortType, index)}
              key={index}
              className={currentIndex === index ? 'active' : ''}
            >{item.title}</span>
          ))
        }
      </div>
      <div>{sortType === 3 ? 
        <ul className="comment-list">
          {hotComments.map((item, index) => (
            <li key={index}>
              <img onClick={() => navigate(`/user/${item.user.userId}`)} src={item.user.avatarUrl} alt='' />
              <div className="info">
                <div className="content">
                  <span className="nickname" onClick={() => navigate(`/user/${item.user.userId}`)}>{item.user.nickname}：</span>
                  <span>{item.content}</span>
                </div>
                {
                  item.beReplied !==null && item.beReplied.length > 0 && 
                    <ul>
                      {
                        item.beReplied.map((el, i) => (
                          <li className="be-replied" key={i}>
                            <span className="nickname" onClick={() => navigate(`/user/${el.user.userId}`)}>{el.user.nickname}：</span>
                            {item.content}
                          </li>
                        ))
                      }
                    </ul>
                }
              </div>
              
            </li>
          ))}
        </ul> : 
          <ul className="comment-list">
          {comments.map((item, index) => (
            <li key={index}>
              <img src={item.user.avatarUrl} alt='' />
              <div className="info">
                <div className="content">
                  <span className="nickname">{item.user.nickname}：</span>
                  <span>{item.content}</span>
                </div>
                {
                  item.beReplied !==null && item.beReplied.length > 0 && 
                    <ul>
                      {
                        item.beReplied.map((el, i) => (
                          <li className="be-replied" key={i}>
                            <span className="nickname">{el.user.nickname}：</span>
                            {item.content}
                          </li>
                        ))
                      }
                    </ul>
                }
              </div>
              
            </li>
          ))}
        </ul>
        }
      </div>

      <Paginations
        total={count(sortType)}
        currentPage={currentPage} 
        pageSize={pageSize}
        getPaginations={onChange}
      />
    </div>
  )
}

export default Comments