import { Alert, Button, Container, List, ListItem, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { withRouter, } from 'react-router-dom';
import { useEffect, useState } from "react";
import useStyles from "../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

function ResetPassword({...props}){
    const { email } = props.match.params;
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const classes = useStyles();
    const [display, setDisplay] = useState(true);
    const {handleSubmit, control, formState: {errors}} = useForm();
    const [initial, setInitial] = useState(true);
    
    useEffect(()=>{
        
    },[]);

    const submit = async ({password, password2}) => {
        closeSnackbar();

        if(password !== password2){
            enqueueSnackbar("Password did not match", {variant: "error"});
            return;
        }

        setDisplay(false);
        const res = await axios.put(`/update/fields/password/${password}/${email}`);
        if(res.data.status){
            setInitial(false);
            enqueueSnackbar("Password reset was successful", {variant: "success"});
        }else{
            enqueueSnackbar("Sorry, we couldn't reset password", {variant: "error"});
        }
    }

    return (
      <Container>
        <form className={classes.form} onSubmit={handleSubmit(submit)}>
          <List className={`${classes.pt5} ${classes.mt5}`}>
            <ListItem>
              <Typography variant="h5" color="secondary">Reset password</Typography>
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
              )}>
              </Controller>
            </ListItem>
            <ListItem>
              <Controller 
                name="password2" 
                control={control} 
                defaultValue="" 
                rules={{required: true, minLength: 6}} render={({field}) => (
                <TextField 
                variant="outlined" 
                fullWidth id="password2" 
                label="Confirm password" 
                inputProps={{ type: "password" }} 
                error={Boolean(errors.password2)}
                helperText={
                errors.password2 ? 
                (
                  errors.password2.type === 'minLength' ? 
                  'Expecting at least 6 characters' : 'Empty password'
                ) : ''
                }
                {...field}>
                </TextField>
              )}>
              </Controller>
            </ListItem>
            <ListItem>
            {
              !display ? (initial ? <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} 
              variant="outlined">
              Wait...
            </LoadingButton> : <Alert className={classes.pt3} severity="success">Password has been updated</Alert>)
              :
              <Button variant="contained" type="submit" color="primary" fullWidth>Submit</Button>
            }
            </ListItem>
          </List>
        </form>
      </Container>
    )
}

export default withRouter(ResetPassword);