
import './App.css';
import Header from './components/Header'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Verifyemail from './components/Verifyemail'
import ResetPassword from './pages/reset-password'
import Home from './pages/home'
import { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';



function App({...props}) {

  const [location, setLocation] = useState(window.location.href);
  const [dash, setDash] = useState(false);
  useEffect(() => {
    console.log(`Location is now ${window.location.href}`);
    setLocation(window.location.href);
    const d = window.location.href.indexOf("dashboard") > -1 || window.location.href.indexOf("verify") > -1 ? true : false;
    setDash(d);
  },[location]);
  
  return (
    
    <SnackbarProvider anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
      <BrowserRouter>
      
      { dash ? '' : 
      <div className="App">
        <Header />
      </div>
      }
      <Switch>
        <Route path="/verify/:email" component={Verifyemail} />
        <Route path="/login" component={Login} />
        <Route path="/reset-password/:email" component={ResetPassword} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard/:focus" component={Dashboard} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
    </SnackbarProvider>
    
  );
}

export default App;
