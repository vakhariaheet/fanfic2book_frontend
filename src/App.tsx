import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { jwtContext } from './Contexts/jwtTokenContext';
import { userContext } from './Contexts/userContext';
import Index from './Pages/Index/Index';
import SignUp from './Pages/SignUp/SignUp';
import axios from 'axios';
import { encrypt } from './Utils/Encryption';
function App() {
	const [jwtToken, setJwtToken] = useState<string>('');
	const [user, setUser] = useState<
		| {
				name: string;
				ip: string;
				isUserLogin: true;
				email: string;
				downloads: number;
		  }
		| {
				ip: string;
				isUserLogin: false;
				downloads: number;
		  }
	>({
		ip: '',
		isUserLogin: false,
		downloads: 0,
	});
	useEffect(() => {
		axios.get('https://api.ipify.org/?format=json').then((res) => {
			setUser({
				ip: res.data.ip,
				isUserLogin: false,
				downloads: 0,
			});
			console.log(res.data);
		});
		// axios({
		// 	method: 'post',
		// 	url: 'http://localhost:5005/me',
		// 	headers: {
		// 		Authorization: `Bearer ${jwtToken}`,
		// 	},
		// 	data: {
		// 		ip: encrypt(user.ip),
		// 		isUserLogin: user.isUserLogin,
		// 	}
		// })
		console.log(process.env);
	}, []);
	return (
		<div className='App'>
			<userContext.Provider value={{ user, setUser }}>
				<jwtContext.Provider value={{ jwtToken, setJwtToken }}>
					<Routes>
						<Route path='/' element={<Index />} />
						<Route path='/signup' element={<SignUp />} />
					</Routes>
				</jwtContext.Provider>
			</userContext.Provider>
		</div>
	);
}

export default App;
