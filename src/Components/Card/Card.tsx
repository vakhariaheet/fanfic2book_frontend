import moment from 'moment';
import React from 'react';
import { bookType } from '../../Interfaces';
import './Card.scss';

export interface CardProps {
	book: bookType;
	link?: {
		name: string;
		buffer: Buffer;
		uid: string;
	};
	sendDownloadedBookEmail: (bookInfo: bookType, buffer: Buffer) => void;
}

const Card: React.FC<CardProps> = ({ book, link, sendDownloadedBookEmail }) => {
	console.log(book);
	const download = () => {
		if (!link) return;
		const anchor = document.createElement('a');
		const blob = new Blob([link.buffer], { type: 'application/zip' });
		const url = URL.createObjectURL(blob);

		anchor.href = url;
		anchor.download = link.name;
		document.body.appendChild(anchor);
		anchor.click();

		document.body.removeChild(anchor);
		window.URL.revokeObjectURL(url);
	};

	return (
		<div className='card'>
			<div className='card--image'>
				<img src={book.cover} alt={book.title} />
			</div>
			<div className='card--content'>
				<h3>
					<a href={book.url} target='blank'>
						{book.title}
					</a>
					<span className='extension'>{book.extension.toUpperCase()}</span>
				</h3>
				<p>
					Author:{' '}
					<a href={book.authorUrl} target='blank'>
						{' '}
						{book.author}
					</a>
				</p>
				{book.words && <p>Word Count: {book.words} </p>}
				<p>Chapters:{book.chapterLength || 1} </p>
				<p>
					Publish : {moment(book.published, 'YYYY-MM-DD').format('Do MMM YYYY')}{' '}
				</p>
				<p>
					Last Updated :{' '}
					{moment(book.updated, 'YYYY-MM-DD').format('Do MMM YYYY')}{' '}
				</p>
				{book.fandom && <p>Fandom:{book.fandom} </p>}
				<p>Summary : </p>
				<p className='description' title={book.description}>
					{book.description.length > 200
						? book.description.substring(0, 200) + '...'
						: book.description}
				</p>
				{link && (
					<div className='btns'>
						<button className='btn' onClick={download}>
							Download
						</button>
						<button
							className='btn'
							onClick={() => sendDownloadedBookEmail(book, link.buffer)}
						>
							Send To Email
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Card;
