const Database = require('better-sqlite3');
const path = require('path');

// 数据库文件会保存在 backend 目录下的 bookmarks.db
const db = new Database(path.join(__dirname, 'bookmarks.db'));

// 初始化建表
db.exec(`
  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    tags TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('数据库表初始化完成');
module.exports = db;