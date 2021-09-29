import React, { Fragment, useRef, useState, useEffect } from "react";
import { Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline";
import axios from "axios";

export default function RecordsList(props) {
	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	const [selected, setSelected] = useState({
		title: "",
		cover: "",
	});
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");

	useEffect(() => {
		let mounted = true;
		searchCollection(query, page);
		setSelected(searchResults[0]);
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		props.setSelected(selected);
		return () => {
			mounted = false;
		};
	}, [selected]);

	const searchCollection = (q, p) => {
		let mounted = true;
		setLoading(true);
		setQuery(q);
		setSearchResults([]);

		try {
			axios
				.get("http://localhost:3001/searchmycollection", {
					params: {
						uid: props.currentUser.uid,
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
						setSelected(response.data[0]);
						setSearchResults(tempArray);
						setLoading(false);
						// setQuery("");
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
		<>
			<form
				className='flex flex-row mb-3 flex-grow-0'
				onSubmit={(event) => {
					event.preventDefault();
					searchCollection(query);
				}}
			>
				<input
					type='text'
					name='street-address'
					id='street-address'
					placeholder='Search your collection...'
					autoComplete='off'
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
					className='focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
				/>
				<button
					type='submit'
					className='ml-3 inline-flex flex-shrink-0 items-center justify-center w-10 rounded-full border border-gray-300 bg-gray-50 text-gray-500 text-sm'
				>
					<SearchIcon className='h-5 w-5' />
				</button>
			</form>
			{!props.loading ? (
				selected ? (
					<Listbox
						value={selected}
						onChange={setSelected}
						className='flex-grow'
					>
						{({ open }) => (
							<>
								<div className='mt-2 relative'>
									<Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
										<span className='flex items-center'>
											<img
												src={selected.cover}
												alt=''
												className='flex-shrink-0 h-10 w-10 rounded-md'
											/>
											<span className='ml-3 block truncate'>
												{selected.title}
											</span>
										</span>
										<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
											<SelectorIcon
												className='h-5 w-5 text-gray-400'
												aria-hidden='true'
											/>
										</span>
									</Listbox.Button>
									<Transition
										show={open}
										as={Fragment}
										leave='transition ease-in duration-100'
										leaveFrom='opacity-100'
										leaveTo='opacity-0'
									>
										<Listbox.Options
											static
											className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-72 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
										>
											{searchResults.map((result) => (
												<Listbox.Option
													key={result.id}
													className={({ active }) =>
														classNames(
															active
																? "text-white bg-indigo-600"
																: "text-gray-900",
															"cursor-default select-none relative py-2 pl-3 pr-9"
														)
													}
													value={result}
												>
													{({ selected, active }) => (
														<>
															<div className='flex items-center'>
																<img
																	src={
																		result.cover
																	}
																	alt=''
																	className='flex-shrink-0 h-10 w-10 rounded-md'
																/>
																<span
																	className={classNames(
																		selected
																			? "font-semibold"
																			: "font-normal",
																		"ml-3 block truncate"
																	)}
																>
																	{
																		result.title
																	}
																</span>
															</div>

															{selected ? (
																<span
																	className={classNames(
																		active
																			? "text-white"
																			: "text-indigo-600",
																		"absolute inset-y-0 right-0 flex items-center pr-4"
																	)}
																>
																	<CheckIcon
																		className='h-5 w-5'
																		aria-hidden='true'
																	/>
																</span>
															) : null}
														</>
													)}
												</Listbox.Option>
											))}
										</Listbox.Options>
									</Transition>
								</div>
							</>
						)}
					</Listbox>
				) : (
					<div className='w-full flex-grow border content-center border-gray-300 rounded-md shadow-sm p-5 sm:text-sm'>
						<span>No items matched your search</span>
					</div>
				)
			) : (
				<>
					<div className='h-4 bg-gray-100 w-20 animate-pulse mb-3 mt-1' />
					<div className='h-14 bg-indigo-200 w-full animate-pulse rounded-md mb-2' />
				</>
			)}
		</>
	);
}
