export interface RouteItem {
  name: string,             // 菜单唯一标识
  path: string,             // 路由路径
  children?: RouteItem[],   // 子路由
  component?: Function,     // 路由元素，类似于element，支持React.lazy
  hidden?: boolean,         // true则不在菜单中显示
  redirect?: string,        // 重定向到哪个路由
  meta?: {
    title: string,          // 菜单显示的名称
    icon?: JSX.Element,     // 菜单显示的图标
    permission?: string[]   // 根据用户权限显示菜单
  }
}

export interface Song {
  name: string
  id: number
  artists: Artist[]
  album: Album
  duration: number
  publishTime: number
  al: Album
  ar: Artist[]
  dt: number,
  mvid: number
  alia: string[]
  mv: number
}

export interface SongItem {
  name: string
  id: number
  picUrl: string,
  song: Song
}

export interface Artist {
  id?: number
  name?: string
  picUrl?: string
  albumSize?: number
  musicSize?: number
  cover?: string
  alias?: string[]
  mvSize?: number
}

export interface Album {
  name?: string
  id: number
  artist?: Artist
  artists?: Artist
  blurPicUrl?: string
  publishTime?: number
  company?: string
  description?: any
  picUrl?: string
  subTime?: string
}

export interface Playlist {
  id: number
  name: string
  picUrl?: string
  playCount: number
  coverImgUrl?: string
  creator?: {
    nickname?: string,
    avatarUrl?: string
    userId?: number
  }
  createTime?: number
  tags?: string[]
  description?: string
  subscribedCount?: number
  commentCount?: number
  trackIds?: any
}

// 轮播图
export interface Banner {
  imageUrl: string
  typeTitle: string
}

// 歌单分类标签
export interface PlayListTag {
  id: number,
  name: string,
  category: number
}

// mv
export interface Mv {
  id: number
  picUrl?: string
  name?: string
  cover?: string
  artistName?: string
  artistId?: number
  playCount?: number
  duration: number
  subCount?: number
  shareCount?: number
  desc?: number
  publishTime?: string
  cover?: string
  imgurl?: string
  coverUrl?: string
  title?: string
  creator: Creator[]
  vid?: string
}

interface Creator {
  userId: number
  userName: string
}

// 评论
export interface Comment {
  content: string
  user: User
  beReplied: BeReplied[]
}

// 评论回复
export interface BeReplied {
  user: User
  content: string
}

// 用户
export interface User {
  avatarUrl?: string
  nickname?: string
  userId?: numer
  followeds?: number
  eventCount?: number
  follows?: number
  signature?: string
  artistId?: string
}

// 视频
export interface Video {
  data: {
    coverUrl: string,
    title: string
  }
}

// 电台
export interface DJ {
  id: number,
  name: string,
  picUrl: string
  subCount: number // 订阅多少次
  programCount: number // 多少期
}