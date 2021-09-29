import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

export default function UserListModal(props) {
	const [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		props.setOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	return (
		<>
			<Transition appear show={props.open} as={Fragment}>
				<Dialog
					as='div'
					className='fixed inset-0 z-10 overflow-y-auto'
					onClose={closeModal}
				>
					<div className='min-h-screen px-4 text-center'>
						<Dialog.Overlay className='fixed inset-0 bg-indigo-600 opacity-30 ' />

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
									{props.title}
								</Dialog.Title>
								<div className='mt-2'>
									<p className='text-sm text-center text-gray-500 pb-6'>
										Text
									</p>
									<div className='flex flex-col w-full h-auto max-h-72 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg px-3'>
										{props.title === "Following"
											? props.list.map((user) => (
													<div
														key={user.follows}
														className='py-3 whitespace-nowrap'
													>
														<Link
															to={
																"/u/" +
																user.following
															}
															target='_blank'
														>
															<div
																key={
																	user.follows
																}
																className='flex items-center'
															>
																<div className='h-10 w-10 bg-white rounded-full relative object-contain overflow-hidden'>
																	<img
																		src={`https://avatars.dicebear.com/api/bottts/${user.following}.svg`}
																	/>
																</div>
																<div className='ml-4'>
																	<div className='text-sm font-medium text-gray-900'>
																		{
																			user.following
																		}
																	</div>
																</div>
															</div>
														</Link>
													</div>
											  ))
											: props.list.map((user) => (
													<div
														key={user.uid}
														className='py-3 whitespace-nowrap'
													>
														<Link
															to={
																"/u/" +
																user.follower
															}
															target='_blank'
														>
															<div
																key={user.uid}
																className='flex items-center'
															>
																<div className='h-10 w-10 bg-white rounded-full relative object-contain overflow-hidden'>
																	<img
																		src={`https://avatars.dicebear.com/api/bottts/${user.follower}.svg`}
																	/>
																</div>
																<div className='ml-4'>
																	<div className='text-sm font-medium text-gray-900'>
																		{
																			user.follower
																		}
																	</div>
																</div>
															</div>
														</Link>
													</div>
											  ))}
									</div>
								</div>

								<div className='flex gap-3 justify-center pt-6'>
									<button
										type='button'
										className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
										onClick={() => console.log("click")}
									>
										Click
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
