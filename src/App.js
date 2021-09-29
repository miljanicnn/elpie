import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import BrowseRecords from "./components/BrowseRecords";
import Collection from "./components/Collection";
import Wishlist from "./components/Wishlist";
import UserProfile from "./components/UserProfile";
import Social from "./components/Social";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Switch>
					<Route path='/signup' component={Signup} />
					<Route path='/login' component={Login} />
					<PrivateRoute path='/browse' component={BrowseRecords} />
					<PrivateRoute path='/collection' component={Collection} />
					<PrivateRoute path='/wishlist' component={Wishlist} />
					<PrivateRoute path='/social' component={Social} />
					<PrivateRoute
						strict
						path='/u/:username'
						component={UserProfile}
					/>
					<PrivateRoute exact path='/' component={Home} />
					<Route path='/' render={() => <div>404</div>} />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
