import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Payment from './components/Payment'




function App() { //פונקציה ראשית - ריאקט ראוטר (מייצר עמודים שונים באתר)
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/contact" component={Contact} />
        <Route path="/payment" component={Payment} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>


  );
}

export default App;
