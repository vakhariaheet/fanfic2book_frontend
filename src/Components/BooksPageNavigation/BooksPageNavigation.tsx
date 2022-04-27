import React from 'react';
import './BooksPageNavigation.scss';

export interface BooksPageNavigationProps {
	bookLength: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

const BooksPageNavigation: React.FC<BooksPageNavigationProps> = ({
	bookLength,
	currentPage,
	setCurrentPage,
}) => {
	const getTotalPages = (): number => {
		if (bookLength === 0) return 0;
		return bookLength % 2 === 0 ? bookLength / 2 : (bookLength + 1) / 2;
	};
	return (
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
	);
};

export default BooksPageNavigation;
