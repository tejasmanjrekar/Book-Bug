import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Auth from "./components/Auth";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashBoard";
import HomePage from "./components/Dashboard/HomePage";
import SellerDashboard from "./components/Dashboard/SellerDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/SignUp" component={SignUp} />
          <Route exact path="/SignIn" component={SignIn} />
          <Auth
            Role="Admin"
            path="/AdminDashboard"
            component={AdminDashboard}
          />
          <Auth
            Role="Customer"
            path="/UserDashboard"
            component={UserDashboard}
          />
          <Auth
            Role="Seller"
            path="/SellerDashboard"
            component={SellerDashboard}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
