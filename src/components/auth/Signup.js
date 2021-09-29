import React, { useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Message from "../../components/Message";

// TODO: posle prvog getUsernames() usernames ostaje [],
//		 tek nakon drugog ucitava useraname-ove [auser, buser, cuser].
// 		 zaobisao sam pozivanjem getUsernames() u useEffect(), ali treba naci bolje rjesenje.

export default function Signup() {
	const emailRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [usernames, setUsernames] = useState([]);

	const { signup, currentUser } = useAuth();

	const history = useHistory();

	const [message, setMessage] = useState({
		visible: false,
		color: "indigo",
		text: "Signup successful!",
	});

	useEffect(() => {
		getUsernames();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		console.log("Usao u useEffect cUs");
		if (currentUser) {
			addUser(usernameRef.current.value);
		}
	}, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

	async function getUsernames() {
		setUsernames([]);
		try {
			axios
				.get("http://localhost:3001/getusernames")
				.then((response) => {
					response.data.forEach((el) => {
						setUsernames((arr) => [...arr, el.username]);
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
		return usernames;
	}

	const addUser = (un) => {
		console.log("Ulazi u addUser");
		console.log("addUser uid: " + currentUser.uid);

		axios
			.post("http://localhost:3001/adduser", {
				uid: currentUser.uid,
				email: currentUser.email,
				username: un,
			})
			.then((response) => {
				console.log("Client: uspjesno dodavanje. Response:");
				console.log(response);
			})
			.finally(() => {
				history.push("/");
				// history.push("/edit");
			});
	};

	async function handleSubmit(e) {
		e.preventDefault();

		let mounted = true;

		getUsernames();

		if (usernames.includes(usernameRef.current.value)) {
			console.log("Username taken error ---");
			return setError("This username is already taken");
		}

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			console.log("Passwords error ---");
			return setError("Passwords don't match");
		}

		try {
			setError("");
			setLoading(true);
			console.log("await");
			await signup(emailRef.current.value, passwordRef.current.value)
				.then((response) => {
					if (mounted) {
						console.log(response);
					}
					// addUser(usernameRef.current.value);
				})
				.finally(() => {
					console.log("Fin");
				});
		} catch (err) {
			console.log(err);
			setError(err.message);
		}
		setLoading(false);

		return () => {
			mounted = false;
		};
	}
	return (
		<>
			<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
				<Message message={message} setMessage={setMessage} />
				<div className='max-w-md w-full space-y-8'>
					<div>
						<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
							Sign up!
						</h2>

						{error && (
							<div className='bg-red-100 rounded-md p-2 mt-6'>
								<p className='font-medium text-center text-sm text-red-600'>
									{error}
								</p>
							</div>
						)}
					</div>
					<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
						<input
							type='hidden'
							name='remember'
							defaultValue='true'
						/>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label
									htmlFor='email-address'
									className='sr-only'
								>
									Email address
								</label>
								<input
									ref={emailRef}
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2
									border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md
									focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Email address'
								/>
							</div>
							<div>
								<label
									htmlFor='email-address'
									className='sr-only'
								>
									Username
								</label>
								<input
									ref={usernameRef}
									type='text'
									required
									autoComplete='username'
									className='appearance-none rounded-none relative block w-full
									px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900
									focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Username'
								/>
							</div>
							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									ref={passwordRef}
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2
									border border-gray-300 placeholder-gray-500 text-gray-900
									focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Password'
								/>
							</div>
							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									ref={passwordConfirmRef}
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2
									border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md
									focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Confirm Password'
								/>
							</div>
						</div>

						<div className='divide-y-2'>
							<button
								disabled={loading}
								type='submit'
								className='mb-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
							>
								Sign up
							</button>

							<p className='pt-6 text-center text-sm text-gray-600'>
								Already have an account?{" "}
								<Link
									to='/login'
									className='font-medium text-indigo-600 hover:text-indigo-500'
								>
									Log in!
								</Link>
							</p>
						</div>
					</form>

					{/* <button
						onClick={getUsernames}
						disabled={loading}
						className='mb-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
					>
						Get Usernames
					</button>
					<button
						onClick={logCurrent}
						disabled={loading}
						className='mb-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
					>
						Get Current User
					</button> */}
				</div>
			</div>
		</>
	);
}
