import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { jwtContext } from './Contexts/jwtTokenContext';
import { userContext } from './Contexts/userContext';
import Index from './Pages/Index/Index';
import SignUp from './Pages/SignUp/SignUp';
import axios from 'axios';
import { decrypt } from './Utils/Encryption';
import useLocalStorage from './Hooks/useLocalStorage';
import { unknownUserType, userType } from './Interfaces';
import Verify from './Components/Verify/Verify';
function App() {
	const [jwtToken, setJwtToken] = useLocalStorage('fanfic2book-jwt-token', '');
	const [user, setUser] = useState<userType | unknownUserType>({
		isUserLogin: false,
		downloads: 0,
	});
	useEffect(() => {
		axios.get('https://api.ipify.org/?format=json').then((res) => {
			setUser((prevUser) => ({
				...prevUser,
				ip: res.data.ip,
			}));
			console.log(res.data);
		});
		axios({
			method: 'get',
			url: `${process.env.REACT_APP_API_URL}/me`,
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		}).then((res) => {
			console.log(res.data);
			setUser((prevUser) => ({
				name: decrypt(res.data.name, process.env.REACT_APP_ENCRIPTION_KEY),
				isUserLogin: true,
				downloads: res.data.downloads,
				deviceID: res.data.deviceID,
				email: decrypt(res.data.email, process.env.REACT_APP_ENCRIPTION_KEY),
				userid: res.data.userid,
			}));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='App'>
			<userContext.Provider value={{ user, setUser }}>
				<jwtContext.Provider value={{ jwtToken, setJwtToken }}>
					<Routes>
						<Route path='/' element={<Index />} />
						<Route path='/signup' element={<SignUp />} />
						<Route path='/verify' element={<Verify />} />
					</Routes>
				</jwtContext.Provider>
			</userContext.Provider>
		</div>
	);
}

export default App;
