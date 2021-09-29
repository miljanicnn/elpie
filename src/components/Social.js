import React, { useState, useEffect } from "react";
import { Route, Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Navbar from "./Navbar";
import Browse from "./Browse";
import Message from "./Message";

export default function Social() {
	const { username, currentUser } = useAuth();
	const [users, setUsers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [followedBy, setFollowedBy] = useState([]);
	const [loading, setLoading] = useState(false);

	const [message, setMessage] = useState({
		visible: false,
		color: "gray",
		text: "There's been an error. Please try again.",
	});

	useEffect(() => {
		if (currentUser) {
			// setUsers([]);
			updateFollowings();
			searchUsers("");
		}
	}, []);

	const updateFollowings = () => {
		setLoading(true);
		try {
			axios
				.get("http://localhost:3001/getfollowings", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					setFollowing([]);
					setFollowedBy([]);
					// console.log(response.data);
					response.data.forEach((el) => {
						if (el.follows !== currentUser.uid) {
							setFollowing((arr) => [...arr, el.follows]);
						} else if (el.uid !== currentUser.uid) {
							setFollowedBy((arr) => [...arr, el.uid]);
						}
					});

					// searchWishlist(query);
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const handleFollow = (user) => {
		setLoading(true);
		try {
			axios
				.post("http://localhost:3001/follow", {
					uid: currentUser.uid,
					follows: user.uid,
				})
				.then((response) => {
					console.log("Response:");
					console.log(response);
				})
				.finally(() => {
					updateFollowings();
					setMessage({
						...message,
						visible: true,
						color: "indigo",
						text: `You are now following ${user.username}`,
					});
					setTimeout(() => {
						setMessage({ ...message, visible: false });
					}, 5000);
				});
		} catch (err) {
			console.log(err);
			setMessage({
				...message,
				visible: true,
				color: "red",
				text: `An error has occured. Please try again later.`,
			});
		}
		setLoading(false);
	};

	const handleUnfollow = (user) => {
		setLoading(true);
		console.log("Unfollow");
		try {
			axios
				.post("http://localhost:3001/unfollow", {
					uid: currentUser.uid,
					follows: user.uid,
				})
				.then((response) => {
					console.log("Response:");
					console.log(response);
				})
				.finally(() => {
					updateFollowings();
					setMessage({
						...message,
						visible: true,
						color: "gray",
						text: `You are no longer following ${user.username}`,
					});
					setTimeout(() => {
						setMessage({ ...message, visible: false });
					}, 5000);
				});
		} catch (err) {
			console.log(err);
			setMessage({
				...message,
				visible: true,
				color: "red",
				text: `An error has occured. Please try again later.`,
			});
		}
		setLoading(false);
	};

	const searchUsers = (q) => {
		let mounted = true;
		//setQuery(q);
		setUsers([]);
		if (q !== "") {
			setLoading(true);
			try {
				axios
					.get("http://localhost:3001/searchusers", {
						params: {
							query: q,
						},
					})
					.then((response) => {
						console.log(response);
						response.data.forEach((el) => {
							setUsers((arr) => [...arr, el]);
						});
						setLoading(false);
					});
			} catch (err) {
				console.log("err: " + err);
			}
		}

		return () => {
			mounted = false;
		};
	};

	const handleClick = () => {
		setMessage({ ...message, visible: true });
	};

	const subnav = [
		{ name: "Following", path: "following", color: "gray" },
		{ name: "Followers", path: "followers", color: "gray" },
	];

	return (
		<div className='flex flex-col min-h-screen w-full bg-gray-50'>
			<Message message={message} setMessage={setMessage} />
			<Navbar />

			<main className='flex flex-grow'>
				<div className='flex flex-col md:flex-row w-full  max-w-7xl  mx-auto '>
					<div className='flex flex-col flex-grow-0 flex-shrink-0 bg-gradient-to-t md:bg-gradient-to-l from-white to-gray-50 w-full md:w-1/3 md:border-r border-b border-indigo-100 items-center md:items-end md:py-6 '>
						<div className='flex flex-col md:sticky md:top-6 w-full p-6 items-center md:items-end'>
							<div className='text-xl font-bold text-gray-800'>
								Find some friends!
							</div>
							<div className='pt-6 mb-12 flex flex-col w-full text-center items-center md:items-end'>
								<Browse
									passQuery={(query) => searchUsers(query)}
									placeholder='Search users...'
								/>
							</div>
							<div
								className='flex justify-start min-w-full overflow-x-auto items-between gap-x-6
							md:flex-col md:pr-0 '
							></div>
						</div>
					</div>

					<div className='flex flex-col flex-shrink flex-grow w-full md:w-2/3 py-12 px-6 gap-y-6 lg:px-8'>
						<div className='flex items-start justify-center flex-grow px-4 pb-6 sm:px-0'>
							{loading ? (
								<div className='flex col-span-full justify-center items-center w-full h-64'>
									<div className='block w-4 h-4 rounded-full bg-indigo-600 animate-bounce font-semibold' />
								</div>
							) : (
								<div className='grid grid-cols-1 grid-flow-row w-full gap-6 rounded-lg  sm:grid-cols-2 sm:auto-rows-max'>
									{users.length === 0 ? (
										<div className='flex col-span-full justify-center items-center w-full h-64'>
											<p className='text-center font-semibold text-gray-500'>
												Nothing to see here...
											</p>
										</div>
									) : (
										users.map((user) => (
											<div
												key={user.uid}
												className='flex flex-row flex-grow bg-white justify-between items-center rounded-3xl p-6  hover:shadow-xl'
											>
												<Link
													to={{
														pathname:
															"/u/" +
															user.username,
														state: {
															user: user,
														},
													}}
													className='flex items-center'
												>
													<div className='h-10 w-10 bg-white rounded-full relative object-contain overflow-hidden'>
														<img
															src={`https://avatars.dicebear.com/api/bottts/${user.username}.svg`}
														/>
													</div>

													<div className='ml-4 flex-col'>
														<div className='text-sm font-medium leading-3 text-gray-900'>
															{user.username}
														</div>
														{followedBy.includes(
															user.uid
														) && (
															<span className='text-xs leading-3 text-gray-500'>
																Follows you
															</span>
														)}
													</div>
												</Link>
												{user.uid ===
												currentUser.uid ? (
													""
												) : following.includes(
														user.uid
												  ) ? (
													<button
														disabled={loading}
														onClick={() =>
															handleUnfollow(user)
														}
														className='flex justify-center w-24 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-gray-100 hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
													>
														Unfollow
													</button>
												) : (
													<button
														disabled={loading}
														onClick={() =>
															handleFollow(user)
														}
														className='flex justify-center w-24 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
													>
														Follow
													</button>
												)}
											</div>
										))
									)}{" "}
								</div>
							)}

							{/* 
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									></th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									></th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{users.length > 0
									? users.map(
											(user) =>
												user.uid !==
													currentUser.uid && (
													<tr key={user.uid}>
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='flex items-center'>
																<div className='h-10 w-10 bg-white rounded-full relative object-contain overflow-hidden'>
																	<img
																		src={`https://avatars.dicebear.com/api/bottts/${user.username}.svg`}
																	/>
																</div>
																<div className='ml-4'>
																	<div className='text-sm font-medium text-gray-900'>
																		<Link
																			to={{
																				pathname:
																					"/u/" +
																					user.username,
																				state: {
																					user: user,
																				},
																			}}
																		>
																			{
																				user.username
																			}
																		</Link>{" "}
																		{followedBy.includes(
																			user.uid
																		) && (
																			<span className='ml-4 text-xs  text-gray-500'>
																				{" "}
																				Follows
																				you
																			</span>
																		)}
																	</div>
																</div>
															</div>
														</td>

														<td className='px-6 py-4 whitespace-nowrap float-right text-sm font-medium'>
															{following.includes(
																user.uid
															) ? (
																<button
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleUnfollow(
																			user
																		)
																	}
																	className='flex justify-center w-24 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-gray-100 hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
																>
																	Unfollow
																</button>
															) : (
																<button
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleFollow(
																			user
																		)
																	}
																	className='flex justify-center w-24 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
																>
																	Follow
																</button>
															)}
														</td>
													</tr>
												)
									  )
									: "Nothing here"}
							</tbody>
						</table>
					 */}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
