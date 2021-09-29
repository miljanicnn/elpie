/* This example requires Tailwind CSS v2.0+ */
import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";

export default function Message(props) {
	const handleClickClose = () => {
		props.setMessage({ ...props.message, visible: false });
	};
	return (
		<>
			{props.message.visible && (
				<div
					className={`bg-${props.message.color}-600 fixed bottom-0 w-full z-50`}
				>
					<div className='mx-auto py-3 px-3 sm:px-6 lg:px-8'>
						<div className='flex items-center justify-between flex-wrap'>
							<div className='w-0 flex-1 flex items-center'>
								<span
									className={`flex p-2 rounded-lg bg-${props.message.color}-800`}
								>
									<SpeakerphoneIcon
										className='h-6 w-6 text-white'
										aria-hidden='true'
									/>
								</span>
								<p className='ml-3 font-medium text-white'>
									<span className='md:inline'>
										{props.message.text}
									</span>
								</p>
							</div>
							<div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>
								<button
									type='button'
									onClick={handleClickClose}
									className={`-mr-1 flex p-2 rounded-md hover:bg-${props.message.color}-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2`}
								>
									<span className='sr-only'>Dismiss</span>
									<XIcon
										className='h-6 w-6 text-white'
										aria-hidden='true'
									/>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
