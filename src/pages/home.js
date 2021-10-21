import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CssBaseline from '@mui/material/CssBaseline';

/*
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));
*/
//const darkTheme = createTheme({ palette: { mode: 'dark' } });
//const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function Home({...props}) {

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <div style={{padding: "40px", backgroundColor: "aliceblue", marginTop: "150px"}}>
          <Typography component="h2" variant="h2">Welcome to full stack Application</Typography>
          <Typography component="h6" variant="h6">To get started</Typography>
          <Button variant="contained" style={{padding: "20px", borderRadius: "15px"}} 
            onClick={()=>props.history.push('/login')}>
            Login/Register &nbsp; <LockIcon />
          </Button>
        </div>
      </Container>
    </React.Fragment>
    
  );
}
