/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline";

export default function ReviewModal(props) {
	const [searchQuery, setSearchQuery] = useState("");

	const cancelButtonRef = useRef(null);

	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}

	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog
				as='div'
				static
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				open={props.open}
				onClose={props.setOpen}
			>
				<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className='hidden sm:inline-block sm:align-middle sm:h-screen'
						aria-hidden='true'
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full'>
							<div className='bg-white'>
								<div className='flex flex-col w-full h-full lg:sticky lg:top-12 max-w-7xl  mx-auto sm:px-6 lg:px-8'>
									<div className='flex flex-col md:flex-row bg-white rounded-3xl p-6 md:py-6 md:px-0'>
										<div className='w-full md:w-1/2 border-b md:border-r md:border-b-0 border-gray-200 pb-6 md:pb-0 md:pr-6'>
											<textarea
												id='about'
												name='about'
												rows={12}
												ref={props.reviewRef}
												className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
												placeholder={`What's your take?`}
												defaultValue={""}
											/>
										</div>
										<div className='w-full md:w-1/2 md:pl-6 md:pt-1 pt-6 flex flex-col'>
											<form
												className='flex flex-row mb-3 flex-grow-0'
												onSubmit={(event) => {
													event.preventDefault();
													props.searchCollection(
														searchQuery
													);
												}}
											>
												<input
													type='text'
													name='street-address'
													id='street-address'
													placeholder='Search your collection...'
													autoComplete='off'
													value={props.searchQuery}
													onChange={(e) => {
														setSearchQuery(
															e.target.value
														);

														// props.getResults(e.target.value);
													}}
													className='focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
												/>
												<button
													type='submit'
													className='ml-3 inline-flex flex-shrink-0 items-center justify-center w-12 rounded-full border border-gray-300 bg-gray-50 text-gray-500 text-sm'
												>
													<SearchIcon className='h-5 w-5' />
												</button>
											</form>

											{!props.loading ? (
												props.selected ? (
													<Listbox
														value={props.selected}
														onChange={
															props.setSelected
														}
														className='flex-grow'
													>
														{({ open }) => (
															<>
																<Listbox.Label className='block text-sm font-medium text-gray-700'>
																	Select the
																	record
																</Listbox.Label>

																<div className='mt-2 relative'>
																	<Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
																		<span className='flex items-center'>
																			<img
																				src={
																					props
																						.selected
																						.cover
																				}
																				alt=''
																				className='flex-shrink-0 h-10 w-10 rounded-md'
																			/>
																			<span className='ml-3 block truncate'>
																				{
																					props
																						.selected
																						.title
																				}
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
																		show={
																			open
																		}
																		as={
																			Fragment
																		}
																		leave='transition ease-in duration-100'
																		leaveFrom='opacity-100'
																		leaveTo='opacity-0'
																	>
																		<Listbox.Options
																			static
																			className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
																		>
																			{props.searchResults.map(
																				(
																					result
																				) => (
																					<Listbox.Option
																						key={
																							result.id
																						}
																						className={({
																							active,
																						}) =>
																							classNames(
																								active
																									? "text-white bg-indigo-600"
																									: "text-gray-900",
																								"cursor-default select-none relative py-2 pl-3 pr-9"
																							)
																						}
																						value={
																							result
																						}
																					>
																						{({
																							selected,
																							active,
																						}) => (
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
																				)
																			)}
																		</Listbox.Options>
																	</Transition>
																</div>
															</>
														)}
													</Listbox>
												) : (
													<div className='w-full flex-grow border content-center border-gray-300 rounded-md shadow-sm p-6 sm:text-sm'>
														<span>
															No items matched
															your search
														</span>
													</div>
												)
											) : (
												<>
													<div className='h-4 bg-gray-100 w-20 animate-pulse mb-3 mt-1' />
													<div className='h-14 bg-indigo-200 w-full animate-pulse rounded-md mb-2' />
												</>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='bg-gray-50 px-6 py-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
									onClick={props.handleSubmitReview}
								>
									Submit Your Review
								</button>
								<button
									type='button'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
									onClick={() => props.setOpen(false)}
									ref={cancelButtonRef}
								>
									Cancel
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
