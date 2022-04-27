import React, { useState, useRef } from 'react';
import Header from '../Header/Header';
import './FetchBookNavigation.scss';

export interface FetchBookNavigationProps {
	fetch: () => void;
	bookURL: string;
	setBookURL: (url: string) => void;
	sendBooktoEmail: () => void;
	forceUpdateEle: React.RefObject<HTMLInputElement>;
	extension: string;
	setExtension: (extension: string) => void;
}

const FetchBookNavigation: React.FC<FetchBookNavigationProps> = ({
	fetch,
	bookURL,
	setBookURL,
	sendBooktoEmail,
	forceUpdateEle,
	extension,
	setExtension,
}) => {
	const [isDropdownSelect, setIsDropDownSelect] = useState<boolean>(false);
	const bookURLEle = useRef<HTMLInputElement>(null);

	return (
		<div style={{ padding: '0 6rem' }}>
			<Header padding='6.2rem 0 2rem 0' />
			<input
				type='text'
				placeholder='URL'
				ref={bookURLEle}
				onChange={({ target }) => setBookURL(target.value)}
				className='url-input'
				value={bookURL}
			/>
			<div className='btn--container'>
				<button
					className='btn'
					onClick={async (e) => {
						if (bookURLEle.current === null) return;
						bookURLEle.current.focus();
						const clipboard = await navigator.clipboard.readText();
						setBookURL(clipboard);
					}}
				>
					Paste
				</button>

				<div
					className={
						isDropdownSelect ? 'dropdown-active dropdown btn' : 'dropdown btn'
					}
				>
					<div
						className='text'
						onClick={() => setIsDropDownSelect((preValue) => !preValue)}
					>
						{extension.toUpperCase()}{' '}
						<svg
							version={'1.0'}
							className={isDropdownSelect ? 'arrow-up' : 'arrow-down'}
							xmlns='http://www.w3.org/2000/svg'
							width='512.000000pt'
							height='512.000000pt'
							viewBox='0 0 512.000000 512.000000'
							preserveAspectRatio='xMidYMid meet'
						>
							<g
								transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
								fill='#000000'
								stroke='none'
							>
								<path
									d='M277 4009 c-103 -24 -197 -103 -244 -204 -23 -51 -28 -73 -27 -145 0
-160 -96 -52 1192 -1342 777 -778 1160 -1155 1191 -1172 73 -39 158 -53 234
-37 34 7 83 24 108 37 31 17 414 394 1191 1172 1288 1290 1192 1182 1192 1342
0 72 -4 94 -28 147 -84 184 -308 262 -491 171 -26 -13 -388 -368 -1037 -1016
l-998 -997 -998 997 c-652 651 -1011 1003 -1037 1016 -76 37 -170 49 -248 31z'
								/>
							</g>
						</svg>
					</div>
					{isDropdownSelect && (
						<div className='dropdown-content'>
							<p
								onClick={() => {
									setExtension('epub');
									setIsDropDownSelect(false);
								}}
								className='dropdown-item'
							>
								EPUB
							</p>
							<p
								onClick={() => {
									setExtension('html');
									setIsDropDownSelect(false);
								}}
								className='dropdown-item'
							>
								HTML
							</p>
							<p
								onClick={() => {
									setExtension('pdf');
									setIsDropDownSelect(false);
								}}
								className='dropdown-item'
							>
								PDF
							</p>
						</div>
					)}
				</div>
				<button className='btn' onClick={sendBooktoEmail}>
					Send To Email
				</button>
				<button className='btn' onClick={fetch}>
					Fetch
				</button>
				<div className='force-update'>
					<input
						type='checkbox'
						name=''
						id='forceupdate'
						ref={forceUpdateEle}
					/>
					<label htmlFor='forceupdate' className='btn forceupdate '>
						Force Update
					</label>
				</div>
			</div>
		</div>
	);
};

export default FetchBookNavigation;
