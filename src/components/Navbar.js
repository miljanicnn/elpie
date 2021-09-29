import React, { useState, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function Navbar() {
	const history = useHistory();
	const [error, setError] = useState("");
	const { currentUser, logout, username } = useAuth();

	const navigation = [
		{
			name: "Home",
			path: "/",
		},
		{
			name: "Browse Records",
			path: "/browse",
		},
		{
			name: "My Collection",
			path: "/collection",
		},
		{
			name: "My Wishlist",
			path: "/wishlist",
		},
		{
			name: "Social",
			path: "/social",
		},
	];

	async function handleLogOut() {
		setError("");
		try {
			await logout();
			history.push("/login");
		} catch (err) {
			setError(err.message);
			console.log(error);
		}
	}

	return (
		<Disclosure as='nav' className='bg-gray-800 flex-grow-0'>
			{({ open }) => (
				<>
					<div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex items-center justify-between h-16'>
							<div className='flex items-center'>
								<div
									className='flex-shrink-0 h-5 w-5 hover:cursor-pointer'
									onClick={() => {
										history.push("/");
									}}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										x='0'
										y='0'
										enableBackground='new 0 0 300 297'
										version='1.1'
										fill='white'
										viewBox='0 0 300 297'
										xmlSpace='preserve'
									>
										<g>
											<path d='M162 192.2h-12.3c-3.9 0-7.6-.1-11.2-.4 0 17.7 9.5 27.4 28.4 29.1 5.2.4 10.3.7 15.2.7 12.7 0 28.6-2.9 47.7-8.7 19.1-5.8 36.3-15.3 51.5-28.4l13.9 69.5c-33.2 28.6-83.4 43-150.6 43-38.6 0-71.7-11.2-99.4-33.7C15 238.7 0 204.6 0 161.1c0-32.8 8.5-62.2 25.5-88.3C41.3 49 62.6 30.9 89.6 18.5 116.6 6.2 145.7 0 177 0c40.5 0 71.2 8.9 92 26.6 20.8 17.7 31.1 39.6 31.1 65.7-.1 26.1-12.6 49.2-37.4 69.5-25 20.2-58.5 30.4-100.7 30.4zm30.2-101.7c0-13.1-6.1-19.7-18.3-19.7-14 1.3-23.1 8.6-27.3 21.7-2.1 6.3-3.5 13.5-4.4 21.8-.8 8.3-2 17.1-3.7 26.5l48.9-10.9 4.2-34.2.6-5.2z'></path>
										</g>
									</svg>
									{/* <img
										className='h-8 w-8 hover:cursor-pointer'
										src='./../logo.svg'
										alt='elpie'
										onClick={() => {
											history.push("/");
										}}
									/> */}
								</div>
							</div>
							<div className='hidden md:block'>
								<div className='ml-10 flex items-baseline space-x-4'>
									{navigation.map((item) => (
										<NavLink
											key={item.name}
											exact={item.path === "/"}
											to={item.path}
											className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
											activeClassName='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
										>
											{item.name}
										</NavLink>
									))}
								</div>
							</div>
							<div className='hidden md:block'>
								<div className='ml-4 flex items-center md:ml-6'>
									{/* <button className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none'>
										<span className='sr-only'>
											View notifications
										</span>
										<BellIcon
											className='h-6 w-6'
											aria-hidden='true'
										/>
									</button> */}

									{/* Profile dropdown */}
									<Menu as='div' className='ml-3 relative'>
										{({ open }) => (
											<>
												<div>
													<Menu.Button className='max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none '>
														{/* focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white */}
														<span className='sr-only'>
															Open user menu
														</span>
														<img
															className='h-8 w-8 rounded-full p-1'
															src={`https://avatars.dicebear.com/api/bottts/${username}.svg`}
															alt=''
														/>
													</Menu.Button>
												</div>
												<Transition
													show={open}
													as={Fragment}
													enter='transition ease-out duration-100'
													enterFrom='transform opacity-0 scale-95'
													enterTo='transform opacity-100 scale-100'
													leave='transition ease-in duration-75'
													leaveFrom='transform opacity-100 scale-100'
													leaveTo='transform opacity-0 scale-95'
												>
													<Menu.Items
														static
														className='origin-top-right absolute right-0 mt-2 w-48 min-w-full rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
													>
														<Menu.Item>
															<Link
																to={
																	"/u/" +
																	username
																}
																className={
																	"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
																}
															>
																Your profile
															</Link>
														</Menu.Item>
														<Menu.Item>
															<button
																onClick={
																	handleLogOut
																}
																className={
																	"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
																}
															>
																Sign out
															</button>
														</Menu.Item>
													</Menu.Items>
												</Transition>
											</>
										)}
									</Menu>
								</div>
							</div>
							<div className='-mr-2 flex md:hidden'>
								{/* Mobile menu button */}
								<Disclosure.Button className='bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 '>
									<span className='sr-only'>
										Open main menu
									</span>
									{open ? (
										<XIcon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									) : (
										<MenuIcon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className='md:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
							{navigation.map((item) => (
								<NavLink
									key={item.name}
									exact
									to={item.path}
									className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
									activeClassName='bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium'
								>
									{item.name}
								</NavLink>
							))}
						</div>
						<div className='pt-4 pb-3 border-t border-gray-700'>
							<Link
								to={`/u/${username}`}
								className='flex items-center px-5'
							>
								<div className='flex-shrink-0 bg-white rounded-full'>
									<img
										className='h-8 w-8 rounded-full p-1'
										src={`https://avatars.dicebear.com/api/bottts/${username}.svg`}
										alt=''
									/>
								</div>
								<div className='ml-3'>
									{username && (
										<div className='text-base pb-1 font-medium leading-none text-white'>
											{username}
										</div>
									)}
									<div className='text-sm font-medium leading-none text-gray-400'>
										{currentUser && currentUser.email}
									</div>
								</div>
							</Link>
							<div className='mt-3 px-2 space-y-1'>
								<a
									href='/'
									onClick={handleLogOut}
									className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700'
								>
									Sign out
								</a>
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
