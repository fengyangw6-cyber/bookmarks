import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  // 1. 获取数据的方法
  const fetchBookmarks = () => {
    fetch('http://localhost:3000/api/bookmarks')
      .then(res => res.json())
      .then(data => setBookmarks(data))
      .catch(err => console.error("请求失败:", err));
  };

  // 页面加载时获取一次
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // 2. 添加书签的方法
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单刷新页面
    if (!title || !url) return alert('标题和链接不能为空！');

    fetch('http://localhost:3000/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, tags })
    })
    .then(res => res.json())
    .then(() => {
      // 添加成功后，清空输入框，并重新获取列表
      setTitle('');
      setUrl('');
      setTags('');
      fetchBookmarks();
    })
    .catch(err => console.error("添加失败:", err));
  };

  return (
    <div className="container">
      <header>
        <h1>📚 我的书签管理器</h1>
        <p>当前共有 {bookmarks.length} 个书签。</p>
      </header>

      {/* 添加表单 */}
      <form className="add-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="网站标题 (必填)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          type="url" 
          placeholder="网址 URL (必填) e.g. https://..." 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="标签 (用逗号分隔)" 
          value={tags} 
          onChange={e => setTags(e.target.value)} 
        />
        <button type="submit">添加书签</button>
      </form>

      {/* 书签列表 */}
      <div className="bookmark-list">
        {bookmarks.map(bm => (
          <div key={bm.id} className="bookmark-card">
            <h3>{bm.title}</h3>
            <a href={bm.url} target="_blank" rel="noreferrer">{bm.url}</a>
            
            {/* 渲染标签 */}
            {bm.tags && (
              <div className="tags">
                {bm.tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;