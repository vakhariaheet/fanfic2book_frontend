import React, { useEffect, useState, useRef } from 'react';
import Header from '../../Components/Header/Header';
import './Index.scss';
import Navbar from '../../Components/Navbar/Navbar';
import getURLInfo from '../../Utils/getURLInfo';
import { io } from 'socket.io-client';
import Card from '../../Components/Card/Card';
import { bookType } from '../../Interfaces';
import useLocalStorage from '../../Hooks/useLocalStorage';

let socket: any;
export default function Index() {
	const [bookURL, setBookURL] = useState<string>('');
	const [extension, setExtension] = useLocalStorage('extension', 'html');
	const [isDropdownSelect, setIsDropDownSelect] = useState<boolean>(false);
	const lastLog = useRef<HTMLDivElement>(null);
	const bookURLEle = useRef<HTMLInputElement>(null);
	const cardContainer = useRef<HTMLDivElement>(null);
	const [showLogs, setShowLogs] = useState<boolean>(true);
	const [logs, setLogs] = useState<string[]>([]);
	const [books, setBooks] = useState<bookType[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const forceUpdateEle = useRef<HTMLInputElement>(null);
	const [bookLinks, setBookLinks] = useState<
		{
			name: string;
			link: string;
			uid: string;
		}[]
	>([]);
	useEffect(() => {
		socket = io('http://localhost:3000');
		console.log(`Connecting socket...`);
		return () => {
			if (socket) return socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.on('log', (data: { message: string }) => {
			setLogs((logs) => [...logs, data.message]);

			if (lastLog.current) {
				lastLog.current.scrollIntoView({ behavior: 'smooth' });
			}
		});

		socket.on('success', async (data: any) => {
			console.log(data, 'Success');
			if (data.extension === 'epub') {
				const blob = new Blob([data.buffer], { type: 'application/epub+zip' });
				const url = URL.createObjectURL(blob);
				const tempBooksLinks = bookLinks;
				const isLink = tempBooksLinks.find((book) => book.uid === data.uid);
				if (!isLink) {
					tempBooksLinks.push({
						name: `${data.title} by ${data.author}.epub`,
						link: url,
						uid: data.uid,
					});

					setBookLinks(tempBooksLinks);
				}
			}
			if (data.extension === 'html') {
				const blob = new Blob([data.buffer], { type: 'text/html' });
				const url = URL.createObjectURL(blob);
				const tempBooksLinks = bookLinks;

				const isLink = tempBooksLinks.find((book) => book.uid === data.uid);
				if (!isLink) {
					tempBooksLinks.push({
						name: `${data.title} by ${data.author}.html`,
						link: url,
						uid: data.uid,
					});
					setBookLinks(tempBooksLinks);
				}
			}
		});
		socket.on('bookinfo', (data: bookType) => {
			console.log(data, 'Book Info');
			if (cardContainer.current) {
				cardContainer.current.scrollIntoView({ behavior: 'smooth' });
				const tempBooks = books;
				const isBookExist = tempBooks.find(
					(book) => book.uid === data.uid && book.extension === data.extension,
				);

				if (!isBookExist) {
					tempBooks.push(data);
					console.log(tempBooks, 'tempBooks');
					setBooks(tempBooks);
					setCurrentPage(
						books.length % 2 === 0 ? books.length / 2 : (books.length + 1) / 2,
					);
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const getTotalPages = (): number => {
		if (books.length === 0) return 0;
		return books.length % 2 === 0 ? books.length / 2 : (books.length + 1) / 2;
	};

	const fetch = () => {
		setLogs([]);
		const info = getURLInfo(bookURL);
		if (!info || !forceUpdateEle.current) return;
		socket.emit('getbook', {
			...info,
			extension,
			forceUpdate: forceUpdateEle.current.checked,
		});
		if (info.type === 'user') {
			setBooks([]);
			setBookLinks([]);
		}
	};
	return (
		<div>
			<Navbar />
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
					<button
						className='btn'
						onClick={() => {
							socket.emit('sendtoemail', {
								...getURLInfo(bookURL),
								extension,
							});
						}}
					>
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
			<h3 className='logs-Heading'>
				Logs{' '}
				{showLogs ? (
					<svg
						version='1.0'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 512.000000 512.000000'
						preserveAspectRatio='xMidYMid meet'
						onClick={() => setShowLogs(false)}
					>
						<g
							transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
							fill='#000000'
							stroke='none'
						>
							<path
								d='M4260 4470 c-14 -6 -147 -133 -297 -282 l-271 -271 -129 50 c-208 83
				   -406 135 -638 170 -184 27 -571 24 -764 -6 -509 -78 -959 -281 -1385 -624
				   -135 -108 -391 -366 -500 -502 -118 -149 -264 -368 -272 -410 -11 -60 4 -100
				   86 -223 240 -363 584 -709 930 -937 58 -38 107 -70 109 -72 3 -2 -104 -113
				   -236 -246 -207 -207 -242 -247 -248 -280 -11 -60 3 -107 44 -148 41 -41 88
				   -55 148 -44 34 6 227 196 1831 1798 1317 1317 1795 1801 1803 1826 22 67 -2
				   139 -63 184 -31 23 -111 32 -148 17z m-1360 -655 c172 -26 363 -76 514 -135
				   l30 -11 -164 -164 -164 -164 -27 19 c-52 38 -215 110 -294 132 -106 28 -344
				   31 -449 5 -183 -46 -328 -128 -462 -261 -133 -134 -215 -280 -261 -462 -27
				   -108 -24 -334 5 -444 23 -83 89 -234 131 -295 l20 -31 -203 -203 -203 -203
				   -95 59 c-332 209 -669 527 -878 829 l-51 74 50 73 c177 256 485 564 746 748
				   352 248 768 405 1181 448 124 13 448 5 574 -14z m-198 -634 c62 -16 178 -64
				   178 -74 0 -1 -195 -197 -434 -436 l-434 -434 -27 52 c-36 73 -65 191 -65 270
				   1 409 394 721 782 622z'
							/>
							<path
								d='M4137 3462 c-59 -59 -107 -112 -106 -117 0 -6 39 -40 87 -77 205
				   -157 475 -445 621 -660 l32 -48 -41 -60 c-172 -254 -471 -557 -735 -746 -452
				   -324 -980 -489 -1505 -470 -164 5 -215 11 -383 42 l-89 17 -129 -129 c-93 -93
				   -125 -130 -115 -136 28 -16 265 -69 401 -90 187 -29 568 -31 750 -5 645 95
				   1183 373 1675 866 176 177 291 316 420 509 129 192 129 209 12 388 -112 170
				   -265 357 -427 520 -137 138 -328 304 -349 304 -6 0 -60 -48 -119 -108z'
							/>
							<path
								d='M3336 2661 l-138 -138 -13 -79 c-16 -92 -73 -214 -134 -287 -94 -113
				   -238 -198 -375 -222 l-79 -13 -141 -141 c-77 -77 -137 -143 -134 -146 12 -12
				   165 -34 239 -35 253 -1 486 98 674 285 193 193 278 396 279 665 1 125 -16 250
				   -32 250 -4 0 -69 -62 -146 -139z'
							/>
						</g>
					</svg>
				) : (
					<svg
						version='1.0'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 512.000000 512.000000'
						preserveAspectRatio='xMidYMid meet'
						onClick={() => setShowLogs(true)}
					>
						<g
							transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
							fill='#000000'
							stroke='none'
						>
							<path
								d='M2370 4184 c-589 -70 -1135 -342 -1715 -855 -203 -179 -537 -540
-623 -674 -36 -56 -36 -134 0 -190 46 -72 240 -297 378 -438 493 -508 1042
-864 1560 -1012 225 -64 339 -79 590 -79 251 0 365 15 590 79 607 174 1274
647 1806 1283 146 174 158 195 158 262 0 67 -12 88 -158 262 -529 631 -1194
1105 -1796 1280 -202 59 -336 78 -555 82 -110 3 -216 2 -235 0z m435 -349
c471 -71 984 -348 1477 -799 151 -137 448 -454 448 -477 0 -3 -34 -46 -77 -94
-582 -666 -1244 -1089 -1848 -1180 -128 -19 -362 -19 -490 0 -435 66 -899 303
-1360 694 -167 141 -565 551 -565 581 0 4 34 47 77 95 578 661 1240 1086 1839
1179 122 19 375 19 499 1z'
							/>
							<path
								d='M2420 3564 c-433 -79 -741 -361 -846 -774 -27 -106 -27 -354 0 -460
97 -380 376 -659 756 -756 106 -27 354 -27 460 0 380 97 659 376 756 756 15
58 19 110 19 230 0 120 -4 172 -19 230 -95 375 -366 650 -741 752 -68 19 -323
33 -385 22z m300 -350 c187 -42 358 -179 445 -359 52 -107 68 -189 63 -325 -5
-129 -30 -216 -90 -318 -42 -72 -158 -188 -230 -230 -211 -124 -485 -124 -696
0 -72 42 -188 158 -230 230 -124 211 -124 485 0 696 42 72 158 188 230 230
151 89 328 116 508 76z'
							/>
						</g>
					</svg>
				)}
			</h3>
			<div
				className='logs--container'
				style={{ display: showLogs ? 'block' : 'none' }}
			>
				<div>
					{/* eslint-disable-next-line array-callback-return */}
					{logs.map((log, index) => {
						if (typeof log === 'string') {
							if (index === logs.length - 1) {
								return (
									<p
										key={index}
										ref={lastLog}
										dangerouslySetInnerHTML={{ __html: log }}
									></p>
								);
							}
							return (
								<p key={index} dangerouslySetInnerHTML={{ __html: log }}></p>
							);
						}
					})}
				</div>
			</div>
			<div className='card__container' ref={cardContainer}>
				{/* eslint-disable-next-line array-callback-return */}
				{books.map((book, index) => {
					if (index < currentPage * 2 && index >= (currentPage - 1) * 2) {
						return (
							<Card
								key={index}
								book={book}
								link={bookLinks.find((link) => link.uid === book.uid)}
							/>
						);
					}
				})}
			</div>
			<div className='page-controls'>
				{new Array(getTotalPages()).fill(0).map((_, index) => {
					return (
						<button
							key={index}
							className={`page-controls__button ${
								index + 1 === currentPage ? 'page-controls__button--active' : ''
							}`}
							onClick={() => setCurrentPage(index + 1)}
						>
							<svg
								width='15'
								height='15'
								viewBox='0 0 15 15'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<circle cx='7.5' cy='7.5' r='7' />
							</svg>
						</button>
					);
				})}
			</div>
		</div>
	);
}
