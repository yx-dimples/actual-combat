import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button, IconButton, TableRow, TableContainer, TableCell, TableBody, Table
} from '@material-ui/core'
import {
  ArrowBackIos, Search, MoreVert, Add, ChevronRight, ChatBubble, Collections, QueryBuilder, Share
} from '@material-ui/icons'
import { PlayOutline } from 'antd-mobile-icons'
import { getDjDetail, getDjProgram } from '../../../api/dj'
import { formatNumber, formatDate, formatDuration } from '../../../utils'
import './index.less'

const useStyles = makeStyles(() => ({
  button: {
    position: 'absolute',
    bottom: '10px',
    padding: '0 15px',
    '& .MuiButton-root': {
      border: 'none',
      borderRadius: '100px',
      color: '#fff',
      background: '#ffffff99',
      width: '100px',
    },
    '& .MuiButton-root:nth-of-type(2)': {
      margin: '0 27px',
    },
    '& .MuiButton-root:last-of-type': {
      background: '#fd2952'
    },
    '& .MuiButton-contained': {
      boxShadow: 'none'
    }
  },
  table: {
    '& .MuiTableCell-root': {
      padding: '10px'
    },
    '& .MuiIconButton-root': {
      padding: 0
    }
  }
}));

function Djradio(props) {
  const getParams = useParams()
  const classes = useStyles()
  const navigate = useNavigate()
  const [djDetail, setDjDetail] = React.useState({})
  const [count, setCount] = React.useState(0)
  const [programs, setPrograms] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)

  React.useEffect(() => {
    getDjDetail(Number(getParams.id)).then(res => {
      setDjDetail(res.data.data)
    })
    getDjProgram({
      rid: Number(getParams.id),
      limit: rowsPerPage,
      offset: (page - 1) * rowsPerPage
    }).then(res => {
      setCount(res.data.count)
      setPrograms(res.data.programs)
    })
  }, [getParams.id, page, rowsPerPage])

  const getStyle = useMemo(() => {
    const style = {
      background: `url(${djDetail.picUrl}) center`,
      width: '100%',
      height: '370px',
      filter: 'blur(10px)'
    }
    return style
  }, [djDetail.picUrl])

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className='djradio'>
      <div className='djradio-header'>
        <div style={getStyle} />
        <div className='header-top'>
          <ArrowBackIos onClick={goBack} style={{ fontSize: '30px' }} />
          <div>
            <Search style={{ fontSize: '33px', marginRight: '10px' }} />
            <MoreVert style={{ fontSize: '33px' }} />
          </div>
        </div>
        <div className='header-content'>
          <div className='img-wrap'>
            <img src={djDetail.picUrl} alt='' />
            <div className='play-count'>
              <PlayOutline style={{ marginRight: '10px' }} />
              {formatNumber(djDetail.playCount)}
            </div>
          </div>
          <div className='info'>
            <p className='info-name'>{djDetail.name}</p>
            {
              djDetail.dj && <div className='info-author'>
                <img src={djDetail.dj.avatarUrl} alt='' />
                <p className='info-nickname'>{djDetail.dj.nickname}</p>
                <div className='info-follow'>
                  关注 <Add />
                </div>
              </div>
            }
            <ul>
              <li>{djDetail.category} <ChevronRight /></li>
              <li>{djDetail.secondCategory} <ChevronRight /></li>
            </ul>
          </div>
        </div>
        <div className='header-desc'>
          <p>{djDetail.desc}</p>
          <ChevronRight />
        </div>
        <div className={classes.button}>
          <Button variant="contained" startIcon={<Share />}>分享</Button>
          <Button variant="contained" startIcon={<ChatBubble />}>评论</Button>
          <Button variant="contained" startIcon={<Collections />}>{djDetail.subCount}</Button>
        </div>
      </div>
      <div className='djradio-content'>
        <div className='top'>
          <div className='top-title'>
            <p>声音 <sup className='count'>{count}</sup></p>
            <div className='line' />
          </div>
          <div>完成</div>
        </div>
        <DjradioTable
          programs={programs}
          table={classes.table}
        />
      </div>
    </div >
  )
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Djradio)

function DjradioTable(props) {
  const { programs, table } = props
  return (
    <TableContainer>
      <Table className={table} aria-label="custom pagination table">
        <TableBody>
          {
            programs.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img className='row-coverUrl' src={row.coverUrl} alt='' />
                </TableCell>
                <TableCell>
                  <div className='row-name'>
                    {row.name}
                  </div>
                  <div className='row-info'>
                    <div className='row-createTime'>
                      {formatDate(row.createTime, 'MM-dd')}
                    </div>
                    <div className='row-duration'>
                      <QueryBuilder style={{ fontSize: '16px', marginRight: '5px' }} />
                      {formatDuration(row.duration)}
                    </div>
                    <div className='row-playCount'>
                      <PlayOutline style={{ fontSize: '16px', marginRight: '5px' }} />
                      {row.radio.playCount}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                  // onClick={handleDrawerToggle.bind(this, row)}
                  // className={classes.menuButton}
                  >
                    <MoreVert />
                  </IconButton>
                  {/*
                  <Drawer
                    // container={container}
                    variant="temporary"
                    anchor='bottom'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                      keepMounted: true,
                    }}
                  >
                    {drawer}
                  </Drawer> */}
                </TableCell >
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
