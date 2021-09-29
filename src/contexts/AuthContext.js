import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState();

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}
	function logout() {
		return auth.signOut();
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (currentUser !== null) {
			getUsername();
		} else {
			setTimeout(() => {
				getUsername();
			}, 2000);
		}
	}, [currentUser]);

	const getUsername = () => {
		try {
			axios
				.get("http://localhost:3001/getusername", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					console.log(response);
					if (response.data.length > 0) {
						setUsername(response.data[0].username);
						setLoading(false);
					} else {
						console.log("ovdje bi bila greska");
					}
				});
		} catch (err) {
			console.log("err: " + err);
		}

		return () => {
			console.log("ya");
		};
	};

	const value = {
		currentUser,
		username,
		signup,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
