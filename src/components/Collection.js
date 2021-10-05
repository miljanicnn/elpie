import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Browse from "./Browse";
import Navbar from "./Navbar";
import axios from "axios";
import Records from "./Records";
import Pagination from "./Pagination";
import Message from "./Message";

export default function Collection() {
	const { username, currentUser } = useAuth();
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [collection, setCollection] = useState([]);
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
			searchCollection("");
			updateCollection();
			setTotalResults(collection.length);
		} else {
			console.log("no user yet..");
		}
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;

		if (!loading) {
			searchCollection(query, page);
		}
		return () => {
			mounted = false;
		};
	}, [page]);

	useEffect(() => {
		let mounted = true;

		setPage(1);
		getResultCount(query);
		return () => {
			mounted = false;
		};
	}, [query]);

	const updateCollection = () => {
		setLoading(true);
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
					searchCollection(query);
					getResultCount(query);
					setLoading(false);
				});
		} catch (err) {
			console.log("Update Collection ERROR:\n---\n" + err);
		}
	};

	const handleAddToCollection = (res) => {
		console.log("Handle Add To Collection:");
		handleAddRecord(res);
		axios
			.post("https://elpie-server.herokuapp.com/addtocollection", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				console.log("Response:");
				console.log(response);
			})
			.finally(() => {
				updateCollection();
			});
	};

	const handleDeleteFromCollection = (res) => {
		console.log("Handle Delete From Collection:");
		axios
			.post("https://elpie-server.herokuapp.com/deletefromcollection", {
				uid: currentUser.uid,
				rid: res.id,
			})
			.then((response) => {
				console.log("Response:");
				console.log(response);
			})
			.finally(() => {
				updateCollection();
			});
	};

	const handleAddRecord = (res) => {
		console.log("Add " + res.id);

		axios
			.post("https://elpie-server.herokuapp.com/addrecord", {
				id: res.id,
				title: res.title,
				cover: res.cover,
				year: res.year,
				country: res.country,
			})
			.then((response) => {
				console.log("Response:");
				console.log(response);
			})
			.finally(() => {});
	};

	const getResultCount = (q) => {
		let mounted = true;
		setLoading(true);

		try {
			axios
				.get(
					"https://elpie-server.herokuapp.com/getcollectionquerycount",
					{
						params: {
							uid: currentUser.uid,
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

	const searchCollection = (q, p) => {
		let mounted = true;
		setLoading(true);
		setQuery(q);
		setSearchResults([]);

		try {
			axios
				.get("https://elpie-server.herokuapp.com/searchmycollection", {
					params: {
						uid: currentUser.uid,
						query: q,
						page: page,
					},
				})
				.then((response) => {
					if (mounted) {
						const tempArray = [];
						response.data.map((el) => {
							tempArray.push({
								id: el.id,
								title: el.title,
								cover: el.cover,
								year: el.year,
								country: el.country,
							});
						});
						setSearchResults(tempArray);
						setLoading(false);
					}
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
								Your collection
							</div>
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
									{collection.length}
								</span>
							</div>
						</div>
					</div>
					<div className='flex flex-col flex-shrink flex-grow w-full md:w-2/3 py-6 px-6 gap-y-6 lg:px-8'>
						<Browse
							passQuery={(query) => searchCollection(query)}
							placeholder='Browse your collection...'
						/>
						<Records
							current={"c"}
							searchResults={searchResults}
							loading={loading}
							collection={collection}
							handleDeleteFromCollection={(res) =>
								handleDeleteFromCollection(res)
							}
							handleAddToCollection={(res) =>
								handleAddToCollection(res)
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
