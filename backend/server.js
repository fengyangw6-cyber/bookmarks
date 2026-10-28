const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json()); // 解析前端传来的 JSON 数据

// 健康检查接口 (用来测试服务是否正常)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '书签管理器后端服务正常运行' });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
});