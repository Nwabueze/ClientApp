import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import image from '../static/images/prfp.PNG';
import image2 from '../static/images/fb-cover-1.PNG';
import { Avatar, Divider, List, ListItem, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Profile() {

  const [user, setUser] = useState(false);
  useEffect(()=>{
    setUser(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : false);
  },[]);

  const classes = useStyles();
  return (
    !user ? null :
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8} sx={{display: { xs: 'none', sm: 'none', md: "block" }}}>
          <Item style={{paddingTop: "0px", paddingBottom: "50px"}}>
          <Box className={`${classes.br5} ${classes.centered} ${classes.mb3}`} style={{width: "100%", height: "1000px"}}>
            <img src={image2} style={{width: "100%", height: "350px"}} alt="Cover"/>
          </Box>
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={4} sx={{display: { xs: 'block', sm: 'block', md: "block" }}}>
          <div className={`${classes.centered} ${classes.border}`} style={{width: "90%"}}>
            <div className={`${classes.centered} ${classes.w200s}`}>
              <List>
                <ListItem>
                  <Avatar style={{width:"90%", maxWidth: "150px", height:"150px", objectFit: "contain"}} className={`${classes.centered}`} alt="Profile Picture" src={image} sx={{ width: 150, height: 150 }}/>
                </ListItem>
              </List>
            </div>
            <div style={{padding: "10px"}}>
              <div className={classes.mt5} style={{marginTop: "80px"}}>
                <Divider />
              </div>
              <div className={classes.center}>
                <Typography variant="overline">Username</Typography>
                <Typography variant="caption">&nbsp;@{user.name}</Typography>
              </div>
              <div className={classes.center}>
                <Typography variant="overline">Phone</Typography>
                <Typography variant="caption">&nbsp;{user.phone}</Typography>
              </div>
              <div className={classes.center}>
                <Typography variant="overline">Interests</Typography>
                <div>
                  {
                    user.interests.split(', ').map((item) => (
                      <Chip
                        label={item}
                        deleteIcon={<DoneIcon />}
                        style={{margin: "5px"}}
                       />
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
