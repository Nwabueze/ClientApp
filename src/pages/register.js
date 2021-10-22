import { Alert, Button, ButtonGroup, Checkbox, Container, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { Link } from 'react-router-dom';
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import queryString from 'query-string';
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Register({...props}){
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [otp, setOTP] = useState('');
    const [display, setDisplay] = useState(true);
    const [initial, setInitial] = useState(true);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setInitial(false);
        setOpened(true);
        setOpen(false);
    };

    const params = queryString.parse(props.location.search);
    const {redirect} = params;
    const {handleSubmit, control, formState: {errors}} = useForm();
    const [userData, setUserData] = useState({});
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [phoneNumber, setPhoneNumber] = useState('');

    const interests = [
        "Football", "Basketball", "Ice Hockey", "Motorsports", "Bandy", "Rugby", "Skiing", "Shooting"
    ];
    const [userInterest, setuserInterest] = useState([]);
    const sendOTP = async () => {
      closeSnackbar();

      // Be sure OTP is digits only and has length of 4
      if(otp.replace(/\D+/g, '').length !== 4){
          enqueueSnackbar("Invalid OTP given", {variant: 'error'});
      }
     
      try {
        setDisplay(false);
        const {data} = await axios.post(`/api/verify/otp/${otp}`);
        if(data.status){
          setInitial(false);
          setOpen(false);
          enqueueSnackbar("Your phone has been verified", {variant: 'success'});
          props.history.push('/dashboard/profile');
        }else{
          setInitial(true);
          setDisplay(true);
        }
      }catch(err){
        setInitial(true);
        setDisplay(true);
        enqueueSnackbar(err.message, {variant: 'error'});
      }
    }

    const submit = async ({ name, email, phone, password, }) => {
        if(phone.replace(/\D+/g,'').length < 8){
            enqueueSnackbar("Invalid phone number", {variant: 'error'});
            return;
        }

        setPhoneNumber(phone);
        setLoading(true);
        try { 
            const {data} = await axios.post('/registry', 
            { email, phone, name, password, interests: userInterest.join(", ") });
            Cookies.set("user", JSON.stringify(data));
            setLoading(false);
            handleClickOpen();
            //props.location.push(redirect || '/');
        } catch(err) {
          enqueueSnackbar(err.message, {variant: 'error'});
          setLoading(false);
        }
    }

    const [nextDisplay, setNextDisplay] = useState("none");
    const [prevDisplay, setPrevDisplay] = useState("block");

    const handleChange = (event) => {
        const { target: { value }, } = event;
        setuserInterest(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const openNext = () => {
        closeSnackbar();
        if(!userInterest.length){
            setNextDisplay("none");
            enqueueSnackbar("Please select your interest", {variant: 'warning'});
            return;
        }
        setPrevDisplay("none");
        setNextDisplay("block");
        enqueueSnackbar("Step one completed", {variant: 'success'});
    }

    const goBack = () => {
        setNextDisplay("none");
        setPrevDisplay("block");
    }

    return (
      <Container>
        <div className={classes.form} style={{marginTop:"100px", display: prevDisplay}}>
          <Typography className={`${classes.mb3} ${classes.p2}`} variant="h5" color="secondary">Registeration step 1.</Typography>
          <Box className={`${classes.br5} ${classes.p2} ${classes.mb3}`}>
            <Alert severity="info">To get started, please select your interest from the field below</Alert>
            <Typography></Typography> 
          </Box>
          <FormControl className={classes.mt3} style={{width:"100%", marginBottom:"30px"}}>
            <InputLabel id="demo-multiple-checkbox-label">Interest?</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={userInterest}
              onChange={handleChange}
              input={<OutlinedInput label="Interests" />}
              renderValue={(selected) => selected.join(', ')}
            >
            {interests.map((item) => (
              <MenuItem key={item.replace(/\s+/g,'_')} value={item}>
                <Checkbox checked={userInterest.indexOf(item) > -1} />
                <ListItemText primary={item} />
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <Button className={classes.mt5} variant="contained" fullWidth onClick={openNext}>Next step</Button>
        </div>
        <form className={classes.form} onSubmit={handleSubmit(submit)} style={{display:nextDisplay}}>
          <List className={classes.pt5}>
            <ListItem>
            <Typography className={`${classes.mb3} ${classes.p2}`} variant="h5" color="secondary">Registeration step 2.</Typography>
            </ListItem>
            <ListItem>
              <Controller 
                name="email" 
                control={control} 
                defaultValue="" 
                rules={{required: true, pattern: /(\w+)@(\w+)\.(\w+)/,}} render={({field}) => (
                  <TextField 
                    variant="outlined" 
                    fullWidth id="email" 
                    label="email" 
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
              <Controller 
                name="phone" 
                control={control} 
                defaultValue="" 
                rules={{required: true, minLength: 7}} render={({field}) => (
                  <TextField 
                    variant="outlined" 
                    fullWidth id="phone" 
                    label="Phone" 
                    inputProps={{ type: "phone" }} 
                    error={Boolean(errors.phone)}
                    helperText={
                      errors.email ? 
                      (errors.email.type === 'minLength' ? 'Invalid phone number' : 'Phone number is empty') : ''
                    }
                    {...field}>
                  </TextField>
                )}>
              </Controller>
            </ListItem>
            <ListItem>
              <Controller 
                name="name" 
                control={control} 
                defaultValue="" 
                rules={{required: true, minLength: 2}} render={({field}) => (
                  <TextField 
                    variant="outlined" 
                    fullWidth id="name" 
                    label="Name" 
                    inputProps={{ type: "text" }} 
                    error={Boolean(errors.name)}
                    helperText={
                    errors.name ? 
                    (errors.name.type === 'minLength' ? 'Name is too short' : 'Name is empty') : ''
                    }
                    {...field}>
                  </TextField>
                )}>
              </Controller>
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
              {
                loading ?
                (
                  <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} 
                        variant="outlined"
                        fullWidth>
                          Submitting...
                      </LoadingButton>
                ) : (
                  <ButtonGroup className={classes.w100} disableElevation variant="contained">
                    <Button className={classes.w30} variant="text" onClick={goBack}><ChevronLeftIcon />Back</Button>
                    <Button className={classes.w70} variant="contained" type="submit">Register</Button>
                  </ButtonGroup>
                )
              }
            </ListItem>
            <ListItem>
              <Typography>
                Already have account? {' '} 
                <Link to={`/login?redirect=${redirect || '/'}`}>
                  &nbsp;Login&nbsp;&nbsp;
                </Link>
                {
                  opened ? 
                  <Button size="small" style={{textTransform: "none"}} onClick={() => setOpen(true)}>OTP?</Button>
                  : <Button size="small" style={{textTransform: "none"}} onClick={() => setOpen(true)}>OTP?</Button>
                }
              </Typography>
            </ListItem>
          </List>
        </form>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Phone verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the four digit code (OTP) sent to {phoneNumber}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="otp-field"
            label="Enter OTP"
            type="text"
            fullWidth
            variant="standard"
            maxLength="4"
            onChange={ e => setOTP(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {
            display ? <Button onClick={sendOTP}>Continue</Button> : 
            (initial ? <LoadingButton loading loadingPosition="start" startIcon={<SaveIcon />} 
            variant="outlined">
            Sending
          </LoadingButton> : <Alert className={classes.pt3} severity="success">Your phone has been validated</Alert>)
          }
        </DialogActions>
      </Dialog>
      </Container>)
}

