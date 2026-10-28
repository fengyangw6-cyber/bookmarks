const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json()); // 解析前端传来的 JSON 数据

// ========== API 路由 ==========

// 1. 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '书签管理器后端服务正常运行' });
});

// 2. 获取书签列表 (支持搜索)
app.get('/api/bookmarks', (req, res) => {
  const { q } = req.query; // 获取搜索关键词
  let stmt;
  let bookmarks;

  if (q) {
    // 如果有关键词，模糊搜索标题、URL或标签
    stmt = db.prepare('SELECT * FROM bookmarks WHERE title LIKE ? OR url LIKE ? OR tags LIKE ? ORDER BY created_at DESC');
    bookmarks = stmt.all(`%${q}%`, `%${q}%`, `%${q}%`);
  } else {
    // 没关键词，返回全部
    stmt = db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC');
    bookmarks = stmt.all();
  }
  
  res.json(bookmarks);
});

// 3. 添加书签
app.post('/api/bookmarks', (req, res) => {
  const { title, url, tags } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: '标题和 URL 不能为空' });
  }

  const stmt = db.prepare('INSERT INTO bookmarks (title, url, tags) VALUES (?, ?, ?)');
  const info = stmt.run(title, url, tags || '');
  
  res.status(201).json({ id: info.lastInsertRowid, message: '添加成功' });
});

// 4. 修改书签
app.put('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, tags } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: '标题和 URL 不能为空' });
  }

  const stmt = db.prepare('UPDATE bookmarks SET title = ?, url = ?, tags = ? WHERE id = ?');
  const info = stmt.run(title, url, tags || '', id);

  if (info.changes === 0) {
    return res.status(404).json({ error: '未找到该书签' });
  }
  
  res.json({ message: '修改成功' });
});

// 5. 删除书签
app.delete('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('DELETE FROM bookmarks WHERE id = ?');
  const info = stmt.run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: '未找到该书签' });
  }

  res.json({ message: '删除成功' });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
});