import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import { motion, AnimatePresence } from 'framer-motion';
import '../components/Cards.scss';
import imgRekCompareFaces from '../images/img_rek_compareFaces.png';
import imgRekDetectCelebrity from '../images/img_rek_detectCelebrity.png';
import imgRekDetectFace from '../images/img_rek_detectFace.png';
import imgRekDetectLabel from '../images/img_rek_detectLabel.png';
import imgRekDetectText from '../images/img_rek_detectText.png';
import imgDefault from '../images/img_default.png';
import { FcCheckmark as IcMark } from 'react-icons/fc';

function Cards() {
	return (
		<div>
			<div className='wrapper'>
				<Card
					className='Detect-Label'
					id='detectLabels'
					img={imgRekDetectLabel}
					title='Phát hiện vật thể'
					description='Phát hiện các vật thể, bối cảnh, hành động và hiển thị số % chính xác'
				/>
				<Card
					className='Detect-Text'
					id='detectTexts'
					img={imgRekDetectText}
					title='Phát hiện văn bản'
					description='Tự động phát hiện văn bản và trích xuất chúng ra từ ảnh của bạn'
				/>
				<Card
					className='Detect-Face'
					id='detectFaces'
					img={imgRekDetectFace}
					title='Phát hiện gương mặt'
					description='Lấy dữ liệu phân tích về các thuộc tính trên gương mặt và số % chính xác'
				/>
				<Card
					className='Detect-Celebrity'
					id='detectCelebrities'
					img={imgRekDetectCelebrity}
					title='Nhận diện người nổi tiếng'
					description='Nhận diện những người nổi tiếng trong hình ảnh và số % chính xác'
				/>
				<Card
					className='Compare-Faces'
					id='compareFaces'
					img={imgRekCompareFaces}
					title='So sánh các gương mặt'
					description='So sánh các gương mặt trong 2 bức hình được truyền vào'
				/>
			</div>
		</div>
	);
}

function Card(props) {
	const { id, img, title, description } = props;

	const [isShowModal, setIsShowModal] = useState(false); //state of whether modal is showing

	const handleShowModalClick = () => setIsShowModal(true);
	const handleCloseModal = () => setIsShowModal(false);

	return (
		<div className='card'>
			<div className='card__body'>
				<div className='card__illustration'>
					<img src={img} className='card__image' alt='img_demo' />
				</div>
				<h2 className='card__title'>{title}</h2>
				<p className='card__description'>{description}</p>
			</div>
			<button onClick={handleShowModalClick} className='card__btn'>
				Thử ngay
			</button>
			{isShowModal ? (
				id !== 'compareFaces' ? (
					<Modal
						id={id}
						title={title}
						description={description}
						onCloseModal={handleCloseModal}>
						This is the secret modal message!
					</Modal>
				) : (
					<CompareModal
						id={id}
						title={title}
						description={description}
						onCloseModal={handleCloseModal}
					/>
				)
			) : null}
		</div>
	);
}

