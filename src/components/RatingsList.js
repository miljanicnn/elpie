import React, { Fragment } from "react";
import { Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function RatingsList(props) {
	const ratings = [5, 4, 3, 2, 1];
	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	const starCount = (rating) => {
		let content = [];

		for (var n = 0; n < rating; n++) {
			content.push(
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
			content.push(
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
		return content;
	};
	return (
		<Listbox
			value={ratings}
			onChange={props.setRating}
			className='flex-grow'
		>
			{({ open }) => (
				<>
					<Listbox.Label className='block text-sm font-medium text-gray-700'>
						Rating
					</Listbox.Label>

					<div className='mt-2 relative'>
						<Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
							<span className='flex items-center'>
								{/* <span className='ml-3 block truncate'>
									{props.rating}
								</span> */}
								<div className='flex flex-row relative'>
									{starCount(props.rating)}
								</div>
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
							// as={Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Listbox.Options
								static
								className='absolute z-10 mt-1 w-full bg-white shadow-lg h-48 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
							>
								{ratings.map((rating) => (
									<Listbox.Option
										key={rating}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={rating}
									>
										{({ selected, active }) => (
											<>
												<div className='flex items-center'>
													{/* <span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"ml-3 block truncate"
														)}
													>
														{rating}
													</span> */}
													<div className='flex flex-row relative'>
														{starCount(rating)}
														{/* {ratings.map((v, i) => {
															i < rating ? (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5 text-indigo-300'
																	viewBox='0 0 20 20'
																	fill='currentColor'
																>
																	<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																</svg>
															) : (
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5 text-gray-300'
																	viewBox='0 0 20 20'
																	fill='currentColor'
																>
																	<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																</svg>
															);
														})} */}
													</div>
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
	);
}
