import React from "react";
import { useNavigate } from "react-router-dom";
import { Mv } from '../../../../types'
import './index.scss'

interface IProps {
  mv: Mv[]
}

const MvDetail = ({ mv }: IProps) => {
  const navigate = useNavigate()

  return (
    <ul className="mvs">
      {mv.map((item, index) => (
        <li key={index}>
          <div className="img-wrap">
            <img src={item.imgurl} alt='' />
            <div className="bottom" onClick={() => navigate(`/mv/${item.id}`)}>
              <i className="fa fa-play-circle-o" />
            </div>
          </div>
          <p>{item.name}</p>
        </li>
      ))}
    </ul>
  )
}

export default MvDetail;