function Modal(props) {
	const { id, title, description, onCloseModal } = props;

	const myGeneralStyle = {
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

	const myModalStyle = {
		padding: 20,
		background: '#fff',
		borderRadius: '6px',
		display: 'inline-block',
		minHeight: 'auto',
		minWidth: '1100px',
		margin: '1rem',
		position: 'relative',
		boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
		justifySelf: 'center',
		padding: '32px',
	};

	const [image, setImage] = useState('img_default.png'); //state of whether image is chosen from computer
	const [imageName, setImageName] = useState(null); //state of whether imageName is set from s3 upload response
	const [preview, setPreview] = useState(null); //state of whether preview is set when image is chosen
	const [resultToJSX, setResultToJSX] = useState(null); //state of whether result (JSX) is set when clicked "Phát hiện..."
	const [isS3Uploaded, setIsS3Uploaded] = useState(null); //state of whether img is uploaded to s3 and display mark icon

	const handleImageChange = (e) => {
		e.preventDefault();
		console.log(e.target.files);

		let reader = new FileReader();
		let file = e.target.files[0];

		if (!file) {
			return;
		}

		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setImage(file);
			setPreview(reader.result);
		};

		setPreview(reader.result);
		setIsS3Uploaded(false);
	};

	const onFileUpload = async () => {
		if (!image) {
			console.log('Chưa có hình ảnh');
			return;
		}

		const fileForm = new FormData();
		fileForm.append('image', image);

		await axios
			.post(
				`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/upload`,
				fileForm
			)
			.then((res) => {
				console.log('success');
				console.log('res.data.image: ', res.data.image);
				setImageName(res.data.image);
				setIsS3Uploaded(
					'modal-body-content-req-upload-isUploaded-true'
				);
			})
			.catch((err) => {
				console.error('Error: ', err);
			});
	};

	const detectHandler = async () => {
		if (id === 'detectLabels') {
			await axios
				.post(
					`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/labels`,
					{ name: imageName }
				)
				.then((res) => {
					console.log(res.data.data.Labels);

					setResultToJSX(
						res.data.data.Labels.map((label, i) => {
							return (
								<tr key={i}>
									<td>{i + 1}</td>
									<td>{label.Name}</td>
									<td style={{ textAlign: 'center' }}>
										{Math.floor(label.Confidence)}
									</td>
								</tr>
							);
						})
					);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (id === 'detectTexts') {
			await axios
				.post(
					`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/texts`,
					{ name: imageName }
				)
				.then((res) => {
					//draw boudiry for image
					{
						let imageContainer = document.getElementById(
							'modal-body-content-req-preview'
						);

						res.data.data.TextDetections.forEach((face, index) => {
							let boudingBox =
								res.data.data.TextDetections[index].Geometry
									.BoundingBox;

							let image = document.getElementById(
								'modal-body-content-req-preview-img'
							);

							imageContainer.innerHTML += `<div class="modal-body-content-req-preview-boudiry" style="display:block;
													height:${boudingBox.Height * image.height}px;
													width:${boudingBox.Width * image.width}px;
													top:${boudingBox.Top * image.height}px;
													left:${boudingBox.Left * image.width}px;
													border:3px solid #DB6B97;"></div>`;
						});
					}

					setResultToJSX(
						res.data.data.TextDetections.map((text, i) => {
							if (text.Type === 'LINE') {
								return (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{text.DetectedText}</td>
										<td style={{ textAlign: 'center' }}>
											{Math.floor(text.Confidence)}
										</td>
									</tr>
								);
							}
						})
					);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (id === 'detectFaces') {
			await axios
				.post(
					`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/faces`,
					{ name: imageName }
				)
				.then((res) => {
					console.log(res.data.data.FaceDetails);

					{
						let imageContainer = document.getElementById(
							'modal-body-content-req-preview'
						);

						res.data.data.FaceDetails.forEach((face, index) => {
							let boudingBox =
								res.data.data.FaceDetails[index].BoundingBox;

							let image = document.getElementById(
								'modal-body-content-req-preview-img'
							);

							imageContainer.innerHTML += `<div class="modal-body-content-req-preview-boudiry" style="display:block;
													height:${boudingBox.Height * image.height}px;
													width:${boudingBox.Width * image.width}px;
													top:${boudingBox.Top * image.height}px;
													left:${boudingBox.Left * image.width}px;
													border:3px solid red;"></div>`;
						});
					}

					setResultToJSX(
						res.data.data.FaceDetails.map((facedetail, i) => {
							return (
								<tr key={i}>
									<td key={`${i}-stt`}>{i + 1}</td>
									<td key={`${i}-info`}>
										<p>Độ tuổi: </p>
										<p style={{ margin: '0px 8px' }}>
											Từ: {facedetail.AgeRange.Low} đến:{' '}
											{facedetail.AgeRange.High}
										</p>
										<p>
											Giới tính:
											{facedetail.Gender.Value ===
											'Female'
												? ' Nữ'
												: ' Nam'}
										</p>
										<p>Những cảm xúc: </p>
										{facedetail.Emotions.map(
											(emotion, index) => {
												if (emotion.Confidence >= 80) {
													return (
														<div>
															<p
																style={{
																	margin: '0px 8px',
																	display:
																		'inline-block',
																}}>
																{index + 1}.{' '}
																{emotion.Type}
															</p>
															<p
																style={{
																	margin: '0px 8px',
																	display:
																		'inline-block',
																}}>
																Độ chính xác:{' '}
																{Math.floor(
																	emotion.Confidence
																)}
															</p>
														</div>
													);
												}
											}
										)}
									</td>
									<td
										key={`${i}-confidence`}
										style={{ textAlign: 'center' }}>
										{Math.floor(facedetail.Confidence)}
									</td>
								</tr>
							);
						})
					);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (id === 'detectCelebrities') {
			await axios
				.post(
					`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/celeb`,
					{ name: imageName }
				)
				.then((res) => {
					//draw boudiry for image
					{
						let imageContainer = document.getElementById(
							'modal-body-content-req-preview'
						);

						res.data.data.CelebrityFaces.forEach((face, index) => {
							let boudingBox =
								res.data.data.CelebrityFaces[index].Face
									.BoundingBox;

							let image = document.getElementById(
								'modal-body-content-req-preview-img'
							);

							imageContainer.innerHTML += `<div class="modal-body-content-req-preview-boudiry" style="display:block;
													height:${boudingBox.Height * image.height}px;
													width:${boudingBox.Width * image.width}px;
													top:${boudingBox.Top * image.height}px;
													left:${boudingBox.Left * image.width}px;
													border:3px solid red;"></div>`;
						});
					}

					setResultToJSX(
						res.data.data.CelebrityFaces.map((celeb, i) => {
							return (
								<tr key={i}>
									<td>{i + 1}</td>
									<td>{celeb.Name}</td>
									<td style={{ textAlign: 'center' }}>
										{Math.floor(celeb.MatchConfidence)}
									</td>
								</tr>
							);
						})
					);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return ReactDOM.createPortal(
		<>
			<div className='modal-wrapper' style={myGeneralStyle}>
				<div className='modal' style={myModalStyle}>
					<div className='modal-header'>
						<h2 className='modal-header-title'>{title}</h2>
					</div>
					<div className='modal-body'>
						<p className='modal-body-description'>{description}</p>
						<div className='modal-body-content'>
							<div className='modal-body-content-req'>
								<h3 className='modal-body-content-req-header'>
									Chọn 1 bức hình
								</h3>
								{/* upload_bootstrap && save-to-s3_bootstrap */}
								<div className='modal-body-content-req-upload'>
									<input
										className='modal-body-content-req-upload-fromFile'
										type='file'
										onChange={(e) => handleImageChange(e)}
									/>
									<div
										className={`${isS3Uploaded} modal-body-content-req-upload-isUploaded`}>
										<IcMark size='32' />
									</div>
									<button
										onClick={onFileUpload}
										className='modal-body-content-req-upload-toS3'>
										<ion-icon
											className='icon-icon'
											name='cloud-upload-outline'
											style={{
												color: 'white',
												margin: '0px 8px',
											}}
											size='large'
										/>
										<p
											style={{
												display: 'inline-block',
												fontWeight: '600',
												fontSize: '14px',
											}}>
											Up to S3
										</p>
									</button>
								</div>
								{/* display-image-preview */}
								<div
									id='modal-body-content-req-preview'
									className='modal-body-content-req-preview'>
									<img
										id='modal-body-content-req-preview-img'
										className='modal-body-content-req-preview-img'
										src={preview ? preview : imgDefault}
										alt='preview'
									/>
								</div>
								<button
									className='modal-body-content-req-btn'
									onClick={() => detectHandler()}>
									{title}
								</button>
							</div>
							<hr style={{ border: '1px dashed black' }} />
							<div className='modal-body-content-res'>
								<h3 className='modal-body-content-res-header'>
									Kết quả
								</h3>
								<p className='modal-body-content-res-description'>
									Các kết quả được phát hiện:
								</p>
								{/* list-of-items_table */}
								<div className='modal-body-content-res-result'>
									<table className='modal-body-content-res-result-table'>
										<thead className='modal-body-content-res-result-table-head'>
											<tr>
												<th style={{ align: 'center' }}>
													STT
												</th>
												<th style={{ align: 'center' }}>
													{title}
												</th>
												<th style={{ align: 'center' }}>
													Độ chính xác
												</th>
											</tr>
										</thead>
										<tbody className='modal-body-content-res-result-table-body'>
											{resultToJSX ? (
												resultToJSX
											) : (
												<tr>
													<td
														key={`table-body`}
														colSpan={3}>
														...chưa có dữ liệu....
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button
							onClick={onCloseModal}
							className='modal-footer-button'>
							Đóng
						</button>
					</div>
				</div>
			</div>
		</>,
		document.getElementById('portal-root')
	);
}

function CompareModal(props) {
	const { id, title, description, onCloseModal } = props;

	const myGeneralStyle = {
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

	const myModalStyle = {
		padding: 20,
		background: '#fff',
		borderRadius: '6px',
		display: 'inline-block',
		minHeight: 'auto',
		minWidth: '1100px',
		margin: '1rem',
		position: 'relative',
		boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
		justifySelf: 'center',
		padding: '32px',
	};

	const [sourceImage, setSourceImage] = useState('img_default.png'); //state of whether image is chosen from computer
	const [targetImage, setTargetImage] = useState('img_default.png'); //state of whether image is chosen from computer

	const [sourceImageName, setSourceImageName] = useState(null); //state of whether imageName is set from s3 upload response
	const [targetImageName, setTargetImageName] = useState(null); //state of whether imageName is set from s3 upload response

	const [sourcePreview, setSourcePreview] = useState(null); //state of whether preview is set when image is chosen
	const [targetPreview, setTargetPreview] = useState(null);

	const [isSourceS3Uploaded, setIsSourceS3Uploaded] = useState(null); //state of whether img is uploaded to s3 and display mark icon
	const [isTargetS3Uploaded, setIsTargetS3Uploaded] = useState(null);

	const [resultToJSX, setResultToJSX] = useState(null); //state of whether result (JSX) is set when clicked "Phát hiện..."

	const handleImageChange = (e, where) => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		if (!file) {
			return;
		}

		if (where === 'source') {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setSourceImage(file);
				setSourcePreview(reader.result);
				setIsSourceS3Uploaded(false);
			};
		} else {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setTargetImage(file);
				setTargetPreview(reader.result);
				setIsTargetS3Uploaded(false);
			};
		}
	};

	const onFileUpload = async (img, where) => {
		if (!img) {
			console.log('Chưa có hình ảnh');
			return;
		}

		const fileForm = new FormData();
		fileForm.append('image', img);

		await axios
			.post(
				`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/upload`,
				fileForm
			)
			.then((res) => {
				console.log('success');
				console.log('res.data.image: ', res.data.image);

				if (where === 'source') {
					setSourceImageName(res.data.image);
					setIsSourceS3Uploaded(
						'modal-body-content-req-upload-isUploaded-true'
					);
				} else {
					setTargetImageName(res.data.image);
					setIsTargetS3Uploaded(
						'modal-body-content-req-upload-isUploaded-true'
					);
				}
			})
			.catch((err) => {
				console.error('Error: ', err);
			});
	};

	const compareHandler = async () => {
		axios
			.post(
				`http://ec2-52-91-18-17.compute-1.amazonaws.com:5000/api/compare`,
				{
					name: sourceImageName,
					img: targetImageName,
				}
			)
			.then((res) => {
				//draw boudiry for target
				{
					let imageContainer = document.getElementById(
						'modal-body-content-req-preview-compare-2'
					);

					res.data.data.FaceMatches.forEach((face, index) => {
						let boudingBox =
							res.data.data.FaceMatches[index].Face.BoundingBox;

						let image = document.getElementById(
							'modal-body-content-req-preview-img-compare-2'
						);

						imageContainer.innerHTML += `<div class="modal-body-content-req-preview-boudiry" style="display:block;
													height:${boudingBox.Height * image.height}px;
													width:${boudingBox.Width * image.width}px;
													top:${boudingBox.Top * image.height}px;
													left:${boudingBox.Left * image.width}px;
													border:3px solid red;"></div>`;
					});
				}
				//draw boudiry for source
				{
					let imageContainer = document.getElementById(
						'modal-body-content-req-preview-compare-1'
					);

					let boudingBox = res.data.data.SourceImageFace.BoundingBox;

					let image = document.getElementById(
						'modal-body-content-req-preview-img'
					);

					imageContainer.innerHTML += `<div class="modal-body-content-req-preview-boudiry" style="display:block;
													height:${boudingBox.Height * image.height}px;
													width:${boudingBox.Width * image.width}px;
													top:${boudingBox.Top * image.height}px;
													left:${boudingBox.Left * image.width}px;
													border:3px solid red;"></div>`;
				}

				let countSameFace = 0;
				res.data.data.FaceMatches.forEach((face, index) => {
					if (face.Similarity >= 80) countSameFace++;
				});

				setResultToJSX(
					<div>
						<p>Có {countSameFace} khuôn mặt giống với hình nguồn</p>
					</div>
				);
			});
	};

	return ReactDOM.createPortal(
		<>
			<div className='modal-wrapper' style={myGeneralStyle}>
				<div className='modal' style={myModalStyle}>
					<div className='modal-header'>
						<h2 className='modal-header-title'>{title}</h2>
					</div>
					<div className='modal-body'>
						<p className='modal-body-description'>{description}</p>
						<div className='modal-body-content'>
							<div className='modal-body-content-req'>
								<div className='modal-body-content-req-display'>
									<div
										className='modal-body-content-req-1'
										style={{
											display: 'inline-block',
											marginRight: '32px',
										}}>
										<h3 className='modal-body-content-req-header'>
											Chọn 1 bức hình nguồn
										</h3>
										{/* upload_bootstrap && save-to-s3_bootstrap */}
										<div className='modal-body-content-req-upload'>
											<input
												className='modal-body-content-req-upload-fromFile'
												type='file'
												onChange={(e) =>
													handleImageChange(
														e,
														'source'
													)
												}
											/>
											<div
												className={`${isSourceS3Uploaded} modal-body-content-req-upload-isUploaded`}>
												<IcMark size='32' />
											</div>
											<button
												onClick={() =>
													onFileUpload(
														sourceImage,
														'source'
													)
												}
												className='modal-body-content-req-upload-toS3'>
												<ion-icon
													className='icon-icon'
													name='cloud-upload-outline'
													style={{
														color: 'white',
														margin: '0px 8px',
													}}
													size='large'
												/>
												<p
													style={{
														display: 'inline-block',
														fontWeight: '600',
														fontSize: '14px',
													}}>
													Up to S3
												</p>
											</button>
										</div>
										{/* display-image-preview */}
										<div
											id='modal-body-content-req-preview-compare-1'
											className='modal-body-content-req-preview  modal-body-content-req-preview-compare-1'>
											<img
												id='modal-body-content-req-preview-img'
												className='modal-body-content-req-preview-img'
												src={
													sourcePreview
														? sourcePreview
														: imgDefault
												}
												alt='preview'
											/>
										</div>
									</div>
									<div
										className='modal-body-content-req-2'
										style={{ display: 'inline-block' }}>
										<h3 className='modal-body-content-req-header'>
											Chọn 1 bức hình đích
										</h3>
										{/* upload_bootstrap && save-to-s3_bootstrap */}
										<div className='modal-body-content-req-upload'>
											<input
												className='modal-body-content-req-upload-fromFile'
												type='file'
												onChange={(e) =>
													handleImageChange(
														e,
														'target'
													)
												}
											/>
											<div
												className={`${isTargetS3Uploaded} modal-body-content-req-upload-isUploaded`}>
												<IcMark size='32' />
											</div>
											<button
												onClick={() =>
													onFileUpload(
														targetImage,
														'target'
													)
												}
												className='modal-body-content-req-upload-toS3'>
												<ion-icon
													className='icon-icon'
													name='cloud-upload-outline'
													style={{
														color: 'white',
														margin: '0px 8px',
													}}
													size='large'
												/>
												<p
													style={{
														display: 'inline-block',
														fontWeight: '600',
														fontSize: '14px',
													}}>
													Up to S3
												</p>
											</button>
										</div>
										{/* display-image-preview */}
										<div
											id='modal-body-content-req-preview-compare-2'
											className='modal-body-content-req-preview modal-body-content-req-preview-compare-2'>
											<img
												id='modal-body-content-req-preview-img-compare-2'
												className='modal-body-content-req-preview-img'
												src={
													targetPreview
														? targetPreview
														: imgDefault
												}
												alt='preview'
											/>
										</div>
									</div>
								</div>
								<button
									className='modal-body-content-req-btn'
									onClick={() => compareHandler()}>
									{title}
								</button>
							</div>

							<hr style={{ border: '1px dashed black' }} />
							<div className='modal-body-content-res'>
								<h3 className='modal-body-content-res-header'>
									Kết quả
								</h3>
								<p className='modal-body-content-res-description'>
									Các kết quả được phát hiện:
								</p>
								{/* list-of-items_table */}
								<div className='modal-body-content-res-result'>
									{resultToJSX}
								</div>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button
							onClick={onCloseModal}
							className='modal-footer-button'>
							Đóng
						</button>
					</div>
				</div>
			</div>
		</>,
		document.getElementById('portal-root')
	);
}

export default Cards;
