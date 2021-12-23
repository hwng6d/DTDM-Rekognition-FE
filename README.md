# DTDM-Rekognition-FE

<h2>FRONTEND PROJECT AMAZON REKOGNITION:</h2>
<h3>THÀNH VIÊN</h3>
<p>- Phạm Quốc Hưng 18110128</p>
<p>- Lê Phước Hưng 18110297</p>
<p>- Đặng Quốc Trung 18110220</p>
<h3>HƯỚNG DẪN SỬ DỤNG</h3>
<h4>Samples...</h4>
<p>{PORT}: 8000</p>
<p>{URL}: http://ec2-3-82-207-155.compute-1.amazonaws.com (có thể thay đổi do restart AWS CLI)</p>
<p>scripts: npm start</p>
<h4>API Routes...</h4>
<table>
  <thead>
    <tr>
      <td>STT</td>
      <td>Chức năng</td>
      <td>Mô tả</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Phát hiện vật thể</td>
      <td>Phát hiện các vật thể, bối cảnh, hành động và hiển thị số % chính xác</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Phát hiện văn bản</td>
      <td>Tự động phát hiện văn bản và trích xuất chúng ra từ ảnh của bạn</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Phát hiện gương mặt</td>
      <td>Lấy dữ liệu phân tích về các thuộc tính trên gương mặt và số % chính xác</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Nhận diện người nổi tiếng</td>
      <td>Nhận diện những người nổi tiếng trong hình ảnh và số % chính xác</td>
    </tr>
    <tr>
      <td>5</td>
      <td>So sánh các gương mặt</td>
      <td>So sánh các gương mặt trong 2 bức hình được truyền vào</td>
    </tr>
  </tbody>
</table>
<h4>Steps...</h4>
<p>Truy cập vào trang {URL} với {PORT}</p>
<p>Chọn chức năng</p>
<p>Chọn hình (có thể chọn 2 hình nếu chọn chức năng So sánh gương mặt)</p>
<p>Nhấn nút Upload to S3 để hệ thống upload hình vừa chọn lên Amazon S3</p>
<p>Nhấn nút chức năng (Phát hiện.../ So sánh...)</p>
<h4>Credits...</h4>
<p>1. Vẽ boundary cho mặt/ vật thể: github: https://github.com/sheep0317/CloudComputing/tree/main/public</p>
<p>2. Cách gắn API: https://console.aws.amazon.com/rekognition/home?region=us-east-1#/</p>
<p>3. Reactjs: Codevolution Reactjs Course</p>
