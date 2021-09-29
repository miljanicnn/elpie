import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import RatingsList from "./RatingsList";
import RecordsList from "./RecordsList";
import Message from "./Message";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function Home() {
	const { username, currentUser } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [loadMoreButtonDisabled, setLoadMoreButtonDisabled] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const [error, setError] = useState("");
	const [rating, setRating] = useState(5);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedReview, setSelectedReview] = useState({});

	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [selected, setSelected] = useState({
		title: "Oops",
		cover: "img.jpg",
	});
	const [message, setMessage] = useState({
		visible: false,
		color: "",
		text: "",
	});
	const reviewRef = useRef();
	const ratingRef = useRef();

	useEffect(() => {
		let mounted = true;
		if (currentUser) {
			getTimelineReviews();
			getUsers();
			setSelected(searchResults[0]);
			window.addEventListener("resize", resize);
		}
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		if (windowSize.width > 768) {
			setPanelOpen(true);
		} else {
			setPanelOpen(false);
		}
		return () => {
			mounted = false;
		};
	}, [windowSize]);

	const resize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	useEffect(() => {
		if (page > 0) {
			getTimelineReviews();
		}
	}, [page]);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const getTimelineReviews = () => {
		let mounted = true;
		setLoading(true);

		try {
			axios
				.get("http://localhost:3001/gettimelinereviews", {
					params: {
						uid: currentUser.uid,
						offset: page * 5,
					},
				})
				.then((response) => {
					const newReviews = response.data;
					if (newReviews.length < 5) {
						setLoadMoreButtonDisabled(true);
					}
					setReviews((prev) => [...prev, ...newReviews]);
					setLoading(false);
				});
		} catch (err) {
			console.log("ERROR:\n" + err);
		}

		return () => {
			mounted = false;
		};
	};

	async function getUsers() {
		setLoading(true);
		setUsers([]);
		try {
			axios
				.get("http://localhost:3001/getusernames")
				.then((response) => {
					response.data.forEach((el) => {
						setUsers((arr) => [...arr, el]);
					});
					setLoading(false);
				})
				.then(() => {});
		} catch (err) {
			console.log("err: " + err);
		}
		return users;
	}

	const submitReview = () => {
		setError("");
		if (reviewRef.current.value.length < 10) {
			setError("Review must be at least 10 characters long");
			return;
		}
		if (selected === undefined) {
			setError("Please select a record");
			return;
		}
		setLoading(true);
		try {
			axios
				.post("http://localhost:3001/addreview", {
					uid: currentUser.uid,
					rid: selected.id,
					body: reviewRef.current.value,
					rating: rating,
				})
				.then((response) => {
					// console.log("Response:");
					// console.log(response);
					if (response.status === 200) {
						setReviews([]);
						getTimelineReviews();
						setRating(5);
						reviewRef.current.value = "";
						setMessage({
							color: "indigo",
							visible: "true",
							text: "You have successfully submitted your review!",
						});
						setTimeout(() => {
							setMessage({ ...message, visible: false });
						}, 5000);
					} else {
						setMessage({
							color: "gray",
							visible: "true",
							text: "There's been an error. Please try again.",
						});
					}
				});
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	const deleteReview = () => {
		setLoading(true);
		try {
			axios
				.post("http://localhost:3001/deletereview", {
					id: selectedReview.id,
				})
				.then((response) => {
					// console.log("Response:");
					// console.log(response);
					if (response.status === 200) {
						setReviews([]);
						getTimelineReviews();
						setIsOpen(false);
						setSelectedReview({});
						setMessage({
							color: "red",
							visible: "true",
							text: "You have successfully deleted your review.",
						});
						setTimeout(() => {
							setMessage({ ...message, visible: false });
						}, 5000);
					} else {
						setMessage({
							color: "gray",
							visible: "true",
							text: "There's been an error. Please try again.",
						});
					}
				});
		} catch (err) {
			console.log(err);
			setMessage({
				color: "gray",
				visible: "true",
				text: "There's been an error. Please try again.",
			});
		}
		setLoading(false);
	};

	const parseTimestamp = (timestamp) => {
		let date = new Date(Date.parse(timestamp));

		return (
			date.toLocaleTimeString().split(":")[0] +
			":" +
			date.toLocaleTimeString().split(":")[1] +
			" " +
			date.toLocaleTimeString().split(" ")[1] +
			" · " +
			date.toLocaleDateString()
		);
	};

	const starCount = (rating) => {
		let stars = [];

		for (var n = 0; n < rating; n++) {
			stars.push(
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5 text-yellow-500'
					viewBox='0 0 20 20'
					fill='currentColor'
					key={n}
				>
					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
				</svg>
			);
		}
		for (var n = 0; 5 - n > rating; n++) {
			stars.push(
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5 text-gray-300'
					viewBox='0 0 20 20'
					fill='currentColor'
					key={5 - n}
				>
					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
				</svg>
			);
		}
		return stars;
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-50'>
			<Navbar />
			<Message message={message} setMessage={setMessage} />

			<header className='flex-grow-0 border-b border-indigo-100 bg-white'>
				<div className='max-w-7xl mx-auto  p-6'>
					{username && (
						<h1 className='text-3xl font-bold text-gray-800'>
							<Link to={"/u/" + username}>
								Welcome, {username}.
							</Link>
						</h1>
					)}
				</div>
			</header>
			<main className='flex flex-grow'>
				<div className='flex flex-col md:flex-row w-full  max-w-7xl  mx-auto '>
					<div className='flex flex-col flex-grow-0 flex-shrink-0 bg-gradient-to-t md:bg-gradient-to-l from-white to-gray-50 w-full md:w-1/3 md:border-r border-b border-indigo-100 items-center md:items-end md:py-6 '>
						<div className='md:sticky md:top-6 w-full p-6'>
							<div className='w-full'>
								<div className='w-full mx-auto'>
									<Disclosure defaultOpen={panelOpen}>
										{({ open }) => (
											<>
												<Disclosure.Button
													disabled={panelOpen}
													className='flex justify-between items-center w-full font-semibold text-xl text-left text-gray-800 focus:outline-none'
												>
													<span>Write a review</span>
													<ChevronUpIcon
														className={`${
															open
																? ""
																: "transform rotate-180"
														} ${
															panelOpen
																? "hidden"
																: ""
														} w-5 h-5`}
													/>
												</Disclosure.Button>
												{(open || panelOpen) && (
													<Disclosure.Panel
														static
														className='flex flex-col gap-y-6 pt-6'
													>
														<div className='w-full'>
															<textarea
																id='about'
																name='about'
																rows={5}
																ref={reviewRef}
																className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
																placeholder={`What's your take?`}
																defaultValue={
																	""
																}
															/>
														</div>
														<div className='w-full'>
															<RatingsList
																ratingRef={
																	ratingRef
																}
																rating={rating}
																setRating={
																	setRating
																}
															/>
														</div>
														<div className='w-full'>
															<label className='block text-sm font-medium text-gray-700 mb-2'>
																Record
															</label>
															<RecordsList
																currentUser={
																	currentUser
																}
																setSelected={
																	setSelected
																}
															/>
														</div>
														{error && (
															<div className='bg-red-100 rounded-md w-full p-2'>
																<p className='font-medium text-center text-sm text-red-600'>
																	{error}
																</p>
															</div>
														)}
														<div className='w-full'>
															<button
																className='w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50'
																onClick={() => {
																	submitReview();
																}}
															>
																Submit review
															</button>
														</div>
													</Disclosure.Panel>
												)}
											</>
										)}
									</Disclosure>
								</div>
							</div>
						</div>
					</div>
					<div className='flex flex-col flex-shrink flex-grow w-full md:w-2/3 py-6 px-6 gap-y-6 lg:px-8'>
						{loading && page === 0 ? (
							<div className='flex  w-full h-40 items-center justify-items-center'>
								<div className='block w-4 h-4 rounded-full bg-indigo-600 animate-bounce font-semibold mx-auto' />
							</div>
						) : reviews && reviews.length === 0 ? (
							<div className='flex  w-full h-40 items-center justify-center'>
								<p className='text-center font-semibold text-gray-500'>
									no reviews
								</p>
							</div>
						) : (
							reviews.map((review) => (
								<div
									key={review.id}
									className='bg-white rounded-md p-6 overflow-hidden border border-gray-200'
								>
									<div className='flex flex-row flex-grow pb-6 justify-between'>
										<Link
											to={"/u/" + review.username}
											className='flex flex-row items-center'
										>
											<div className='h-10 w-10 bg-white rounded-full border border-gray-200 p-1 relative object-contain overflow-hidden'>
												<img
													src={`https://avatars.dicebear.com/api/bottts/${review.username}.svg`}
												/>
											</div>
											<div className='flex flex-col ml-4 '>
												<span className='text-sm font-medium text-gray-900'>
													{review.username}
												</span>
												<span className='flex-grow  font-mono text-right text-xs text-gray-400'>
													{parseTimestamp(
														review.timestamp
													)}
												</span>
											</div>
										</Link>
										{currentUser.uid === review.uid ? (
											<button
												className='font-mono text-right text-xs text-gray-400 hover:text-red-600 w-4 h-4'
												onClick={() => {
													setSelectedReview(review);
													openModal();
												}}
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-4 w-4'
													viewBox='0 0 20 20'
													fill='currentColor'
												>
													<path
														fillRule='evenodd'
														d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
														clipRule='evenodd'
													/>
												</svg>
											</button>
										) : (
											""
										)}
									</div>
									{/* Text */}
									<div className='w-full pb-3 text-base whitespace-pre-line'>
										{review.body}
									</div>
									<div className='bg-white flex border-b border-gray-200 pb-6'>
										<span className='text-sm mr-3'>
											User rating:
										</span>
										<div className='flex flex-row relative'>
											{starCount(review.rating)}
										</div>
									</div>
									{/* Record */}
									<div className='flex flex-row items-center w-full pt-6'>
										<div className='h-16 w-16 bg-indigo-300 rounded-md flex-shrink-0 relative object-contain overflow-hidden'>
											<img
												className='absolute bottom-0 h-full w-full object-cover'
												src={review.cover}
											/>
										</div>

										<div className='flex-row ml-4'>
											<div className='flex text-sm font-semibold flex-wrap'>
												<span className=''>
													{review.title}
												</span>
											</div>
											<div className='text-sm text-gray-400 tracking-wider font-mono'>
												{review.year}
											</div>
										</div>
									</div>
								</div>
							))
						)}
						{loadMoreButtonDisabled ? (
							""
						) : (
							<button
								onClick={() => {
									setPage(page + 1);
								}}
								disabled={loadMoreButtonDisabled}
								className='mb-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
							>
								Load More
							</button>
						)}
					</div>
				</div>
			</main>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as='div'
					className='fixed inset-0 z-10 overflow-y-auto'
					onClose={closeModal}
				>
					<div className='min-h-screen px-4 text-center'>
						<Dialog.Overlay className='fixed inset-0 bg-indigo-600 opacity-30 ' />

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className='inline-block h-screen align-middle'
							aria-hidden='true'
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
								<Dialog.Title
									as='h3'
									className='text-lg text-center font-semibold leading-6 text-gray-900'
								>
									Delete review
								</Dialog.Title>
								<div className='mt-2'>
									<p className='text-sm text-center text-gray-500 pb-6'>
										Are you sure you want to delete this
										review?
									</p>
									<div className='flex flex-row items-center w-full border border-gray-200 rounded-lg  p-6'>
										<div className='h-16 w-16 bg-indigo-300 rounded-md flex-shrink-0 relative object-contain overflow-hidden'>
											<img
												className='absolute bottom-0 h-full w-full object-cover'
												src={selectedReview.cover}
											/>
										</div>

										<div className='flex-row ml-4'>
											<div className='flex text-sm font-semibold flex-wrap'>
												<span className=''>
													{selectedReview.title}
												</span>
											</div>
											<div className='text-sm text-gray-400 tracking-wider font-mono'>
												{selectedReview.year}
											</div>
										</div>
									</div>
								</div>

								<div className='flex gap-3 justify-center pt-6'>
									<button
										type='button'
										className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
										onClick={deleteReview}
									>
										Delete review
									</button>
									<button
										type='button'
										className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
										onClick={closeModal}
									>
										Cancel
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
}
