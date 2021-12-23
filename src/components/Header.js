import React from 'react';
import logoSchool from '../images/logo_school.png';
import logoAWSRekognition from '../images/logo_aws_rekognition.png';
import '../components/Header.css';

function Header() {
	const myStyleLogoSchool = {
		width: '56px',
		marginLeft: '16px',
	};
	const myStyleLogoAWSRek = {
		width: '160px',
		marginLeft: '156px',
	};

	return (
		<div className='Header'>
			<img
				className='School-display'
				style={myStyleLogoSchool}
				src={logoSchool}
				alt='logo'
			/>

			<img
				className='Project-display'
				src={logoAWSRekognition}
				style={myStyleLogoAWSRek}
				alt='AWS Logo'
			/>

			<div className='Course-display'>ĐIỆN TOÁN ĐÁM MÂY</div>
		</div>
	);
}

export default Header;
