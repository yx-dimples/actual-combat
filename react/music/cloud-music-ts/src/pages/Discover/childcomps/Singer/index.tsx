import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PermIdentity, Album } from '@material-ui/icons'
import { getArtistList } from '../../../../api'
import { Artist } from '../../../../types'
import { formatNumber } from "../../../../utils";
import Paginations from "../../../../components/Pagination";
import "./index.scss";

const typeTags = [
  { type: -1, name: "全部" },
  { type: 1, name: "男歌手" },
  { type: 2, name: "女歌手" },
  { type: 3, name: "乐队" }
]

const areaTags = [
  { area: -1, name: "全部" },
  { area: 7, name: "华语" },
  { area: 96, name: "欧美" },
  { area: 8, name: "日本" },
  { area: 16, name: "韩国" },
  { area: 0, name: "其他" }
]

const initialTags = [
  { initial: -1, name: "热门" },
	{ initial: "a", name: "A" },
	{ initial: "b", name: "B" },
	{ initial: "c", name: "C" },
	{ initial: "d", name: "D" },
	{ initial: "e", name: "E" },
	{ initial: "f", name: "F" },
	{ initial: "g", name: "G" },
	{ initial: "h", name: "H" },
	{ initial: "i", name: "I" },
	{ initial: "j", name: "J" },
	{ initial: "k", name: "K" },
	{ initial: "l", name: "L" },
	{ initial: "m", name: "M" },
	{ initial: "n", name: "N" },
	{ initial: "o", name: "O" },
	{ initial: "p", name: "P" },
	{ initial: "q", name: "Q" },
	{ initial: "r", name: "R" },
	{ initial: "s", name: "S" },
	{ initial: "t", name: "T" },
	{ initial: "u", name: "U" },
	{ initial: "v", name: "V" },
	{ initial: "w", name: "W" },
	{ initial: "x", name: "X" },
	{ initial: "y", name: "Y" },
	{ initial: "z", name: "Z" },
	{ initial: 0, name: "#" }
]

const Singer: React.FC = () => {
  const navigate = useNavigate()
  const [type, setType] = useState<number>(-1)
  const [area, setArea] = useState<number>(-1)
  const [initial, setInitial] = useState<number | string>(-1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(48)
  const [total] = useState<number>(960)
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    getArtistby()
  }, [])

  const getArtistby = () => {
    getArtistList({
      type,
      area,
      initial,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }).then(res => {
      setArtists(res.data.artists)
    })
  }

  const onChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    getArtistby()
  };

  return (
    <div className="singer">
      <div className="params">
        <div className="tabs">
          <div className="tabs-type">语种：</div>
          <ul>
            {
              areaTags.map((item, index) => (
                <li
                  className={area === item.area ? 'active' : ''} 
                  key={index}
                  onClick={() => {
                    setArea(item.area)
                    setCurrentPage(1)
                    getArtistby()
                  }}
                >
                  <span>{item.name}</span>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="tabs">
          <div className="tabs-type">分类：</div>
          <ul>
            {
              typeTags.map((item, index) => (
                <li
                  className={type === item.type ? 'active' : ''} 
                  key={index}
                  onClick={() => {
                    setType(item.type)
                    setCurrentPage(1)
                    getArtistby()
                  }}
                >
                  <span>{item.name}</span>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="tabs">
          <div className="tabs-type">筛选：</div>
          <ul>
            {
              initialTags.map((item, index) => (
                <li
                  className={initial === item.initial ? 'active' : ''} 
                  key={index}
                  onClick={() => {
                    setInitial(item.initial)
                    setCurrentPage(1)
                    getArtistby()
                  }}
                >
                  <span>{item.name}</span>
                </li>
              ))
            }
          </ul>
         
        </div>
      </div>

      <ul className="artist-list">
        {
          artists.map((item, index) => (
            <li key={index}>
              <div className="img-wrap">
                <img src={item.picUrl} alt='' />
                <p className="music-size">
                  <i className="fa fa-music" />
                  {formatNumber(item.musicSize)}
                </p>
                <div className="album-size">
                  <Album style={{ fontSize: 13 }} />
                  {formatNumber(item.albumSize)}
                </div>
              </div>

              <div className="name">
                <PermIdentity style={{ fontSize: 16, color: '#b1b1b1' }}  />
                <p onClick={() => navigate(`/artist/${item.id}`)}>{item.name}</p>
              </div>
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

export default Singer