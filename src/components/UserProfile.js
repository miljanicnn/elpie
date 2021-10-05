import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	useParams,
	useHistory,
	NavLink,
	useLocation,
} from "react-router-dom";
import Navbar from "./Navbar";
import UserRecords from "./UserRecords";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import UserReviews from "./UserReviews";
import UserListModal from "./UserListModal";
import Message from "./Message";

export default function UserProfile() {
	const { currentUser } = useAuth();
	const [user, setUser] = useState([]);
	const { username } = useParams();
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [revLoading, setRevLoading] = useState(false);
	const [wishlist, setWishlist] = useState([]);
	const [collection, setCollection] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [userCollection, setUserCollection] = useState([]);
	const [userWishlist, setUserWishlist] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [totalResults, setTotalResults] = useState([]);
	const [following, setFollowing] = useState([]);
	const [followedBy, setFollowedBy] = useState([]);
	const [followingOpen, setFollowingOpen] = useState(false);
	const [followersOpen, setFollowersOpen] = useState(false);
	const history = useHistory();
	const [message, setMessage] = useState({
		visible: false,
		color: "",
		text: "",
	});

	useEffect(() => {
		let mounted = true;
		getUser();

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (user.uid) {
			getReviews();
			updateUserWishlist();
			updateUserCollection();
			updateWishlist();
			updateCollection();
			updateFollowings();
		}
	}, [user]);

	const getUser = () => {
		if (loading === false) {
			setLoading(true);
		}
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getuser", {
					params: {
						username: username,
					},
				})
				.then((response) => {
					if (response.data.length > 0) {
						setUser({
							uid: response.data[0].uid,
							email: response.data[0].email,
							username: username,
						});
					} else {
						history.push("/social");
					}
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const updateFollowings = () => {
		setLoading(true);
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getfollowings", {
					params: {
						uid: user.uid,
					},
				})
				.then((response) => {
					setFollowing([]);
					setFollowedBy([]);
					response.data.forEach((el) => {
						if (el.follows !== user.uid) {
							setFollowing((arr) => [...arr, el]);
						} else if (el.uid !== user.uid) {
							setFollowedBy((arr) => [...arr, el]);
						}
					});
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	useEffect(() => {
		if (loading === false) {
			searchWishlist(query, page);
		}
	}, [page]);

	useEffect(() => {
		if (loading === false) {
			setPage(1);
			getResultCount(query);
		}
	}, [query]);

	const updateWishlist = () => {
		if (loading === false) {
			setLoading(true);
		}
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getmywishlist", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					setWishlist([]);
					response.data.forEach((el) => {
						setWishlist((arr) => [...arr, el.rid]);
					});
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const updateCollection = () => {
		if (loading === false) {
			setLoading(true);
		}
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getmycollection", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					setCollection([]);
					response.data.forEach((el) => {
						setCollection((arr) => [...arr, el.rid]);
					});
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const updateUserWishlist = () => {
		if (loading === false) {
			setLoading(true);
		}
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getmywishlist", {
					params: {
						uid: user.uid,
					},
				})
				.then((response) => {
					setUserWishlist([]);
					response.data.forEach((el) => {
						setUserWishlist((arr) => [...arr, el.rid]);
					});
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
			setLoading(false);
		}
	};

	const updateUserCollection = () => {
		if (loading === false) {
			setLoading(true);
		}
		try {
			axios
				.get("https://elpie-server.herokuapp.com/getmycollection", {
					params: {
						uid: user.uid,
					},
				})
				.then((response) => {
					setUserCollection([]);
					response.data.forEach((el) => {
						setUserCollection((arr) => [...arr, el.rid]);
					});
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Collection ERROR:\n---\n" + err);
		}
	};

	const handleAddToWishlist = (res) => {
		if (collection.includes(res.id)) {
			setMessage({
				...message,
				visible: true,
				color: "indigo",
				text: `${res.title} is already in your collection!`,
			});
			setTimeout(() => {
				setMessage({ ...message, visible: false });
			}, 5000);
			return;
		}
		handleAddRecord(res);
		axios
			.post("https://elpie-server.herokuapp.com/addtowishlist", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				// console.log("Response:");
				// console.log(response);
			})
			.finally(() => {
				updateWishlist();
			});
	};

	const handleDeleteFromWishlist = (res) => {
		axios
			.post("https://elpie-server.herokuapp.com/deletefromwishlist", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				// console.log("Response:");
				// console.log(response);
			})
			.finally(() => {
				updateWishlist();
			});
	};

	const handleAddRecord = (res) => {
		let cover = "";
		if (res.cover) {
			cover = res.cover;
		} else {
			cover = res.images[0].uri;
		}

		axios
			.post("https://elpie-server.herokuapp.com/addrecord", {
				id: res.id,
				title: res.title,
				cover: cover,
				year: res.year,
				country: res.country,
			})
			.then((response) => {
				// console.log("Response:");
				// console.log(response);
			})
			.finally(() => {
				//
			});
	};

	const handleFollow = (user) => {
		setLoading(true);
		try {
			axios
				.post("https://elpie-server.herokuapp.com/follow", {
					uid: currentUser.uid,
					follows: user.uid,
				})
				.then((response) => {
					// console.log("Response:");
					// console.log(response);
				})
				.finally(() => {
					updateFollowings();
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
		try {
			axios
				.post("https://elpie-server.herokuapp.com/unfollow", {
					uid: currentUser.uid,
					follows: user.uid,
				})
				.then((response) => {
					// console.log("Response:");
					// console.log(response);
				})
				.finally(() => {
					updateFollowings();
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

	const getResultCount = (q) => {
		let mounted = true;
		if (loading === false) {
			setLoading(true);
		}

		try {
			axios
				.get(
					"https://elpie-server.herokuapp.com/getwishlistquerycount",
					{
						params: {
							uid: user.uid,
							query: q,
						},
					}
				)
				.then((response) => {
					setTotalResults(response.data[0].count);
					setLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}

		return () => {
			mounted = false;
		};
	};

	const searchWishlist = (q, p) => {
		let mounted = true;
		if (loading === false) {
			setLoading(true);
		}
		setQuery(q);
		setSearchResults([]);
		const tempArray = [];

		try {
			axios
				.get("https://elpie-server.herokuapp.com/searchmywishlist", {
					params: {
						uid: user.uid,
						query: q,
						page: page,
					},
				})
				.then((response) => {
					if (mounted) {
						response.data.map((el) => {
							tempArray.push({
								id: el.id,
								title: el.title,
								cover: el.cover,
								year: el.year,
								country: el.country,
							});
						});
					}
				})
				.then(() => {
					setSearchResults(tempArray);
				})
				.then(() => {
					setLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}
		return () => {
			mounted = false;
		};
	};

	const searchCollection = (q, p) => {
		let mounted = true;
		if (loading === false) {
			setLoading(true);
		}
		setQuery(q);
		setSearchResults([]);
		const tempArray = [];

		try {
			axios
				.get("https://elpie-server.herokuapp.com/searchmycollection", {
					params: {
						uid: user.uid,
						query: q,
						page: page,
					},
				})
				.then((response) => {
					// console.log(response);
					if (mounted) {
						// console.log(response);
						response.data.map((el) => {
							tempArray.push({
								id: el.id,
								title: el.title,
								cover: el.cover,
								year: el.year,
								country: el.country,
							});
						});
					}
				})
				.then(() => {
					// console.log(tempArray);
					setSearchResults(tempArray);
					setLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}
		return () => {
			mounted = false;
		};
	};

	const getReviews = () => {
		let mounted = true;
		setRevLoading(true);

		try {
			axios
				.get("https://elpie-server.herokuapp.com/getreviews", {
					params: {
						uid: user.uid,
					},
				})
				.then((response) => {
					setReviews([]);
					response.data.forEach((el) => {
						setReviews((arr) => [...arr, el]);
					});
					// console.log(response.data);
					setRevLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}

		return () => {
			mounted = false;
		};
	};

	const subnav = [
		{ name: "Reviews", path: "", color: "gray", count: reviews.length },
		{
			name: "Collection",
			path: "collection",
			color: "indigo",
			count: userCollection.length,
		},
		{
			name: "Wishlist",
			path: "wishlist",
			color: "red",
			count: userWishlist.length,
		},
	];

	return (
		<div className='flex flex-col min-h-screen'>
			<Message message={message} setMessage={setMessage} />
			<Navbar />
			<UserListModal
				list={following}
				open={followingOpen}
				setOpen={setFollowingOpen}
				title={"Following"}
			/>
			<UserListModal
				list={followedBy}
				open={followersOpen}
				setOpen={setFollowersOpen}
				title={"Followers"}
			/>

			<Router>
				<main className='flex flex-grow bg-gray-50'>
					<div className='flex flex-col md:flex-row w-full  max-w-7xl  mx-auto '>
						{/* Asaksghajg */}
						<div className='flex flex-col flex-grow-0 flex-shrink-0 bg-gradient-to-t md:bg-gradient-to-l from-white to-gray-50 w-full md:w-1/3 md:border-r border-b border-indigo-100 items-center md:items-end md:py-6 '>
							<div className='md:sticky md:top-6 w-full'>
								<div className='pt-6 md:pr-6 mb-0 md:mb-12 flex flex-col w-full items-center md:items-end'>
									{loading ? (
										<div className='w-full h-7 bg-gray-100 animate-pulse '></div>
									) : (
										<div className='font-semibold text-xl text-right text-gray-800'>
											<span className='font-bold'>
												{user && user.username}
											</span>
										</div>
									)}

									{following.findIndex(
										(el) => el.follows === currentUser.uid
									) === -1 ? (
										""
									) : (
										<p className='text-sm font-mono text-gray-300'>
											Follows you
										</p>
									)}

									<p
										hidden
										className='text-sm font-mono text-gray-300'
									>
										{user && user.uid}
									</p>
									<div className='flex gap-3 w-full md:justify-end justify-center'>
										<div className='bg-indigo-500 mt-6 h-12 rounded-full text-indigo-50 px-6 text-center w-24 justify-center flex items-center gap-2'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-4 w-4'
												viewBox='0 0 20 20'
												fill='currentColor'
											>
												<path
													fillRule='evenodd'
													d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-base font-semibold'>
												{userCollection.length}
											</span>
										</div>
										<div className='bg-red-500 mt-6 h-12 rounded-full  text-red-50 px-6 text-center w-24 justify-center flex items-center gap-2'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-4 w-4'
												viewBox='0 0 20 20'
												fill='currentColor'
											>
												<path
													fillRule='evenodd'
													d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
													clipRule='evenodd'
												/>
											</svg>
											<span className='text-base font-semibold'>
												{userWishlist.length}
											</span>
										</div>
									</div>
									<div className='flex w-full text-right rounded-md mt-6 gap-x-6 justify-center md:justify-end'>
										<div
											onClick={() => {
												setFollowingOpen(true);
											}}
											className='hover:underline cursor-pointer'
										>
											<span className='font-bold'>
												{following.length}
											</span>{" "}
											Following
										</div>
										<div
											onClick={() => {
												setFollowersOpen(true);
											}}
											className='hover:underline cursor-pointer'
										>
											<span className='font-bold'>
												{followedBy.length}
											</span>{" "}
											Followers
										</div>
									</div>

									{user.uid === currentUser.uid ? (
										""
									) : followedBy.findIndex(
											(el) => el.uid === currentUser.uid
									  ) === -1 ? (
										<button
											disabled={loading}
											onClick={() => handleFollow(user)}
											className='flex justify-center mt-6 w-36 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
										>
											Follow
										</button>
									) : (
										<button
											disabled={loading}
											onClick={() => handleUnfollow(user)}
											className='flex justify-center mt-6 w-36 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-gray-100 hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
										>
											Unfollow
										</button>
									)}
									<div className='w-full text-right rounded-md mt-6'></div>
								</div>
								<div
									className='flex justify-start min-w-full overflow-x-auto items-between 
							md:flex-col md:pr-0 '
								>
									{subnav.map((nav) => (
										<NavLink
											exact
											to={`/u/${user.username}/${nav.path}`}
											key={nav.name}
											className={`flex justify-end gap-x-3 items-center px-6 py-6 flex-grow font-bold text-center text-gray-400 hover:text-gray-600 md:text-right`}
											activeClassName={`border-b-8 border-${nav.color}-600 text-${nav.color}-600 bg-gradient-to-t hover:text-${nav.color}-600 from-${nav.color}-50 to-transparent md:border-b-0 md:border-r-8 md:px-4 md:bg-gradient-to-l md:w-full`}
										>
											{nav.name}{" "}
											<div
												className={`px-2 py-1 w-8 text-center text-xs rounded-full bg-white`}
											>
												{nav.count}
											</div>
										</NavLink>
									))}
								</div>
							</div>
						</div>
						<div className='flex flex-col bg-white-100  w-full py-6 px-6 lg:px-8 gap-6'>
							<Route exact path={`/u/${user.username}`}>
								<UserReviews
									user={user}
									reviews={reviews}
									loading={revLoading}
									currentUser={currentUser}
									getReviews={getReviews}
								/>
							</Route>
							<Route path={`/u/${user.username}/collection`}>
								<UserRecords
									user={user}
									current={"w"}
									show={"c"}
									wishlist={wishlist}
									collection={collection}
									userWishlist={userWishlist}
									userCollection={userCollection}
									updateUserCollection={updateUserCollection}
									updateUserWishlist={updateUserWishlist}
									handleDeleteFromWishlist={(res) =>
										handleDeleteFromWishlist(res)
									}
									handleAddToWishlist={(res) =>
										handleAddToWishlist(res)
									}
								/>
							</Route>
							<Route path={`/u/${user.username}/wishlist`}>
								<UserRecords
									user={user}
									current={"w"}
									show={"w"}
									wishlist={wishlist}
									collection={collection}
									userWishlist={userWishlist}
									userCollection={userCollection}
									updateUserCollection={updateUserCollection}
									updateUserWishlist={updateUserWishlist}
									handleDeleteFromWishlist={(res) =>
										handleDeleteFromWishlist(res)
									}
									handleAddToWishlist={(res) =>
										handleAddToWishlist(res)
									}
								/>
							</Route>
						</div>
					</div>
				</main>
			</Router>
		</div>
	);
}
