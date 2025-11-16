<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng ${username}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .welcome-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 500px;
            text-align: center;
        }
        .welcome-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }
        .logo {
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .username {
            color: #667eea;
            font-weight: bold;
        }
        .info-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            text-align: left;
        }
        .info-item {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            width: 100px;
        }
        .info-value {
            color: #333;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
<div class="welcome-container">
    <div class="logo">PREP IELTS</div>
    <div class="welcome-icon">👋</div>
    <h1>Chào mừng, <span class="username">${username}</span>!</h1>
    <p>Cảm ơn bạn đã tham gia cùng Prep IELTS.</p>

    <div class="info-box">
        <div class="info-item">
            <span class="info-label">Tên người dùng:</span>
            <span class="info-value">${username}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">${email}</span>
        </div>
    </div>

    <a href="#" class="btn">Bắt đầu</a>
</div>
</body>
</html>