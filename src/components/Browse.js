import React, { useState, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/outline";
// import axios from "axios";

export default function Browse(props) {
	// const [searchResults, setSearchResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	useEffect(() => {
		if (props.setQuery) props.setQuery(searchQuery);
	}, [searchQuery]);

	return (
		<form
			className='focus:ring-0 mt-1 flex w-full rounded-md shadow-sm '
			onSubmit={(event) => {
				event.preventDefault();
				props.passQuery(searchQuery);
			}}
		>
			<input
				type='text'
				onChange={(e) => {
					setSearchQuery(e.target.value);

					// props.getResults(e.target.value);
				}}
				className=' focus:ring-indigo-500 focus:border-indigo-500  flex-1 block w-full px-6 md:text-base h-16 rounded-l-full text-sm border-gray-300'
				placeholder={props.placeholder}
			/>

			<button
				type='submit'
				className=' inline-flex items-center px-6 rounded-r-full border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'
			>
				<SearchIcon className='h-6 w-6' />
			</button>
		</form>
	);
}
