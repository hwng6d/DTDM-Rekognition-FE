import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FcCheckmark as IcMark } from 'react-icons/fc';
import { GrClose as IcUnMark } from 'react-icons/gr';
import '../components/FloatingBar.scss';

function FloatingBar() {
	const [amazonCLI, setAmazonCLI] = useState({});
	const [isShowModal, setIsShowModal] = useState(false);

	const cliHandler = () => setIsShowModal(true);
	const handleCloseModal = () => setIsShowModal(false);

	return (
		<div>
			<div className='floatingbar'>
				<IcUnMark
					size='24'
					className='floatingbar-iconframe'
					onClick={() => cliHandler()}></IcUnMark>
				<div className='floatingbar-content'>
					<p style={{ lineHeight: '1.5' }}>
						Dường như bạn chưa cấu hình AWS CLI
						<br />
						Bấm vào nút bên trái để cấu hình
					</p>
				</div>
				{isShowModal ? (
					<Modal onCloseModal={handleCloseModal}></Modal>
				) : null}
			</div>
		</div>
	);
}

function Modal(props) {
	const { onCloseModal } = props;

	const wrapperStyle = {
		position: 'fixed',
		top: '0',
		bottom: '0',
		left: '0',
		right: '0',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.4)',
	};

	const modalStyle = {
		padding: 20,
		background: '#fff',
		borderRadius: '6px',
		display: 'inline-block',
		minHeight: 'auto',
		minWidth: '550px',
		margin: '1rem',
		position: 'relative',
		boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
		justifySelf: 'center',
		padding: '32px',
	};

	const [accessKeyId, setAccessKeyId] = useState('');
	const [secretAccessKey, setSecretAccessKey] = useState('');
	const [sessionToken, setSessionToken] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();

		const cliInfo = { accessKeyId, secretAccessKey, sessionToken };
		console.log('cliInfo: ', cliInfo);

		await axios
			.post(
				//'http://ec2-3-82-207-155.compute-1.amazonaws.com:5000/api/setCLI',
				`http://ec2-3-82-207-155.compute-1.amazonaws.com:5000/api/setCLI`,
				cliInfo
			)
			.then((res) => {
				console.log('sent cli!');
			})
			.catch((err) => {
				console.log('error: ', err);
			});
	};

	return ReactDOM.createPortal(
		<div className='cli-modal-wrapper' style={wrapperStyle}>
			<div style={modalStyle} className='cli-modal'>
				{/* title */}
				<h2 className='cli-modal-title'>AWS CLI</h2>
				{/* description */}
				<p className='cli-modal-description'>Cấu hình AWS CLI</p>
				{/* body */}
				<form onSubmit={submitHandler}>
					<div className='cli-modal-body'>
						<div
							className='cli-modal-body-accesskeyid'
							style={{ display: 'block' }}>
							<label htmlFor='aws_access_key_id'>
								aws_access_key_id
							</label>
							<input
								type='text'
								id='aws_access_key_id'
								name='aws_access_key_id'
								value={accessKeyId}
								onChange={(e) => setAccessKeyId(e.target.value)}
								placeholder='Your access key id...'></input>
						</div>
						<div
							className='cli-modal-body-secretaccesskey'
							style={{ display: 'block' }}>
							<label htmlFor='aws_secret_access_key'>
								aws_secret_access_key
							</label>
							<input
								type='text'
								id='aws_secret_access_key'
								name='aws_secret_access_key'
								value={secretAccessKey}
								onChange={(e) =>
									setSecretAccessKey(e.target.value)
								}
								placeholder='Your secret access key...'></input>
						</div>
						<div
							className='cli-modal-body-sessiontoken'
							style={{ display: 'block' }}>
							<label htmlFor='aws_session_token'>
								aws_session_token
							</label>
							<input
								type='text'
								id='aws_session_token'
								name='aws_session_token'
								value={sessionToken}
								onChange={(e) =>
									setSessionToken(e.target.value)
								}
								placeholder='Your session token...'></input>
						</div>
					</div>
					{/* footer */}
					<div className='cli-modal-footer'>
						<button
							type='button'
							onClick={onCloseModal}
							className='cli-modal-footer-closebutton'>
							Đóng
						</button>
						<button
							type='submit'
							className='cli-modal-footer-acceptbutton'>
							Đồng ý
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.getElementById('aws-portal')
	);
}

export default FloatingBar;
