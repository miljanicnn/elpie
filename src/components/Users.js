// import React, { useState, useEffect } from "react";
// import {
// 	BrowserRouter as Router,
// 	Route,
// 	useParams,
// 	useHistory,
// } from "react-router-dom";
// import axios from "axios";

// export default function Users(props) {
// 	const [users, setUsers] = useState([]);
// 	const [page, setPage] = useState(1);
// 	const [loading, setLoading] = useState(false);
// 	const { who } = useParams();
// 	const history = useHistory();

// 	useEffect(() => {
// 		let mounted = true;
// 		console.log(who);
// 		if (who !== "following" && who !== "followers") {
// 			// who = "following";
// 			history.push(`/u/${props.username}/social/following`);
// 		}

// 		return () => {
// 			mounted = false;
// 		};
// 	}, []);

// 	useEffect(() => {
// 		getUsers();
// 		console.log(page + "page");
// 	}, [page]);

// 	const getUsers = () => {
// 		try {
// 			setLoading(true);
// 			console.log("getUsers --->");
// 			axios
// 				.get(
// 					`https://randomuser.me/api/?page=${page}&results=10&seed=nikola&nat=gb`
// 				)
// 				.then((response) => {
// 					console.log(response);
// 					const newUsers = response.data.results;
// 					setUsers((prev) => [...prev, ...newUsers]);
// 					setLoading(false);
// 				});
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// 	return (
// 		<div className='flex flex-col mx-auto'>
// 			<Route path={`/u/${props.username}/social/:who`}>It's {who}</Route>
// 		</div>
// 	);
// }
