import { Alert, Button, Container, List, ListItem, TextField, Typography } from "@mui/material";
//import Button from '@mui/material/Button';
//import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from "axios";
import { Link, } from 'react-router-dom';
import { useEffect, useState } from "react";
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import queryString from 'query-string';
import { useSnackbar } from "notistack";


export default function Login({...props}){
    const classes = useStyles();
    const params = queryString.parse(props.location.search);
    const {redirect} = params;
    const [userData, setUserData] = useState({});
    const {handleSubmit, control, formState: {errors}} = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [emailAddress, setEmailAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmail = emailAddress => {
        const isEmail = emailAddress.match(/@(\w+)\.(\w+)/) !== null;

        if(isEmail){
            setEmailAddress(emailAddress);
        }else{
            setEmailAddress("");
        }
    }

    const [open, setOpen] = useState(false);
    const [display, setDisplay] = useState(true);
    const [initial, setInitial] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDisplay(true);
    };

    const forgotPassword = async () => {
        closeSnackbar();
        if(!emailAddress){
            enqueueSnackbar("Please enter valid email address", {variant: 'error'});
        }
        
        setDisplay(false);
        const res = await axios.post(`/reset/email`, { email: emailAddress });
        if(res.data.status){
            setInitial(false);
            setOpen(false);
            enqueueSnackbar("A password reset link has been sent to your email address", {variant: 'success'});
        }else{
            setDisplay(true);
            enqueueSnackbar("Reset link could not be sent", {variant: 'success'});
        }
    }

    const submit = async ({email, password}) => {
        if(!email){
            enqueueSnackbar(`Invalid email or phone ${email}`, {variant: "error"});
            return;
        }

        // Start the spinner
        setLoading(true);
        try {
            const {data} = await axios.get(`/login/${email}/${password}`);
            setLoading(false);
            if(data.hasOwnProperty("_doc") || data.hasOwnProperty("email")){
                enqueueSnackbar("Login was successful", {variant: "success"});
                Cookies.set("user", JSON.stringify(data._doc));
                props.history.push('/dashboard/profile');
            }else{
                if(data.hasOwnProperty("reason")){
                    enqueueSnackbar(data.reason, {variant: "error"});
                }
            }
        } catch(err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    }

    return (
        <Container>
            <form className={classes.form} onSubmit={handleSubmit(submit)}>
                <List className={`${classes.pt5} ${classes.mt5}`}>
                    <ListItem>
                        <Typography variant="h5" color="secondary">Login</Typography>
                    </ListItem>
                    <ListItem>
                        <Controller 
                            name="email" 
                            control={control} 
                            defaultValue="" 
                            rules={{required: true, minLength: 10}} render={({field}) => (
                            <TextField 
                                variant="outlined" 
                                fullWidth id="email" 
                                label="Email or Phone" 
                                
                                inputProps={{ type: "text" }} 
                                error={Boolean(errors.email)}
                                helperText={
                                    errors.email ? 
                                    (errors.email.type === 'minLength' ? 'Invalid email or phone' : 'Email or phone is empty') : ''
                                }
                                {...field}>
                            </TextField>
                        )}></Controller>
                        
                    </ListItem>
                    <ListItem>
                    <Controller 
                            name="password" 
                            control={control} 
                            defaultValue="" 
                            rules={{required: true, minLength: 6}} render={({field}) => (
                            <TextField 
                                variant="outlined" 
                                fullWidth id="password" 
                                label="Password" 
                                inputProps={{ type: "password" }} 
                                error={Boolean(errors.password)}
                                helperText={
                                    errors.password ? 
                                    (
                                        errors.password.type === 'minLength' ? 
                                        'Expecting at least 6 characters' : 'Empty password'
                                    ) : ''
                                }
                                {...field}>
                            </TextField>
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                    {
                      loading ? (<LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} 
                        variant="outlined" style={{textTransform: "none"}}
                        fullWidth>
                          Submitting...
                      </LoadingButton>) : 
                      (<Button variant="contained" type="submit" color="primary" fullWidth>Login</Button>)
                    }
                    </ListItem>
                    <ListItem>
                      <Typography>
                        New here? {' '} 
                        <Link style={{textDecoration: "none"}} to={`/register?redirect=${redirect || '/'}`}>
                             &nbsp;Register
                        </Link>{' '}
                      </Typography>
                      <Typography color="secondary" onClick={handleClickOpen}>&nbsp;|&nbsp;<Button style={{textTransform: "none"}}>Forgot password?</Button></Typography>
                    </ListItem>
                </List>
            </form>
            <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address for your account. We
            will send you link to update your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email-field"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={ e => handleEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {
            display ? <Button onClick={forgotPassword}>Continue</Button> : 
            (initial ? <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} 
            variant="outlined">
            Sending
          </LoadingButton> : <Alert className={classes.pt3} severity="success">Reset link sent successfully</Alert>)
          }
        </DialogActions>
      </Dialog>
    </Container>
    )
    
}