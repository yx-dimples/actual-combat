import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


interface Introduction {
  ti: string
  txt: string
}

interface DescItem {
  briefDesc: string
  introduction: Introduction[]
}

interface IProps {
  desc: DescItem
  name: any
}


const useStyles = makeStyles({
  root: {
    '& .MuiTypography-body1': {
      fontSize: '12px',
      textIndent: '24px'
    },
    '& .MuiTypography-body2': {
      whiteSpace: 'pre-wrap',
      fontSize: '12px',
    }
  },
});

const Desc = ({ desc, name }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        {name}简介
      </Typography>
      <Typography variant="body1" gutterBottom>
        {desc.briefDesc}
      </Typography>

      {
        desc.introduction.map((item, index) => (
          <div key={index}>
            <Typography variant="h6" gutterBottom>
              {name}{item.ti}
            </Typography>

            <Typography variant="body2" gutterBottom>
              {item.txt}
            </Typography>
          </div>
        ))
      }
    </div>
  );
}

export default Desc