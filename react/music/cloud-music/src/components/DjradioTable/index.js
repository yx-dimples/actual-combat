import React from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  IconButton, Paper, TableRow, TablePagination, TableFooter, TableContainer, TableCell, TableBody, Table,
  Drawer, List, ListItem, ListItemIcon, ListItemText
} from '@material-ui/core'
import {
  QueryBuilder, KeyboardArrowLeft, KeyboardArrowRight, LastPage, FirstPage, PlayArrow, MoreVert,
  LibraryAdd, ChatBubble, GetApp, Share
} from '@material-ui/icons'
import { getDjProgram } from '../../api/dj'
import { formatDate, formatDuration } from '../../utils'
import './index.less'

const useStyles1 = makeStyles(() => ({
  root: {
    flexShrink: 0
  }
}))

function TablePaginationActions(props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </div>
  )
}

const useStyles2 = makeStyles((theme) => ({
  table: {
    width: '100vw'
  }
}))

export default function DjradioTable(props) {
  const classes = useStyles2()
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [programs, setPrograms] = React.useState([])
  const [programsRow, setProgramsRow] = React.useState([])
  const [mobileOpen, setMobileOpen] = React.useState(false)


  React.useEffect(() => {
    getDjProgram({
      rid: Number(props.id),
      limit: rowsPerPage,
      offset: (page - 1) * rowsPerPage
    }).then(res => {
      setTotal(res.data.count)
      setPrograms(res.data.programs)
    })

  }, [page, props.id, rowsPerPage])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDrawerToggle = (row) => {
    setProgramsRow(row)
    setMobileOpen(!mobileOpen)
  }

  const toPage = (row, value) => {
    switch (value) {
      case 1:
        break
      case 2:
        navigate(`/comment/${row.id}`, {
          state: 'dj'
        })
        break
      default:
        break
    }
  }

  const drawer = (
    <div className='drawer-container'>
      <div className='drawer-header'>
        <img src={programsRow.blurCoverUrl} alt='' />
        <div className='drawer-info'>
          <div className='name'>{programsRow.name}</div>
          {
            programsRow.dj &&
            <div className='nickname'>{programsRow.dj.nickname}</div>
          }
        </div>
      </div>
      <List>
        <ListItem button>
          <ListItemIcon><LibraryAdd /></ListItemIcon>
          <ListItemText primary='收藏声音' />
        </ListItem>
        <ListItem button onClick={toPage.bind(this, programsRow, 2)}>
          <ListItemIcon><ChatBubble /></ListItemIcon>
          {
            programsRow.commentCount === 0 ?
              <ListItemText primary={'评论'} /> :
              <ListItemText primary={'评论 （' + programsRow.commentCount + '）'} />
          }
        </ListItem>
        <ListItem button>
          <ListItemIcon><GetApp /></ListItemIcon>
          <ListItemText primary='下载' />
        </ListItem>
        <ListItem button>
          <ListItemIcon><Share /></ListItemIcon>
          <ListItemText primary='分享' />
        </ListItem>
      </List>
    </div >
  )


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
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
                      <PlayArrow style={{ fontSize: '16px', marginRight: '5px' }} />
                      {row.radio.playCount}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle.bind(this, row)}
                    className={classes.menuButton}
                  >
                    <MoreVert />
                  </IconButton>

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
                  </Drawer>
                </TableCell >
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}