import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

export default function Pagination(props) {
	return (
		<div className='py-6 flex items-center justify-between border-t border-gray-200'>
			<div className='flex-1 flex justify-between px-4  sm:px-0'>
				<button
					onClick={(event) => {
						event.preventDefault();
						props.decreasePage();
					}}
					disabled={props.page === 1}
					className={`relative ${
						props.page === 1 ? "" : "disabled"
					} inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50`}
				>
					Previous
				</button>
				{props.searchResLength !== 0 ? (
					<p className='text-sm text-gray-500 p-2'>
						Results{" "}
						<span className='font-medium'>
							{(props.page - 1) * 12 + 1}
						</span>{" "}
						-{" "}
						<span className='font-medium'>
							{(props.page - 1) * 12 + props.searchResLength}
						</span>{" "}
						of{" "}
						<span className='font-medium'>
							{/* {props.pagination && props.pagination}
							{props.totalResults && props.totalResults} */}
							{props.totalResults && props.totalResults}
						</span>
					</p>
				) : (
					""
				)}
				<button
					onClick={(event) => {
						event.preventDefault();
						props.increasePage();
					}}
					disabled={
						(props.page - 1) * 12 + props.searchResLength >=
						props.totalResults
					}
					className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
				>
					Next
				</button>
			</div>
		</div>
	);
}
