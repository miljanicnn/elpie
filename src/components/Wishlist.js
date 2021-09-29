import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Browse from "./Browse";
import Navbar from "./Navbar";
import axios from "axios";
import Records from "./Records";
import Pagination from "./Pagination";
import Message from "./Message";

export default function Wishlist() {
	const { currentUser } = useAuth();
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [wishlist, setWishlist] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [totalResults, setTotalResults] = useState([]);

	const [message, setMessage] = useState({
		visible: false,
		color: "",
		text: "",
	});

	useEffect(() => {
		let mounted = true;
		if (currentUser) {
			searchWishlist("");
			updateWishlist();
			setTotalResults(wishlist.length);
		} else {
			console.log("No User yet");
		}
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (!loading) {
			searchWishlist(query, page);
		}
	}, [page]);

	useEffect(() => {
		setPage(1);
		getResultCount(query);
	}, [query]);

	const updateWishlist = () => {
		setLoading(true);
		try {
			axios
				.get("http://localhost:3001/getmywishlist", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					setWishlist([]);
					response.data.forEach((el) => {
						setWishlist((arr) => [...arr, el.rid]);
					});
					searchWishlist(query);
					getResultCount(query);
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const handleAddToWishlist = (res) => {
		handleAddRecord(res);
		axios
			.post("http://localhost:3001/addtowishlist", {
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
			.post("http://localhost:3001/deletefromwishlist", {
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
		axios
			.post("http://localhost:3001/addrecord", {
				id: res.id,
				title: res.title,
				cover: res.cover,
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

	const getResultCount = (q) => {
		let mounted = true;
		setLoading(true);

		try {
			axios
				.get("http://localhost:3001/getwishlistquerycount", {
					params: {
						uid: currentUser.uid,
						query: q,
					},
				})
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
		setLoading(true);
		setQuery(q);
		setSearchResults([]);
		const tempArray = [];

		try {
			axios
				.get("http://localhost:3001/searchmywishlist", {
					params: {
						uid: currentUser.uid,
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
					setLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}
		return () => {
			mounted = false;
		};
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-50 '>
			<Message message={message} setMessage={setMessage} />
			<Navbar />

			<main className='flex flex-grow'>
				<div className='flex flex-col md:flex-row w-full  max-w-7xl  mx-auto '>
					<div className='flex flex-col flex-grow-0 flex-shrink-0 bg-gradient-to-t md:bg-gradient-to-l from-white to-gray-50 w-full md:w-1/3 md:border-r border-b border-indigo-100 items-center md:items-end md:py-6 '>
						<div className='flex flex-col md:sticky md:top-6 w-full p-6 items-center md:items-end'>
							<div className='text-xl font-bold text-gray-800'>
								Your wishlist
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
									{wishlist.length}
								</span>
							</div>
						</div>
					</div>
					<div className='flex flex-col flex-shrink flex-grow w-full md:w-2/3 py-6 px-6 gap-y-6 lg:px-8'>
						<Browse
							passQuery={(query) => searchWishlist(query)}
							placeholder='Browse your wishlist...'
						/>
						<Records
							current={"w"}
							searchResults={searchResults}
							loading={loading}
							wishlist={wishlist}
							handleDeleteFromWishlist={(res) =>
								handleDeleteFromWishlist(res)
							}
							handleAddToWishlist={(res) =>
								handleAddToWishlist(res)
							}
						/>
						{searchResults.length === 0 ? (
							""
						) : (
							<Pagination
								totalResults={totalResults}
								page={page}
								decreasePage={() => setPage(page - 1)}
								increasePage={() => setPage(page + 1)}
								searchResLength={searchResults.length}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
