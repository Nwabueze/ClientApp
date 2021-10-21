import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import FlareIcon from '@mui/icons-material/Flare';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import Alert from '@mui/material/Alert';
import Profile from '../components/Profile';
import SettingsTab from '../components/Settings';
import { Backdrop, BottomNavigation, BottomNavigationAction, CircularProgress, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import useStyles from '../utils/styles';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  let { focus } = props.match.params;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const [user, setUser] = useState(false);
  useEffect(()=>{
    if(Cookies.get('user')){
      setUser(JSON.parse(Cookies.get('user')));
    }else{
      props.history.push('/login');
    }
  },[]);

  const logout = async () => {
    /**
     * Session was implemented on the server,
     * At this level there's no special need for redux, 
     * so Redux isn't being used, although it's present
     */
    let res = await axios.get('/user/logout');
    if(res.data.status){
      Cookies.remove('user');
      props.history.push('/login');
    }
  }

  const dashtabs = {
    "profile": {
      title: "Profile",
      icon: (<AccountCircleIcon />),
      content: (
        <Profile />
      )
    },
    "buddies": {
      title: "Buddies",
      icon: (<PeopleIcon />),
      content: (
        <Box>
          <Typography>
            <Alert severity="success">Hello buddies, how are you doing?</Alert>
          </Typography>
        </Box>
      )
    },
    "discover": {
      title: "Discover",
      icon: (<FlareIcon />),
      content: (
        <Box>
          <Typography>
            <Alert severity="success">Hello, please preview this new item</Alert>
          </Typography>
        </Box>
      )
    },
    "settings": {
      title: "Settings",
      icon: (<SettingsIcon />),
      content: (
        <SettingsTab />
      )
    }
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
      {
        Object.keys(dashtabs).map(tab => (
          <ListItem key={tab} button onClick={() => {toggleTab(tab)}}>
            <ListItemIcon>
              {dashtabs[tab].icon}
            </ListItemIcon>
            <ListItemText primary={dashtabs[tab].title} />
          </ListItem>
        ))
      }
      <ListItem key='loguot' button onClick={logout}>
          <ListItemIcon>
            {<LockIcon />}
          </ListItemIcon>
          <ListItemText primary={'logout'} />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const [active_tab, setTab] = useState(focus);
  const classes = useStyles();

  const toggleTab = tab => {
    setTab(tab);
    props.history.push(`/dashboard/${tab}`);
  }

  return (
    !user ? 
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    :
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {/* The dashboard content will go here */}
        {
            Object.keys(dashtabs).map(tab => (
              <div key={tab} tabId={tab} className={tab === active_tab ? classes.show : classes.hide}>
                  {dashtabs[tab].content}
              </div>
            ))
        }
      </Box>
      <Paper  sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', sm: 'none' } }} elevation={3}>
        <BottomNavigation
          showLabels
        >
        {
          Object.keys(dashtabs).map(tab => (
            <BottomNavigationAction label={dashtabs[tab].title} icon={dashtabs[tab].icon} onClick={() => {toggleTab(tab)}}/>
          ))
        }
        <BottomNavigationAction label={'Logout'} icon={<LockIcon />} onClick={logout}/>
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default withRouter(ResponsiveDrawer);
