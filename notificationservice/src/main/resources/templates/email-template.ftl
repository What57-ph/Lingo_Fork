<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preps IELTS - Mã Xác thực OTP</title>
    <style>
        /* Reset cơ bản */
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body {
            background-color: #f4f7f6; /* Một màu xám nhạt, dịu mắt hơn */
            line-height: 1.6;
        }

        .container {
            max-width: 580px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px; /* Bo góc mềm mại hơn */
            padding: 40px; /* Tăng padding cho thoáng */
            border: 1px solid #e0e0e0; /* Thêm viền mỏng */
            box-shadow: 0 4px 12px rgba(0,0,0,0.05); /* Shadow nhẹ nhàng hơn */
        }

        /* Header & Logo */
        .header {
            text-align: center;
            padding-bottom: 20px;
        }

        .logo {
            font-size: 30px;
            font-weight: 700;
            color: #0052cc; /* Một màu xanh dương đậm, chuyên nghiệp */
            text-decoration: none;
        }

        /* Gợi ý: Nếu có ảnh logo, dùng thẻ <img> sẽ chuyên nghiệp hơn */
        /* .logo img { max-width: 150px; } */

        /* Content */
        .content {
            margin-top: 20px;
            font-size: 17px; /* Cỡ chữ dễ đọc hơn */
            color: #555555; /* Màu chữ xám đậm, dịu hơn màu đen */
            text-align: center; /* Căn giữa nội dung cho email ngắn */
        }

        .content p {
            margin-bottom: 25px;
        }

        /* OTP Code - Điểm nhấn chính */
        .otp-container {
            margin: 30px 0;
        }

        .otp {
            display: inline-block;
            padding: 16px 40px; /* To hơn, rõ hơn */
            font-size: 32px; /* Làm cho mã OTP thật sự nổi bật */
            font-weight: 600; /* Không cần quá đậm, 600 là vừa */
            color: #ffffff;
            background-color: #0052cc; /* Đồng bộ với màu logo */
            border-radius: 8px;
            letter-spacing: 4px; /* Giãn cách các ký tự cho dễ đọc */
        }

        /* Note / Chú thích */
        .note {
            font-size: 14px;
            color: #888888;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            font-size: 12px;
            color: #aaaaaa; /* Màu xám nhạt hơn cho footer */
            text-align: center;
            border-top: 1px solid #e0e0e0; /* Ngăn cách rõ ràng */
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <a href="#" class="logo">Preps IELTS</a>
    </div>

    <div class="content">
        <p>Xin chào <b>${email}</b>,</p>
        <p>Đây là mã xác thực của bạn tại <b>Preps IELTS</b>.</p>

        <div class="otp-container">
            <div class="otp">${code}</div>
        </div>

        <p class="note">Mã này sẽ hết hạn sau 15 phút.<br>Vui lòng không chia sẻ với bất kỳ ai.</p>
    </div>

    <div class="footer">
        &copy; 2025 Preps IELTS. All rights reserved.
    </div>
</div>
</body>
</html>