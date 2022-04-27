import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { jwtContext } from '../../Contexts/jwtTokenContext';
import { userContext } from '../../Contexts/userContext';
import './Navbar.scss';

export interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { user } = useContext(userContext);
	const { jwtToken } = useContext(jwtContext);
	const [isDropdownHover, setIsDropDownHover] = React.useState<boolean>(false);
	const onLogOut = () => {
		axios({
			method: 'post',
			url: `${process.env.REACT_APP_API_URL}/logout`,
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		}).then(console.log);
		console.log(jwtToken);
	};
	return (
		<nav className=''>
			<input type='checkbox' id='mode' />
			<label htmlFor='mode'>
				<div className='toggle'>
					<div className='toggle-btn'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 512.000000 512.000000'
							preserveAspectRatio='xMidYMid meet'
						>
							<g
								transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
								fill='#fff'
								stroke='none'
							>
								<path
									d='M2495 5106 c-39 -18 -70 -48 -92 -89 -16 -29 -18 -65 -18 -339 l0
-306 30 -43 c37 -52 86 -79 145 -79 59 0 108 27 145 79 l30 43 0 306 c0 302 0
308 -23 347 -44 78 -145 115 -217 81z'
								/>
								<path
									d='M792 4399 c-95 -47 -123 -156 -64 -251 11 -18 110 -121 219 -229 147
-145 208 -199 236 -208 136 -45 267 92 217 226 -16 41 -416 441 -465 464 -52
24 -90 24 -143 -2z'
								/>
								<path
									d='M4185 4401 c-49 -23 -449 -424 -465 -464 -24 -65 -5 -141 46 -189 50
-47 96 -57 169 -37 31 9 79 50 238 208 109 108 210 215 224 238 85 144 -64
316 -212 244z'
								/>
								<path
									d='M2440 3840 c-611 -55 -1102 -551 -1160 -1172 -41 -453 183 -918 567
-1174 543 -361 1262 -265 1679 224 186 218 288 457 313 734 65 699 -462 1322
-1174 1388 -60 5 -117 9 -125 9 -8 -1 -53 -5 -100 -9z m383 -384 c316 -95 536
-314 634 -633 25 -81 27 -101 27 -263 0 -162 -2 -182 -27 -263 -51 -166 -134
-304 -248 -413 -110 -104 -230 -173 -386 -221 -81 -25 -101 -27 -263 -27 -162
0 -182 2 -263 27 -319 98 -536 315 -634 634 -25 81 -27 101 -27 263 0 162 2
182 27 263 106 345 353 572 708 652 45 10 108 14 214 11 127 -3 164 -8 238
-30z'
								/>
								<path
									d='M144 2731 c-17 -4 -44 -16 -60 -25 -112 -66 -104 -244 13 -302 35
-17 63 -19 345 -19 l306 0 43 30 c52 37 79 86 79 145 0 59 -27 108 -79 145
l-43 30 -286 2 c-158 1 -301 -2 -318 -6z'
								/>
								<path
									d='M4383 2731 c-77 -19 -133 -92 -133 -173 0 -57 27 -106 79 -143 l43
-30 306 0 c302 0 308 0 347 23 61 35 90 84 90 152 0 68 -29 117 -90 152 -39
22 -47 23 -325 25 -157 1 -300 -2 -317 -6z'
								/>
								<path
									d='M1181 1408 c-42 -12 -419 -379 -458 -445 -62 -106 -1 -240 120 -260
73 -12 99 7 326 231 117 116 219 225 227 243 27 63 14 135 -34 187 -49 52
-107 66 -181 44z'
								/>
								<path
									d='M3800 1398 c-77 -39 -114 -121 -90 -201 10 -34 50 -81 218 -251 254
-256 289 -276 392 -224 77 39 114 121 90 201 -10 34 -50 81 -218 251 -254 256
-289 276 -392 224z'
								/>
								<path
									d='M2480 851 c-19 -10 -48 -37 -65 -60 l-30 -43 0 -306 c0 -302 0 -308
23 -347 35 -61 84 -90 152 -90 68 0 117 29 152 90 23 39 23 45 23 347 l0 306
-30 43 c-37 52 -86 79 -145 79 -25 0 -61 -8 -80 -19z'
								/>
							</g>
						</svg>
					</div>
				</div>
			</label>
			<div className='menu'>
				<div
					className='navbar--dropdown'
					style={{
						border: isDropdownHover
							? '1px solid #212121'
							: '1px solid transparent',
					}}
				>
					{!user.isUserLogin ? (
						<div
							className='downloads'
							onClick={() => setIsDropDownHover((preValue) => !preValue)}
						>
							<span>Downloads : </span>
							<span className='user-downloads'>{user.downloads}</span>
							<span className='total-downloads'> / 5</span>
						</div>
					) : (
						<div
							className='navbar--user'
							onClick={() => setIsDropDownHover((preValue) => !preValue)}
						>
							Hello {user.name.split(' ')[0]}
						</div>
					)}
					{isDropdownHover && (
						<div className='navbar--dropdown--content'>
							{user.isUserLogin ? (
								<>
									<div className='navbar--dropdown--content--item'>
										<Link to='/setting' className='nav--link'>
											Setting
										</Link>
									</div>
									<div className='navbar--dropdown--content--item'>
										<Link to='/favourites' className='nav--link'>
											My Favourites
										</Link>
									</div>
									<div className='navbar--dropdown--content--item'>
										<Link to='/downloads' className='nav--link'>
											My Downloads
										</Link>
									</div>
									<div className='navbar--dropdown--content--item'>
										<Link to='/' className='nav--btn danger' onClick={onLogOut}>
											Logout
										</Link>
									</div>
								</>
							) : (
								<>
									<div className='info navbar--dropdown--content--item'>
										Sign Up Now to Access Premium features for free{' '}
									</div>
									<div className='navbar--dropdown--content--item'>
										<Link to='/signup' className='nav--btn'>
											Sign Up
										</Link>
									</div>
								</>
							)}
						</div>
					)}
				</div>

				<div className='nav--link'></div>
			</div>
		</nav>
	);
};

export default Navbar;
