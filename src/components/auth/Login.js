import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Message from "../../components/Message";

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();

	const history = useHistory();

	const [message, setMessage] = useState({
		visible: false,
		color: "gray",
		text: "Login unsuccessful!",
	});

	async function handleSubmit(e) {
		e.preventDefault();

		let mounted = true;

		try {
			await login(emailRef.current.value, passwordRef.current.value).then(
				(response) => {
					if (mounted) {
						console.log(response.user.email);
					}
				}
			);
			history.push("/");
		} catch (err) {
			console.log(err);
			if (err.code === "auth/user-not-found") {
				setError("Wrong email");
			} else if (err.code === "auth/wrong-password") {
				setError("Wrong password");
			} else {
				setError("Login failed :(");
			}
		}

		// setLoading(false);
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
							Log in!
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
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Email address'
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
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Password'
								/>
							</div>
						</div>

						<div className='divide-y-2'>
							<button
								disabled={loading}
								type='submit'
								className='mb-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
							>
								Log in
							</button>
							<p className='pt-6 text-center text-sm text-gray-600'>
								Don't an account?{" "}
								<Link
									to='/signup'
									className='font-medium text-indigo-600 hover:text-indigo-500'
								>
									Sign up!
								</Link>
							</p>
						</div>
						{/* <div className='flex items-center justify-between'>
							<div className='text-sm'>
								<Link
									to='/'
									className='font-medium text-indigo-600 hover:text-indigo-500'
								>
									Forgot your password?
								</Link>
							</div>
						</div> */}
					</form>
				</div>
			</div>
		</>
	);
}
