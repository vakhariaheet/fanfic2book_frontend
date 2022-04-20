import moment from 'moment';
import React from 'react';
import { bookType } from '../../Interfaces';
import './Card.scss';

export interface CardProps {
	book: bookType;
	link?: {
		name: string;
		link: string;
		uid: string;
	};
}

const Card: React.FC<CardProps> = ({ book, link }) => {
	console.log(link);
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
				<p>Chapters:{book.chapters || 1} </p>
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
						<a className='btn' download={`${link.name}`} href={`${link.link}`}>
							Download
						</a>
						<button className='btn'>Send To Email</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Card;
