import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TableContainer, Checkbox, TableRow, TableCell, TableBody, Table } from '@material-ui/core'
import { PlayCircleFilled, PlaylistAddCheck, MoreVert } from '@material-ui/icons'
import './index.less'

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    '& .MuiTableCell-root': {
      padding: ' 10px 5px',
      '& .row-name': {
        fontWeight: 'bold',
        fontSize: '18px',
        width: '256px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      '& .row-al': {
        color: '#7e7e7e',
      }
    },
    '& .MuiTableCell-root:first-of-type': {
      paddingLeft: '15px',
    },
    '& .MuiTableCell-root:last-of-type': {
      paddingRight: '15px',
    },
  }
}))


function MusicList(props) {
  const classes = useStyles()

  const [selectedAllShow, setSelectedAllShow] = React.useState(false)
  const [selected, setSelected] = React.useState([])


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {

      const newSelecteds = props.list.map((n) => {
        if (n.data === undefined) {
          return n.id
        } else {
          return n.data.id
        }
      })
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const toggleSelectedAllShow = () => {
    setSelectedAllShow(!selectedAllShow)
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  return (
    <div className='music-list'>
      <div className='list-header'>
        {
          selectedAllShow ?
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={props.list.length}
            /> :
            <div className='playAll'>
              <PlayCircleFilled style={{ color: '#ff393b', fontSize: '35px', marginRight: '5px' }} />
              播放全部<span>({props.list.length})</span>
            </div>
        }
        {
          selectedAllShow ?
            <div className='all-text' onClick={toggleSelectedAllShow}>
              完成
            </div> :
            <PlaylistAddCheck
              style={{ fontSize: '40px', marginRight: '5px' }}
              onClick={toggleSelectedAllShow}
            />
        }
      </div>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          aria-label="enhanced table"
        >
          <TableBody>
            {
              props.list.map((row, index) => {
                let isItemSelected
                let labelId
                let id
                let picUrl
                let name
                let arName
                let alName
                if (row.data === undefined) {
                  id = row.id
                  picUrl = row.al.picUrl
                  name = row.name
                  arName = row.ar[0].name
                  alName = row.al.name
                  isItemSelected = isSelected(id)
                  labelId = `enhanced-table-checkbox-${index}`

                } else {
                  if (row.data && row.data.al) {
                    id = row.data.id
                    picUrl = row.data.al.picUrl
                    name = row.data.name
                    arName = row.data.ar[0].name
                    alName = row.data.al.name
                    isItemSelected = isSelected(id)
                    labelId = `enhanced-table-checkbox-${index}`
                  }
                }
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={id}
                    selected={isItemSelected}
                  >
                    {
                      selectedAllShow ?
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell> :
                        <></>
                    }
                    <TableCell id={labelId}>
                      <img src={picUrl} alt='' className='picUrl' />
                    </TableCell>
                    <TableCell>
                      <p className='row-name'>
                        {name}
                      </p>
                      <p className='row-al'>
                        {arName} - {alName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <MoreVert style={{ color: '#7e7e7e' }} />
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  )
}

export default MusicList

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props
  return (
    <div>
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={onSelectAllClick}
        inputProps={{ 'aria-label': 'select all desserts' }}
      />
      <span>
        全选
      </span>
    </div>
  )
}