import React, { useContext, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { decrypt, encrypt } from '../../Utils/Encryption';
import { Verifier } from 'verifierjs';
import { useNavigate } from 'react-router-dom';
import './SignUp.scss';
import Header from '../../Components/Header/Header';
import { jwtContext } from '../../Contexts/jwtTokenContext';
import { userContext } from '../../Contexts/userContext';
export interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
	const [name, setName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const { setJwtToken } = useContext(jwtContext);
	const { user, setUser } = useContext(userContext);

	const navigate = useNavigate();
	const onSignUp = (e: any) => {
		if (
			!name ||
			!password ||
			!email ||
			!new Verifier(email).isEmail().correct
		) {
			alert('Please fill all the fields');
			return;
		}
		e.preventDefault();
		axios
			.post(`${process.env.REACT_APP_API_URL}/signup`, {
				nameCipher: encrypt(name, process.env.REACT_APP_ENCRIPTION_KEY),
				passwordCipher: encrypt(password, process.env.REACT_APP_ENCRIPTION_KEY),
				emailCipher: encrypt(email, process.env.REACT_APP_ENCRIPTION_KEY),
			})
			.then(
				(
					res: AxiosResponse<
						| {
								message: string;
								error: string;
						  }
						| {
								userid: string;
								name: string;
								token: string;
								message: 'User created successfully';
								email: string;
								ip: string;
						  }
					>,
				) => {
					if ('error' in res.data) {
						return console.log(res.status, res.data.error);
					}
					setJwtToken(res.data.token);
					setUser({
						name: decrypt(res.data.name, process.env.REACT_APP_ENCRIPTION_KEY),
						ip: decrypt(res.data.ip, process.env.REACT_APP_ENCRIPTION_KEY),
						isUserLogin: true,
						downloads: 0,
						userid: decrypt(
							res.data.userid,
							process.env.REACT_APP_ENCRIPTION_KEY,
						),
						email: decrypt(
							res.data.email,
							process.env.REACT_APP_ENCRIPTION_KEY,
						),
					});
					navigate('/', { replace: true, state: { user: user } });
				},
			);
	};
	return (
		<div>
			<Header padding='10.2rem 0 0 0 ' />
			<div className='signup--container'>
				<label>
					<input
						type='text'
						name='name'
						placeholder='Your Name'
						onChange={(e) => setName(e.target.value)}
						value={name}
						className='input'
					/>
				</label>
				<label>
					<input
						type='email'
						name='email'
						placeholder='Email'
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						className='input'
					/>
				</label>
				<label>
					<input
						type='password'
						name='password'
						placeholder='Password'
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						className='input'
					/>
				</label>
				<label>
					<input
						type='password'
						name='confirmpassword'
						placeholder='Confirm Password'
						onChange={(e) => setConfirmPassword(e.target.value)}
						value={confirmPassword}
						className='input'
					/>
				</label>
				<div className='signup__btn--container'>
					<button onClick={onSignUp} className='btn signup__btn'>
						Sign Up
					</button>
					<button className='btn signup__btn signup__btn--google '>
						Google
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
