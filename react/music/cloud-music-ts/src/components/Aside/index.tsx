import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import './index.scss'

interface MenuItem {
  label?: React.ReactNode
  key?: React.Key
  icon?: string
  type?: string
  children?: MenuItem[]
  path?: string | any,
  title?: string
}

interface IProps {
  userPlayingList: any
  isLogin: boolean
  userInfo: any
}

const Aside = ({ userPlayingList, isLogin, userInfo }: IProps )=> {
  const navigate = useNavigate()

  const menus: MenuItem[] = [
    { 
      type: 'root', children: [
        { key: 1, label: '发现音乐', icon: 'fa fa-music', path: '/'},
        { key: 2, label: '推荐视频', icon: 'fa fa-video-camera', path: '/recvideo'},
        { key: 3, label: '每日推荐', icon: 'fa fa-thumbs-o-up', path: '/receveryday' },
        { key: 4, label: '我的收藏', icon: 'fa fa-star-o', path: '/myfavorite' },
      ] 
    }
  ]

  const [value, setValue] = useState<any>(1)

  const retMenus: MenuItem[] = []
  const userCreateList = []
  const userCollectList = []

  if (userPlayingList.length > 0) {
    const collectIndex = userPlayingList.findIndex((item: any) => item.creator.userId !== userInfo.userId);
    if (collectIndex !== -1) {
      userCreateList.push(...userPlayingList.slice(1, collectIndex))
      userCollectList.push(...userPlayingList.slice(collectIndex))
		}
  }

  const genPlaylistChildren = (playlist: any) =>
    playlist.map((item: any) => ({
      path: `/playlist/${item.id}`,
      label: item.name,
      key: item.id
    }))

  if (userCreateList.length) {
    retMenus.push({
      type: "playlist",
      title: "创建的歌单",
      children: genPlaylistChildren(userCreateList)
    })
  }
  
  if (userCollectList.length) {
    retMenus.push({
      type: "playlist",
      title: "收藏的歌单",
      children: genPlaylistChildren(userCollectList)
    })
  }

  const menusWithPlaylist = useMemo(() => {
    return isLogin && retMenus.length ? menus.concat(retMenus) : menus
  }, [isLogin, menus, retMenus])
  
  return (
    <div className='menu-wrap'>
      {
        menusWithPlaylist.map((menu, index) => (
          <div className='menu-block' key={index}>
            {
              menu.title?.length !== 0 && <p className='group-title '>{menu.title}</p>
            }
            <ul>
            {
              menu.children?.map((item, index) => (
                <li
                  key={index}
                  className={value === item.key ? 'menu-item-active' : ''}
                  onClick={() => {
                    setValue(item.key)
                    navigate(item.path)
                  }}
                >
                  <i className={item.icon} />
                  <span className='lable'>{item.label}</span>
                </li>
              ))
            }
            </ul>
          </div>
        ))
      }
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    isLogin: state.isLogin,
    userPlayingList: state.userPlayingList,
    userInfo: state.userInfo
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Aside)