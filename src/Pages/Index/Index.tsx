import React, { useEffect, useState, useRef } from 'react';
import './Index.scss';
import Navbar from '../../Components/Navbar/Navbar';
import getURLInfo from '../../Utils/getURLInfo';
import { io } from 'socket.io-client';
import JSZip from 'jszip';

import Card from '../../Components/Card/Card';
import { bookType, unknownUserType, userType } from '../../Interfaces';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { userContext } from '../../Contexts/userContext';
import Logs from '../../Components/Logs/Logs';
import FetchBookNavigation from '../../Components/FetchBookNavigation/FetchBookNavigation';
import BooksPageNavigation from '../../Components/BooksPageNavigation/BooksPageNavigation';

let socket: any;
export default function Index() {
	const [bookURL, setBookURL] = useState<string>('');
	const [extension, setExtension] = useLocalStorage('extension', 'html');
	const lastLog = useRef<HTMLDivElement>(null);
	const cardContainer = useRef<HTMLDivElement>(null);
	const [logs, setLogs] = useState<string[]>([]);
	const [books, setBooks] = useState<bookType[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const forceUpdateEle = useRef<HTMLInputElement>(null);
	const [isAllBookFetched, setIsAllBookFetched] = useState<boolean>(false);
	const [bookLinks, setBookLinks] = useState<
		{
			name: string;
			buffer: Buffer;
			uid: string;
		}[]
	>([]);
	const { user, setUser } = React.useContext(userContext);
	useEffect(() => {
		socket = io(process.env.REACT_APP_SOCKET_URL);
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
		socket.on('userInfo', (data: userType | unknownUserType) => {
			setUser(data);
		});
		socket.on('success', async (data: any) => {
			setIsAllBookFetched(data.isLast);
			console.log(data);
			setUser((prevUser: userType | unknownUserType) => {
				return {
					...prevUser,
					downloads: data.downloads,
				};
			});
			if (data.extension === 'epub') {
				const tempBooksLinks = bookLinks;
				const isLink = tempBooksLinks.find((book) => book.uid === data.uid);
				if (!isLink) {
					tempBooksLinks.push({
						name: `${data.title} by ${data.author}.epub`,
						buffer: data.buffer,
						uid: data.uid,
					});

					setBookLinks(tempBooksLinks);
				}
			}
			if (data.extension === 'html') {
				const tempBooksLinks = bookLinks;

				const isLink = tempBooksLinks.find((book) => book.uid === data.uid);
				if (!isLink) {
					tempBooksLinks.push({
						name: `${data.title} by ${data.author}.html`,
						buffer: data.buffer,
						uid: data.uid,
					});
					setBookLinks(tempBooksLinks);
				}
			}
		});
		socket.on('bookinfo', (data: bookType) => {
			console.log(data);
			if (cardContainer.current) {
				cardContainer.current.scrollIntoView({ behavior: 'smooth' });
				const tempBooks = books;
				const isBookExist = tempBooks.find(
					(book) => book.uid === data.uid && book.extension === data.extension,
				);

				if (!isBookExist) {
					tempBooks.push(data);
					setBooks(tempBooks);
					console.log(tempBooks);
					setCurrentPage(
						books.length % 2 === 0 ? books.length / 2 : (books.length + 1) / 2,
					);
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		setTimeout(() => {
			socket.emit('join', {
				...user,
			});
		}, 1000);
	}, [user]);

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
			setIsAllBookFetched(false);
		}
	};
	const sendBooktoEmail = () => {
		socket.emit('sendtoemail', {
			...getURLInfo(bookURL),
			extension,
		});
	};
	const sendDownloadedBookEmail = (bookInfo: bookType, buffer: Buffer) => {
		if (!forceUpdateEle.current) return;
		socket.emit('sendtoemail', {
			...getURLInfo(bookURL),
			extension,
			buffer,
			bookInfo,
			forceUpdate: forceUpdateEle.current.checked,
		});
	};
	const createZip = async () => {
		const zip = new JSZip();
		for (let bookLink of bookLinks) {
			zip.file(bookLink.name, bookLink.buffer, {});
		}
		const blob = await zip.generateAsync({ type: 'blob' });
		const anchor = document.createElement('a');
		anchor.href = URL.createObjectURL(blob);
		anchor.download = `books.zip`;
		anchor.click();
		document.body.removeChild(anchor);
		URL.revokeObjectURL(anchor.href);
	};
	return (
		<div>
			<Navbar />
			<FetchBookNavigation
				bookURL={bookURL}
				fetch={fetch}
				forceUpdateEle={forceUpdateEle}
				sendBooktoEmail={sendBooktoEmail}
				setBookURL={setBookURL}
				setExtension={setExtension}
				extension={extension}
			/>
			<Logs lastLog={lastLog} logs={logs} />
			<div className='card__container' ref={cardContainer}>
				{books.map((book, index) => {
					if (index < currentPage * 2 && index >= (currentPage - 1) * 2) {
						return (
							<Card
								key={index}
								book={book}
								link={bookLinks.find((link) => link.uid === book.uid)}
								sendDownloadedBookEmail={sendDownloadedBookEmail}
							/>
						);
					} else return <></>;
				})}
			</div>
			<BooksPageNavigation
				bookLength={books.length}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			{isAllBookFetched && (
				<div className=''>
					<button className='btn' onClick={createZip}>
						Download ALL
					</button>
				</div>
			)}
		</div>
	);
}
