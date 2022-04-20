import React from 'react';
import './Header.scss';

export interface HeaderProps {
	padding?: string;
}

const Header: React.FC<HeaderProps> = ({ padding }) => {
	return (
		<div className='' style={{ padding }}>
			<h1 className='header'>FanFic2Book</h1>
		</div>
	);
};

export default Header;
