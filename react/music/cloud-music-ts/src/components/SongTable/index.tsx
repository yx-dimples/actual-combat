import React from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { TableRow, Table, TableCell, TableBody, TableContainer, TableHead} from '@material-ui/core';
import { Song } from '../../types'
import { formatNumber, formatDuration } from '../../utils'

interface IProps {
  song: Song[]
}

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: 'none'
    },
    '& .MuiTableCell-head': {
      color: '#606266',
      fontSize: '12px'
    },
    '& .title': {
      color: '#b1b1b1',
    },
    '& .MuiTableCell-body': {
      color: '#606266',
      fontSize: '12px'
    },
    '& .MuiTableRow-root:nth-of-type(even)': {
      background: '#2e2e2e'
    },
    '& .name': {
      cursor: 'pointer',
      color: '#b1b1b1',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    '& .hover:hover': {
      textDecoration: 'underline'
    }
  },
});

function SongTable({ song }: IProps) {
  const classes = useStyles();
  const navigate = useNavigate()

  return (
    <div className={classes.table}>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className='title'>歌曲名称</TableCell>
              <TableCell>歌手</TableCell>
              <TableCell>专辑</TableCell>
              <TableCell>时长</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              song.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell className='name'>{row.name}</TableCell>
                  <TableCell className='hover' onClick={() => navigate(`/artist/${row.ar[0].id}`)}>
                    {row.ar[0].name}
                  </TableCell>
                  <TableCell className='hover' onClick={() => navigate(`/album/${row.al.id}`)}>
                    {row.al.name}
                  </TableCell>
                  <TableCell>{formatDuration(row.dt)}</TableCell>
                </TableRow>
              ))
            }
            {/* {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SongTable