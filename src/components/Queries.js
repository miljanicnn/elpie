import { useState } from "react";
import axios from "axios";

export function add(a, b) {
	return a + b;
}
export function getUsers() {
	console.log(">>> getUsernames()");
	let users = [];
	try {
		axios
			.get("http://localhost:3001/getusernames")
			.then((response) => {
				console.log(response.data);
				response.data.forEach((el) => {
					users.push((arr) => [...arr, el]);
				});
				// response.data.map((el) => {

				// });
			})
			.then(() => {
				// console.log(usernames);
				// console.log(currentUser);
			});
	} catch (err) {
		console.log("err: " + err);
	}
	return users;
}
