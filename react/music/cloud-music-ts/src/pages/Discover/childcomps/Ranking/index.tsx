import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopList } from '../../../../api'
import FeatureChild from './FeatureChild'
import "./index.scss";

interface Toplist {
  coverImgUrl: string
  name: string,
  id: number
}

const Ranking: React.FC = () => {
  const navigate = useNavigate()
  const [rankfeature, setRankfeature] = useState<Toplist[]>([])
  const [rankglobal, setRankglobal] = useState<Toplist[]>([])

  useEffect(() => {
    getTopList().then(res => {
      let allRankInfo = res.data.list
      setRankfeature(allRankInfo.slice(0, 4))
      setRankglobal(allRankInfo.slice(4, allRankInfo.length))
    })
  }, [])

  return (
    <div className="ranking">
      <div className="wrapper">
        <p className="title">流行榜</p>
        <ul className="rankfeature">
          {
            rankfeature.map((item, index) => (
              <li key={index}>
                <FeatureChild item={item} />
              </li>
            ))
          }
          
        </ul>
      </div>

      <div className="wrapper">
        <p className="title">全球榜</p>
        <ul className="rankglobal">
        {
            rankglobal.map((item, index) => (
              <li key={index} onClick={() => navigate(`/playlist/${item.id}`)}>
                <div className="img-wrap">
                  <img src={item.coverImgUrl} alt='' />
                </div>
                <p className="name">{item.name}</p>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default Ranking