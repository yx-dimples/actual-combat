import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { LibraryMusic } from '@material-ui/icons';
import { Song } from "../../../../types";
import { formatDuration } from "../../../../utils";

interface IProps {
  song: Song[]
}

const useStyles = makeStyles((theme: Theme) => ({
  wooks: {
    marginTop: '20px',
    '& .MuiButton-containedPrimary': {
      background: '#175ceb',
      marginRight: '10px'
    },
    '& .MuiTableCell-root': {
      border: 'none'
    },
    '& .MuiTableCell-body': {
      color: '#606266',
      fontSize: '12px'
    },
    '& .display': {
      display: 'flex'
    },
    '& .name': {
      color: '#dcdde4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .alia': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '202px'
    },
    '& .mv': {
      color: '#d13030',
      border: '1px solid #d13030',
      padding: '0 2px',
      cursor: 'pointer',
    },
    '& .hover:hover': {
      textDecoration: 'underline'
    }
  },
}));

const Works = ({ song }: IProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  
  return (
    <div className={classes.wooks}>
      <div className="wooks-top">
        <div className="wooks-left">
          <div className="btns">
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="fa fa-play-circle-o" />}
              size='small'
            >
              播放
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<LibraryMusic />}
            >收藏</Button>
          </div>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {song.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell className="display">
                      <p className="name">{row.name}</p>&nbsp;&nbsp;
                      {
                        row.alia.length !==0 && <p className="alia">-{row.alia[0]}</p>
                      }
                      {
                        row.mv !==0 && <p onClick={() => navigate(`/mv/${row.mv}`)} className="mv">mv</p>
                      }
                    </TableCell>
                    <TableCell>{formatDuration(row.dt)}</TableCell>
                    <TableCell>{row.al.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="wooks-right"></div>
      </div>
    </div>
  )
}

export default Works;