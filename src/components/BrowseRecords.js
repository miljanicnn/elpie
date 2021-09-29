import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Browse from "./Browse";
import Navbar from "./Navbar";
import axios from "axios";
import Records from "./Records";
import Pagination from "./Pagination";
import CountriesList from "./CountriesList";
import GenresList from "./GenresList";
import Message from "./Message";

export default function BrowseRecords() {
	const { username, currentUser } = useAuth();
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [wishlist, setWishlist] = useState([]);
	const [collection, setCollection] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState([]);
	const [buttonLoading, setButtonLoading] = useState(true);

	const [message, setMessage] = useState({
		visible: false,
		color: "gray",
		text: "There's been an error. Please try again.",
	});

	const sortRef = useRef();
	const orderRef = useRef();
	const countryRef = useRef();
	const genreRef = useRef();

	const [sorting, setSorting] = useState({ sort: "", order: "desc" });

	useEffect(() => {
		let mounted = true;
		if (page !== 1) {
			setPage(1);
		} else {
			getResults(query, page);
		}
		return () => {
			mounted = false;
		};
	}, [sorting]);

	useEffect(() => {
		let mounted = true;
		if (currentUser) {
			updateWishlist();
			updateCollection();
		} else {
			console.log("No User yet");
		}
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		getResults(query, page);
		return () => {
			mounted = false;
		};
	}, [page]);

	useEffect(() => {
		let mounted = true;
		setPage(1);
		return () => {
			mounted = false;
		};
	}, [query]);

	const updateWishlist = () => {
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
				});
		} catch (err) {
			console.log("Update Wishlist ERROR:\n---\n" + err);
		}
	};

	const updateCollection = () => {
		try {
			axios
				.get("http://localhost:3001/getmycollection", {
					params: {
						uid: currentUser.uid,
					},
				})
				.then((response) => {
					setCollection([]);
					response.data.forEach((el) => {
						setCollection((arr) => [...arr, el.rid]);
					});
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
		setButtonLoading(true);
		handleAddRecord(res);
		axios
			.post("http://localhost:3001/addtowishlist", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				console.log("Response:");
				console.log(response);
			})
			.finally(() => {
				// history.push("/");
				setButtonLoading(false);
				updateWishlist();
				setMessage({
					...message,
					visible: true,
					color: "red",
					text: `You have added ${res.title} to your wishlist!`,
				});
				setTimeout(() => {
					setMessage({ ...message, visible: false });
				}, 5000);
			});
	};

	const handleDeleteFromWishlist = (res) => {
		setButtonLoading(true);
		// handleAddRecord(res);
		axios
			.post("http://localhost:3001/deletefromwishlist", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				updateWishlist();
				console.log("UPDATED WISHLIST");
				setButtonLoading(false);
			})
			.finally(() => {
				setMessage({
					...message,
					visible: true,
					color: "gray",
					text: `You have removed ${res.title} from your wishlist!`,
				});
				setTimeout(() => {
					setMessage({ ...message, visible: false });
				}, 5000);
			});
	};

	const handleAddToCollection = (res) => {
		if (wishlist.includes(res.id)) {
			handleDeleteFromWishlist(res);
		}
		setButtonLoading(true);
		handleAddRecord(res);
		axios
			.post("http://localhost:3001/addtocollection", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				updateCollection();
				setButtonLoading(false);
				setMessage({
					...message,
					visible: true,
					color: "indigo",
					text: `You have added ${res.title} to your collection!`,
				});
				setTimeout(() => {
					setMessage({ ...message, visible: false });
				}, 5000);
			});
	};

	const handleDeleteFromCollection = (res) => {
		setButtonLoading(true);
		// handleAddRecord(res);
		axios
			.post("http://localhost:3001/deletefromcollection", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				updateCollection();
				setButtonLoading(false);
			})
			.finally(() => {
				setMessage({
					...message,
					visible: true,
					color: "indigo",
					text: `You have removed ${res.title} from your collection!`,
				});
				setTimeout(() => {
					setMessage({ ...message, visible: false });
				}, 5000);
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
			.post("http://localhost:3001/addrecord", {
				id: res.id,
				title: res.title,
				cover: cover,
				year: res.year,
				country: res.country,
			})
			.then((response) => {
				console.log("Response:");
				console.log(response);
			});
	};

	const handleSortChange = () => {
		if (sortRef.current.value === "") {
			orderRef.current.value = "desc";
			setSorting({ sort: sortRef.current.value, order: "desc" });
		} else {
			setSorting({
				sort: sortRef.current.value,
				order: orderRef.current.value,
			});
		}
	};

	const getResults = (q, p) => {
		// console.log(wishlist);
		// e.preventDefault();
		// setSearchQuery(searchRef.current.value);
		let mounted = true;
		setQuery(q);
		setSearchResults([]);

		if (q !== "") {
			setLoading(true);
			try {
				axios
					.get(
						`https://api.discogs.com/database/search?q=${q}&key=QDOXZTcaZikNnaXinmje&secret=WmqZwuRljEgttuQLrKegggdRjwBzxYwk&type=master&format=Vinyl&per_page=12&page=${p}&sort=${sorting.sort}&sort_order=${sorting.order}&country=${countryRef.current.value}&genre=${genreRef.current.value}`
					)
					.then((response) => {
						if (mounted) {
							// console.log(response);
							const tempArray = [];
							// setSearchResults(response.data.results);
							// console.log(response.data.results);
							response.data.results.map((el) => {
								tempArray.push({
									id: el.id,
									title: el.title,
									cover: el.cover_image,
									year: el.year,
									country: el.country,
								});
							});
							setPagination(response.data.pagination.items);
							setSearchResults(tempArray);

							setLoading(false);
						}
					});
			} catch (err) {
				console.log("err: " + err);
			}
		}
		// console.log("Query: " + q);

		return () => {
			mounted = false;
		};
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-50 '>
			<Message message={message} setMessage={setMessage} />
			<Navbar />

			<header className='flex-grow-0 border-b border-indigo-100 bg-white'>
				<div className='max-w-7xl mx-auto  p-6'>
					<h1 className='text-3xl font-bold text-gray-800'>
						Browse records
					</h1>
				</div>
			</header>
			<main className='flex flex-grow'>
				<div className='flex flex-col md:flex-row w-full max-w-7xl  mx-auto '>
					{/* Kontejner za left */}
					<div className='flex flex-col flex-grow-0 bg-gradient-to-b md:bg-gradient-to-l from-white to-gray-50 w-full md:w-1/3 md:border-r border-b border-indigo-100 items-center md:items-end md:py-6 '>
						<div className='md:sticky md:top-6 w-full'>
							<div className='pt-6 px-6 mb-12 flex flex-col w-full text-center items-center md:items-end'>
								<Browse
									setQuery={setQuery}
									passQuery={(query) =>
										getResults(query, page)
									}
									// getResults={(query) => getResults(query, page)}
									placeholder='Browse records...'
								/>
								<div className='w-full pt-6'>
									<label
										htmlFor='order'
										className='block text-sm font-medium text-gray-700'
									>
										Country
									</label>
									<select
										id='country'
										name='country'
										autoComplete='country'
										ref={countryRef}
										className='mt-1 mb-6 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<CountriesList />
									</select>

									<label
										htmlFor='order'
										className='block text-sm font-medium text-gray-700'
									>
										Genre
									</label>
									<select
										id='genre'
										name='genre'
										autoComplete='genre'
										ref={genreRef}
										className='mt-1 mb-6 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<GenresList />
									</select>
									<div className='flex gap-3 pt-6 border-t border-gray-200'>
										<button
											className='mb-6 group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
											onClick={() => {
												if (page !== 1) {
													setPage(1);
												} else {
													getResults(query, page);
												}
											}}
										>
											Apply filters
										</button>
										<button
											className='mb-6 group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
											onClick={() => {
												countryRef.current.value = "";
												genreRef.current.value = "";
												sortRef.current.value = "";
												// orderRef.current.value = "desc";
												setSorting({
													sort: "",
													order: "desc",
												});
											}}
										>
											Clear all
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Kontejner za rajt */}
					<div className='flex flex-col bg-white-100 md:w-2/3  w-full py-6 px-6 lg:px-8'>
						<div className='flex w-full pb-6'>
							<div className='w-1/2 md:w-40'>
								<label
									htmlFor='order'
									className='block text-sm font-medium text-gray-700'
								>
									Sort by
								</label>
								<select
									id='sort'
									name='sort'
									autoComplete='sort'
									ref={sortRef}
									onChange={() => handleSortChange()}
									disabled={searchResults.length === 0}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								>
									<option value=''>Relevance</option>
									<option value='year'>Year</option>
									<option value='title'>Title</option>
								</select>
							</div>

							<div className='w-1/2 md:w-40 ml-6'>
								<label
									htmlFor='order'
									className='block text-sm font-medium text-gray-700'
								>
									Order
								</label>
								<select
									id='order'
									name='order'
									autoComplete='order'
									ref={orderRef}
									onChange={() => {
										handleSortChange();
										// setSorting({
										// 	sort: sortRef.current.value,
										// 	order: orderRef.current.value,
										// })
									}}
									disabled={
										searchResults.length === 0 ||
										sortRef.current.value === ""
									}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								>
									<option value='desc'>Descending</option>
									<option value='asc'>Ascending</option>
								</select>
							</div>
						</div>
						{/* <Browse
							passQuery={(query) => getResults(query, page)}
							// getResults={(query) => getResults(query, page)}
							placeholder='Browse records...'
						/> */}
						{/* Replace with your content */}
						{/* <Records searchResults={searchResults} /> */}
						<Records
							searchResults={searchResults}
							loading={loading}
							buttonLoading={buttonLoading}
							collection={collection}
							wishlist={wishlist}
							handleDeleteFromCollection={(res) =>
								handleDeleteFromCollection(res)
							}
							handleAddToCollection={(res) =>
								handleAddToCollection(res)
							}
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
								page={page}
								totalResults={pagination}
								decreasePage={() => setPage(page - 1)}
								increasePage={() => setPage(page + 1)}
								searchResLength={searchResults.length}
							/>
						)}

						{/* <div className='flex items-center justify-center px-4 py-6 sm:px-0'>
						{loading ? (
							<p>LOADING</p>
						) : (
							<div className='grid grid-cols-1 grid-flow-row w-full gap-6 rounded-lg  sm:grid-cols-2 sm:auto-rows-max md:grid-cols-3 lg:grid-cols-4'>
								{searchResults.length === 0 ? (
									<div className='col-span-full w-full'>
										<p className='text-gray-100 text-lg text-center'>
											No results
										</p>
									</div>
								) : (
									searchResults.map((res) => (
										<div
											key={res.id}
											className='flex flex-col flex-grow bg-white rounded-3xl p-6 hover:shadow-xl'
										>
											<div className='flex flex-grow-0 rounded-md relative object-contain w-full overflow-hidden pb-1/1'>
												<img
													className='absolute bottom-0 h-full w-full object-cover'
													src={res.cover}
												/>
											</div>
											<div className='flex flex-grow flex-col  py-4 '>
												<p className='text-sm text-gray-400 pb-2  tracking-wider font-mono truncate'>
													{res.id} / {res.year} /{" "}
													{res.country}
												</p>
												<p className='text-base font-semibold text-gray-900'>
													{res.title}
												</p>
											</div>
											<div className='flex flex-row flex-grow-0 flex-auto justify-between space-x-6 w-full'>
												{collection.includes(res.id) ? (
													<div
														className='flex flex-auto rounded-full bg-none h-10 justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white'
														onClick={() => {
															handleDeleteFromCollection(
																res
															);
														}}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='self-center h-5 w-5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
																clipRule='evenodd'
															/>
														</svg>
													</div>
												) : (
													<div
														className='flex flex-auto rounded-full bg-gray-100 h-10 justify-center text-gray-900 hover:bg-indigo-500 hover:text-white'
														onClick={() =>
															handleAddToCollection(
																res
															)
														}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-6 w-6 self-center'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
															/>
														</svg>
													</div>
												)}

												{wishlist.includes(res.id) ? (
													<div
														className='flex flex-auto rounded-full bg-none h-10 justify-center text-red-500 hover:bg-red-500 hover:text-white'
														onClick={() =>
															handleDeleteFromWishlist(
																res
															)
														}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='self-center h-5 w-5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
																clipRule='evenodd'
															/>
														</svg>
													</div>
												) : (
													<div
														className='flex flex-auto rounded-full bg-gray-100 h-10 justify-center text-gray-900 hover:bg-red-500 hover:text-white'
														onClick={() =>
															handleAddToWishlist(
																res
															)
														}
													>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='self-center h-6 w-6 '
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
															/>
														</svg>
													</div>
												)}
											</div>
										</div>
									))
								)}
							</div>
						)}
					</div> */}

						{/* /End replace */}
					</div>
				</div>
			</main>
		</div>
	);
}
