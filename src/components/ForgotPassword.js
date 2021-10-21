import { Button, CircularProgress, Container, List, ListItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Link, } from 'react-router-dom';
import { useEffect, useState } from "react";
import useStyles from "../utils/styles";
import Cookies, { set } from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

export default function ForgotPassword({...props}){
    const [enqueueSnackbar, closeSnackbar] = useSnackbar();
    const classes = useStyles();
    const [userData, setUserData] = useState({});
    const [displayButton, setDisplay] = useState(true);
    const {handleSubmit, control, formState: {errors}} = useForm();
    const [defaultEmail, setDefaultEmail] = useState('');
    
    useEffect(()=>{
        setUserData(Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : {});
        setDefaultEmail(userData.email != "undefined" ? userData.email : '');
    },[]);

    
    const submit = async ({email, password}) => {
        setDisplay(false);
        try {
            const {data} = await axios.post('/api/users/login', { email, password });
            set("userData", JSON.stringify(data));
            props.history.push('/');
        } catch(err) {
            setDisplay(true);
            enqueueSnackbar(err.response.data ? err.response.data.message : err.message, { variant: 'error' });
        }
    }

    return (
      <Container>
        <form className={classes.form} onSubmit={handleSubmit(submit)}>
          <List className={classes.pt5}>
            <ListItem>
              <Typography variant="h5">Login</Typography>
            </ListItem>
            <ListItem>
              <Controller 
                name="email" 
                control={control} 
                defaultValue="" 
                rules={{required: true, pattern: /(\w+)@(\w+)\.(\w+)/}} render={({field}) => (
                  <TextField 
                    variant="outlined" 
                    fullWidth id="email" 
                    label="email" 
                    value={defaultEmail}
                    inputProps={{ type: "email" }} 
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email ? 
                      (errors.email.type === 'pattern' ? 'Invalid email' : 'Email is empty') : ''
                    }
                    {...field}>
                  </TextField>
                )}> 
              </Controller>   
            </ListItem>
            <ListItem>
            {
              !true ? <Button variant="contained" color="primary" fullWidth disabled>
                <CircularProgress />
              </Button>
              :
              <Button variant="contained" type="submit" color="primary" fullWidth>Submit</Button>
            }
            </ListItem>
            <ListItem>
              <Typography>
                Don't have account? {' '} 
                <Link to={`/register?redirect=/`}>
                  &nbsp;Register
                </Link>
                  OR
                <Link to={`/`}>
                  &nbsp;Home
                </Link>
              </Typography>
            </ListItem>
          </List>
        </form>
      </Container>
    )
}