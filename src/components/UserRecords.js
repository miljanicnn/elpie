import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import axios from "axios";
import Browse from "./Browse";
import Pagination from "./Pagination";

export default function UserRecords(props) {
	// console.log(props.current);
	const [open, setOpen] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState("");
	const [loading, setLoading] = useState(false);
	const [infoLoading, setInfoLoading] = useState(true);
	const [imgLoading, setImgLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [totalResults, setTotalResults] = useState([]);

	useEffect(() => {
		let mounted = true;
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (props.show === "w") {
			searchWishlist(query, page);
		} else if (props.show === "c") {
			searchCollection(query, page);
		}
	}, [page]);

	useEffect(() => {
		if (page === 1) {
			if (props.show === "w") {
				searchWishlist(query, page);
			} else if (props.show === "c") {
				searchCollection(query, page);
			}
		} else {
			setPage(1);
		}
	}, [query]);

	const searchWishlist = (q, p) => {
		let mounted = true;
		if (loading === false) {
			setLoading(true);
		}
		const tempArray = [];
		setSearchResults([]);
		getResultCount(q);

		try {
			axios
				.get("http://localhost:3001/searchmywishlist", {
					params: {
						uid: props.user.uid,
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

		getResultCount(q);

		try {
			axios
				.get("http://localhost:3001/searchmycollection", {
					params: {
						uid: props.user.uid,
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

	const getResultCount = (q) => {
		let mounted = true;
		setLoading(true);

		try {
			axios
				.get(
					props.show === "c"
						? "http://localhost:3001/getcollectionquerycount"
						: "http://localhost:3001/getwishlistquerycount",
					{
						params: {
							uid: props.user.uid,
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

	const handleClickDetails = (res) => {
		setOpen(true);
		setInfoLoading(true);
		setSelectedRecord(null);

		axios
			.get(
				`https://api.discogs.com/masters/${res.id}?&key=QDOXZTcaZikNnaXinmje&secret=WmqZwuRljEgttuQLrKegggdRjwBzxYwk`
			)
			.then((response) => {
				setSelectedRecord(response.data);
				console.log(response.data);
				setInfoLoading(false);
			});
	};
	return (
		<>
			<div className='w-full'>
				<Browse
					passQuery={(query) => {
						// props.show === "w"
						// 	? setQ(query)
						// 	: searchCollection(query);
						setQuery(query);
					}}
					// getResults={(query) => getResults(query, page)}
					placeholder={`Browse ${props.user.username} ${
						props.show === "w" ? "wishlist" : "collection"
					}...`}
				/>
			</div>
			<div className='flex flex-col items-center justify-between flex-grow sm:px-0'>
				{searchResults.length === 0 ? (
					<div className='flex col-span-full justify-center items-center w-full h-64'>
						<p className='text-center font-semibold text-gray-500'>
							Nothing to see here...
						</p>
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 grid-flow-row w-full gap-6 rounded-lg  sm:grid-cols-2 sm:auto-rows-max md:grid-cols-3 lg:grid-cols-4'>
							{searchResults.map((res) => (
								<div
									key={res.id}
									className='flex flex-col flex-grow bg-white rounded-3xl p-6 hover:shadow-xl'
								>
									<div className='flex flex-grow-0 rounded-md relative object-contain overflow-hidden w-full pb-1/1 hover:cursor-pointer'>
										<img
											className='absolute bottom-0 h-full w-full object-cover'
											src={res.cover}
											onClick={() => {
												setImgLoading(true);
												handleClickDetails(res);
											}}
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
										{props.current === "w" ? (
											""
										) : props.collection.includes(
												res.id
										  ) ? (
											<div
												className='flex flex-auto rounded-full bg-none h-10 justify-center border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white'
												onClick={() => {
													props.handleDeleteFromCollection(
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
												</svg>{" "}
											</div>
										) : (
											<div
												className='flex flex-auto rounded-full bg-gray-100 h-10 justify-center text-gray-900 hover:bg-indigo-500 hover:text-white'
												onClick={() =>
													props.handleAddToCollection(
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

										{props.current === "c" ? (
											""
										) : props.wishlist.includes(res.id) ? (
											<div
												className='flex flex-auto rounded-full bg-none h-10 justify-center border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
												onClick={() =>
													props.handleDeleteFromWishlist(
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
													props.handleAddToWishlist(
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
							))}
						</div>
					</>
				)}

				{searchResults.length === 0 ? (
					""
				) : (
					<div className='w-full mt-6'>
						<Pagination
							page={page}
							totalResults={totalResults}
							decreasePage={() => setPage(page - 1)}
							increasePage={() => setPage(page + 1)}
							searchResLength={searchResults.length}
						/>
					</div>
				)}

				{/* DIALOG WITH RECORD DETAILS */}
				<Transition.Root show={open} as={Fragment}>
					<Dialog
						as='div'
						static
						className='fixed inset-0 overflow-hidden'
						open={open}
						onClose={setOpen}
						// onClose={setImgLoading}
					>
						<div className='absolute inset-0 overflow-hidden'>
							<Transition.Child
								as={Fragment}
								enter='ease-in-out duration-500'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in-out duration-500'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<Dialog.Overlay className='absolute inset-0 bg-indigo-500 bg-opacity-75 transition-opacity' />
							</Transition.Child>
							<div className='fixed inset-y-0 right-0 pl-10 max-w-full flex'>
								<Transition.Child
									as={Fragment}
									enter='transform transition ease-in-out duration-500 sm:duration-700'
									enterFrom='translate-x-full'
									enterTo='translate-x-0'
									leave='transform transition ease-in-out duration-500 sm:duration-700'
									leaveFrom='translate-x-0'
									leaveTo='translate-x-full'
								>
									<div className='relative w-screen max-w-2xl'>
										<Transition.Child
											as={Fragment}
											enter='ease-in-out duration-500'
											enterFrom='opacity-0'
											enterTo='opacity-100'
											leave='ease-in-out duration-500'
											leaveFrom='opacity-100'
											leaveTo='opacity-0'
										>
											<div className='absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4'>
												<button
													className='rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
													onClick={() => {
														//setImgLoading(true);
														setOpen(false);
													}}
												>
													<span className='sr-only'>
														Close panel
													</span>
													<XIcon
														className='h-6 w-6'
														aria-hidden='true'
													/>
												</button>
											</div>
										</Transition.Child>
										<div className='h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll'>
											{
												//
											}
											<div className='flex flex-grow-0 px-4  sm:px-6'>
												<div className='flex flex-col sm:flex-row w-full '>
													<div>
														<div className='flex flex-grow-0 rounded-md relative object-contain w-full sm:w-48 sm:h-48 overflow-hidden pb-1/1 '>
															{
																<img
																	className={
																		infoLoading ===
																			true ||
																		imgLoading ===
																			true
																			? "block absolute animate-pulse bottom-0 bg-indigo-400 h-full w-full object-cover"
																			: "absolute bottom-0 h-full w-full object-cover"
																	}
																	src={
																		selectedRecord &&
																		selectedRecord
																			.images[0]
																			.uri
																	}
																	onLoad={() => {
																		setImgLoading(
																			false
																		);
																	}}
																/>
															}
														</div>
													</div>

													<div className='mt-6 sm:p-6 sm:mt-0 w-full flex-grow'>
														<div className='text-lg font-medium text-gray-900'>
															{infoLoading ? (
																<div className='block animate-pulse h-4 w-24 bg-gray-200 mb-4' />
															) : (
																selectedRecord &&
																selectedRecord.artists
																	.map(
																		(
																			el
																		) => (
																			<span
																				key={
																					el.id
																				}
																			>
																				{
																					el.name
																				}
																			</span>
																		)
																	)
																	.reduce(
																		(
																			prev,
																			curr
																		) => [
																			prev,
																			", ",
																			curr,
																		]
																	)
															)}
														</div>
														<div className='text-3xl mt-1 font-bold'>
															{infoLoading ? (
																<div className='animate-pulse block h-10 w-48 bg-gray-300' />
															) : (
																selectedRecord &&
																selectedRecord.title
															)}
														</div>
														<div>
															{infoLoading ? (
																<div className='block animate-pulse h-4 w-12 bg-gray-200 my-4' />
															) : (
																<div className='my-2 text-gray-400 tracking-wider font-mono'>
																	{selectedRecord &&
																		selectedRecord.year}
																</div>
															)}
														</div>
														<div className=''>
															{infoLoading ? (
																<div className='inline'>
																	<div className='inline-block animate-pulse h-4 w-8 bg-indigo-200 mb-4 mr-2' />
																	<div className='inline-block animate-pulse h-4 w-12 bg-indigo-200 mb-4' />
																</div>
															) : (
																selectedRecord &&
																selectedRecord.genres.map(
																	(el) => (
																		<span
																			key={selectedRecord.genres.indexOf(
																				el
																			)}
																			className='px-2 mr-1 inline-flex text-xs tracking-wider leading-5 font-semibold rounded-sm bg-indigo-100 text-indigo-600'
																		>
																			{el.toUpperCase()}
																		</span>
																	)
																)
															)}
														</div>
													</div>
												</div>
											</div>
											<div className='mt-6 relative flex-1 flex-grow px-4 sm:px-6'>
												{/* Replace with your content */}
												<div className='inset-0'>
													<div
														className='h-full  max-w-full'
														aria-hidden='true'
													>
														<table className='min-w-full divide-y divide-indigo-200 table-fixed'>
															<thead className='bg-indigo-50'>
																<tr>
																	<th
																		scope='col'
																		className='px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider'
																	>
																		Title
																	</th>
																	<th
																		scope='col'
																		className='px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider'
																	>
																		Duration
																	</th>
																</tr>
															</thead>
															<tbody className='bg-white divide-y divide-indigo-200'>
																{infoLoading
																	? [
																			28,
																			16,
																			24,
																	  ].map(
																			(
																				el
																			) => (
																				<tr
																					key={
																						el
																					}
																				>
																					<td className='px-6 py-4 whitespace-pre-wrap'>
																						<div
																							className={`block h-3 w-${el} bg-gray-300`}
																						/>
																					</td>
																					<td className='px-6 py-4 w-6 whitespace-pre-wrap'>
																						<div className='block h-3 w-8 bg-gray-200 float-right' />
																					</td>
																				</tr>
																			)
																	  )
																	: selectedRecord &&
																	  selectedRecord.tracklist.map(
																			(
																				track
																			) => (
																				<tr
																					key={selectedRecord.tracklist.indexOf(
																						track
																					)}
																				>
																					<td className='px-6 py-4 whitespace-pre-wrap'>
																						{track.type_ ===
																						"track" ? (
																							<div className='text-sm font-semibold text-gray-900'>
																								{
																									track.title
																								}
																							</div>
																						) : (
																							<div className='text-xs font-medium uppercase tracking-wider text-indigo-500'>
																								{
																									">>> "
																								}
																								{
																									track.title
																								}
																							</div>
																						)}
																					</td>
																					<td className='px-6 py-4 w-6 whitespace-pre-wrap'>
																						<div className='text-sm text-right font-mono text-gray-900'>
																							{track.duration ===
																							""
																								? "—"
																								: track.duration}
																						</div>
																					</td>
																				</tr>
																			)
																	  )}
															</tbody>
														</table>
													</div>
													{/* <div className='mt-6 bg-indigo-200'>
													
												</div> */}
												</div>
												{/* OVDJE SU DUGMICI */}
												{selectedRecord && (
													<div className='flex flex-row flex-grow-0 flex-auto justify-between mt-6 space-x-6 w-full'>
														{props.current ===
														"w" ? (
															""
														) : props.collection.includes(
																selectedRecord.id
														  ) ? (
															<div
																className='flex flex-auto rounded-full bg-none h-10 justify-center border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white'
																onClick={() => {
																	{
																		props.handleDeleteFromCollection(
																			selectedRecord
																		);
																	}
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
																</svg>{" "}
															</div>
														) : (
															<div
																className='flex flex-auto rounded-full bg-gray-100 h-10 justify-center text-gray-900 hover:bg-indigo-500 hover:text-white'
																onClick={() => {
																	props.handleAddToCollection(
																		selectedRecord
																	);
																}}
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
																		strokeWidth={
																			2
																		}
																		d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
																	/>
																</svg>
															</div>
														)}

														{props.current ===
														"c" ? (
															""
														) : props.wishlist.includes(
																selectedRecord.id
														  ) ? (
															<div
																className='flex flex-auto rounded-full bg-none h-10 justify-center border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
																onClick={() =>
																	props.handleDeleteFromWishlist(
																		selectedRecord
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
																	props.handleAddToWishlist(
																		selectedRecord
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
																		strokeWidth={
																			2
																		}
																		d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
																	/>
																</svg>
															</div>
														)}
													</div>
												)}

												{/* /End replace */}
											</div>
										</div>
									</div>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			</div>
		</>
	);
}
