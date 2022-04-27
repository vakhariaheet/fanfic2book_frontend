import React, { useEffect } from 'react';
import './Verify.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
export interface VerifyProps {}

const Verify: React.FC<VerifyProps> = () => {
	// const token = useParams();
	const [user] = useSearchParams();
	const navigate = useNavigate();
	useEffect(() => {
		const token = user.get('token');
		axios({
			method: 'get',
			url: `${process.env.REACT_APP_API_URL}/verify?token=${token}`,
		}).then((res) => {
			if (res.status === 200) {
				console.log(res.data);
				navigate('/');
			}
		});
	}, []);
	console.log(user.get('token'));
	return <div className=''></div>;
};

export default Verify;
