import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow,
  TablePagination, TableFooter} from '@material-ui/core';
import { getSearch } from '../../../../api';
import { Song } from '../../../../types';
import { formatDuration } from '../../../../utils'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    '& .MuiTableCell-root': {
      border: 'none'
    },
    '& .MuiTableCell-body': {
      color: '#606266',
    },
    '& .MuiTableRow-root:nth-of-type(even)': {
      background: '#2e2e2e'
    },
    '& .hover:hover': {
      textDecoration: 'underline'
    }
  },
});

export default function CustomPaginationActionsTable() {
  const classes = useStyles();
  const navigate = useNavigate()
  const { keywords, type } = useParams()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState<Song[]>([])
  const [total, setTotal] = React.useState<number>(0)

  useEffect(() => {
    getSearch({
      keywords,
      type: Number(type),
      limit: rowsPerPage,
      offset: (page) * rowsPerPage
    }).then(res => {
      const { songs, songCount } = res.data.result
        setData(songs);
        setTotal(songCount)
    })
  }, [keywords, type, page, rowsPerPage])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer className={classes.table}>
      <Table  aria-label="custom pagination table">
        <TableBody>
          {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className='hover' component="th" scope="row">
                  <i className='fa fa-play' /> {row.name}
                </TableCell>
                <TableCell onClick={() => navigate(`/album/${row.album.id}`)} className='hover'>{row.album.name}</TableCell>
                <TableCell onClick={() => navigate(`/artist/${row.artists[0].id}`)} className='hover'>{row.artists[0].name}</TableCell>
                <TableCell className='hover'>{formatDuration(row.duration)}</TableCell>
              </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30, { label: 'All', value: -1 }]}
              colSpan={3}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
