
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import { CircularProgress, Container, Paper } from "@mui/material";
import { useEffect, useState, forwardRef } from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
function Verifyemail({...props}){
    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };
    const { email } = props.match.params;
    const [status, setStatus] = useState(true);
    const [initial, setInitial] = useState(true);
    useEffect(() => {
        (async() => {
            let res = await axios.post(`/api/verify/email/${email}`);
            if(res.data.status){
                setStatus(true);
                setInitial(false);
            }
        })();
    },[email]);

    return (
      <Container>
        {
          initial ? <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
        <DialogTitle>{"Verifying your email address"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            {
              status ? 
                `Congratulations! Your email address ${email} has been veryfied.`
                : <CircularProgress />
              }   
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          {
            status ? (
              <div>
                <Button onClick={()=>props.history.push('/')}>Home</Button>
                <Button onClick={()=>props.history.push('/login')}>Login</Button>
              </div>
            ) :
              ''
          } 
          </DialogActions>
        </Dialog>
        :
        <Paper>
          <Alert severity="success">Congratulations! your email address has been verified</Alert>
          <Button style={{margin:"25px"}} onClick={()=>props.history.push('/')}>Go to home page</Button>
        </Paper>
        }
    </Container>
    )
}

export default withRouter(Verifyemail);