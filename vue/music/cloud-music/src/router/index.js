import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import('../views/Discovery.vue')
const PlayLists = () => import('../views/PlayLists.vue')
const Recvideo = () => import('../views/Recvideo')
const Recommend = () => import('../views/Recommend.vue')

const Mv = () => import('../views/Recvideo/components/Mv.vue')
const Video = () => import('../views/Recvideo/components/Video.vue')
const MvDetails = () => import('../views/Recvideo/components/MvDetails.vue')
const VideoDetails = () => import('../views/Recvideo/components/VideoDetails.vue')
const PlayList = () => import('../views/PlayList.vue')
const User = () => import('../views/UserDetail.vue')
const Artist = () => import('../views/Artist/index.vue')
const ArtistProduct = () => import('../views/Artist/components/product.vue')
const ArtistAlbum = () => import('../views/Artist/components/album.vue')
const ArtistMV = () => import('../views/Artist/components/mv.vue')
const ArtistDesc = () => import('../views/Artist/components/desc.vue')
const Album = () => import('../views/Album.vue')
const Search = () => import('../views/Search')
const SearchMusic = () => import('../views/Search/music.vue')
const SearchMvs = () => import('../views/Search/mvs.vue')
const SearchPlayList = () => import('../views/Search/playlist.vue')
const Artists = () => import('../views/Artists.vue')

export const layoutCenterNames = ['Discovery', 'PlayLists', 'Recvideo', 'Recommend', 'Artists']
export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music'
    }
  },
  {
    path: '/palylists',
    name: 'palylist',
    component: PlayLists,
    meta: {
      title: '推荐歌单',
      icon: 'palylist'
    }
  },
  {
    path: '/recvideo',
    name: 'Recvideo',
    redirect: '/recvideo/mv',
    component: Recvideo,
    children: [
      {
        name: 'Mv',
        path: 'mv',
        component: Mv
      },
      {
        name: 'video',
        path: 'video',
        component: Video
      }
    ],
    meta: {
      title: 'mv',
      icon: 'mv'
    }
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    meta: {
      title: '每日推荐',
      icon: 'recommend'
    }
  },
  {
    path: '/artist',
    name: 'artist',
    component: Artists,
    meta: {
      title: '歌手',
      icon: 'artist'
    }
  }
]

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/mv/:id',
    name: 'mv',
    component: MvDetails,
    props: (route) => ({ id: +route.params.id })
  },
  {
    path: '/video/:id',
    name: 'video',
    component: VideoDetails,
    props: (route) => ({ id: +route.params.id })
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: PlayList,
    props: (route) => ({ id: +route.params.id })
  },
  {
    path: '/user/:id',
    name: 'user',
    component: User
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: Artist,
    children: [
      {
        path: '/artist/:id',
        name: 'artistProduct',
        component: ArtistProduct
      },
      {
        path: '/artist/album/:id',
        name: 'artistAlbum',
        component: ArtistAlbum
      },
      {
        path: '/artist/mv/:id',
        name: 'artistMV',
        component: ArtistMV
      },
      {
        path: '/artist/desc/:id',
        name: 'artistDesc',
        component: ArtistDesc
      }
    ]
  },
  {
    path: '/album/:id',
    name: 'album',
    component: Album
  },
  {
    path: '/search/:keywords',
    name: 'search',
    component: Search,
    props: true,
    children: [
      {
        path: '/',
        redirect: 'music'
      },
      {
        path: 'music',
        name: 'searchMusic',
        component: SearchMusic
      },
      {
        path: 'playlist',
        name: 'searchPlaylist',
        component: SearchPlayList
      },
      {
        path: 'mvs',
        name: 'searchMvs',
        component: SearchMvs
      }
    ]
  },
  ...menuRoutes
]

const router = new VueRouter({
  routes
})

export default router
