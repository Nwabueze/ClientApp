import React, { useEffect, useState } from 'react';
//import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';

//import image from '../static/images/prfp.PNG';
import { Button, FormControl, Input, List, ListItem, Typography } from '@mui/material';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

export default function Profile() {

  const [user, setUser] = useState(false);
  useEffect(()=>{
    setUser(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : false);
  },[]);

  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const [inputFields, setFields] = useState({name: {open: false, display: "none"}, email: {open: false, display: "none"}, password: {open: false, display: "none"}});
  const classes = useStyles();
  
  const [inputOpen, setInput] = useState(false);
  const handleField = () => {
      setInput(true);
  };
  const resetField = () => {
    setInput(false);
  };
  const [targetField, setTargetField] = useState('');
  const handleEdit = (val, field) => {
    inputFields[field].display = "none";
      inputFields[field].open = false;
      const newField = {...inputFields};
      newField[field].value = val;
      setFields(newField);
      setTargetField(field);
  };

  const update = async() => {
    closeSnackbar();
    if(!inputFields[targetField].value){
      enqueueSnackbar(`Invalid ${targetField}`, {variant: "error"});
      return;
    }
    let res = await axios.put(`/update/fields/${targetField}/${inputFields[targetField].value}/${user.email}`);
    if(res.data.status){
      setUser(res.data);
      Cookies.set('user', JSON.stringify(res.data));
      enqueueSnackbar(`${targetField} has been updated`, {variant: "success"});
    }
  }

  return (
    !user ? null :
    <Box sx={{ flexGrow: 1 }} style={{paddindTop: "0px", marginTop: "0px"}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} style={{position: "relative", bottom: "50px", overflowY: "scroll", paddingTop: "50px", minHeight: "1000px", backgroundColor:"#ffff",width: "80%", maxWidth: "600px"}}>
        <div className={classes.p2}>
          {
              ["name", "password", "email"].map((field) => (
                <Box className={`${classes.br5} ${classes.centered} ${classes.mb3}`} style={{width: "80%", maxWidth: "400px"}}>
                  <List>
                    <ListItem>
                      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
                        <div style={{position: "relative", top: "2px"}}>
                          <Typography variant="overline" style={{padding:"5px", color: "black"}}>{field}:</Typography>
                        </div>
                        <div style={{padding:"5px"}}>
                          <Typography>{field === "password" ? '' : user[field]}</Typography>
                        </div>
                        <div>
                          <Button onClick={handleField}>Edit</Button>
                        </div>
                      </div>
                    </ListItem>
                    <ListItem>
                      <form className={inputOpen ? classes.show : classes.hide}>
                          <FormControl variant="standard">
                            <Input id="component-simple" onChange={e => {handleEdit(e.target.value, field)}} />
                          </FormControl>
                          <Button size="small" onClick={() => {resetField(); update();}}>Update</Button>
                      </form>
                    </ListItem>
                  </List>
                </Box>
              ))
          }
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          
        </Grid>
      </Grid>
    </Box>
  );
}
