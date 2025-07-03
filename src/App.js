import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation
} from 'react-router-dom';
import './App.css';

const roles = [
  { key: 'newbie', label: '新人' },
  { key: 'manager', label: '管理' },
  { key: 'pro', label: '专业' }
];

const learningPaths = {
  newbie: [
    { id: 1, name: '入门介绍', detail: '这里是新人入门介绍的详细知识。' },
    { id: 2, name: '基础技能', detail: '这里是新人基础技能的详细知识。' }
  ],
  manager: [
    { id: 1, name: '管理基础', detail: '这里是管理基础的详细知识。' },
    { id: 2, name: '团队协作', detail: '这里是团队协作的详细知识。' }
  ],
  pro: [
    { id: 1, name: '专业进阶', detail: '这里是专业进阶的详细知识。' },
    { id: 2, name: '项目实战', detail: '这里是项目实战的详细知识。' }
  ]
};

// 假设知识地图和详细知识为简单 mock
const knowledgeMap = {
  ECS: {
    map: 'ECS知识地图示意图',
    detail: 'ECS（弹性计算服务）是一种云服务器产品，支持弹性伸缩、高可用等特性。这里是ECS的详细知识内容。'
  },
  default: {
    map: '暂无知识地图',
    detail: '暂无详细知识内容。'
  }
};

function Topbar() {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <button className="home-btn" onClick={() => navigate('/')}>主页</button>
    </div>
  );
}

function Sidebar({ onRoleClick }) {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-header">选择你的角色路径</div>
      <div className="role-list">
        {roles.map(role => (
          <button
            className="role-btn"
            key={role.key}
            onClick={() => onRoleClick ? onRoleClick(role.key) : navigate(`/role/${role.key}`)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.includes('新人')) {
      navigate('/role/newbie');
    } else if (search.includes('管理')) {
      navigate('/role/manager');
    } else if (search.includes('专业')) {
      navigate('/role/pro');
    } else if (search.trim() !== '') {
      navigate(`/search/${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container stylish-bg">
      <Topbar />
      <Sidebar />
      <div className="main">
        <div className="title">小云</div>
        <div className="search-section">
          <input
            className="search-input"
            type="text"
            placeholder="搜索框"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleSearch}>确定</button>
        </div>
        <div className="search-tip-box">
          1.如搜索角色相关内容则弹出角色路径，2.如搜索知识相关内容则弹出知识地图。
        </div>
      </div>
    </div>
  );
}

function RolePage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const modules = learningPaths[role] || [];
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    setSelectedModule(null);
  }, [role]);

  return (
    <div className="container stylish-bg">
      <Topbar />
      <Sidebar onRoleClick={r => navigate(`/role/${r}`)} />
      <div className="learning-path-area">
        <div className="area-title">学习路径区域</div>
        <div className="modules-list">
          {modules.map(m => (
            <div
              className={`module-card${selectedModule && selectedModule.id === m.id ? ' selected' : ''}`}
              key={m.id}
              onClick={() => setSelectedModule(m)}
            >
              {m.name}
            </div>
          ))}
        </div>
      </div>
      <div className="knowledge-area">
        <div className="area-title">知识呈现区域</div>
        <div className="knowledge-content">
          {selectedModule ? selectedModule.detail : '请点击左侧学习模块查看详细知识'}
        </div>
      </div>
    </div>
  );
}

function KnowledgeMapPage() {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const searchKey = decodeURIComponent(keyword || '');
  const searchKeyUpper = searchKey.toUpperCase();
  const mapData = knowledgeMap[searchKeyUpper];

  return (
    <div className="container stylish-bg">
      <Topbar />
      <Sidebar onRoleClick={r => navigate(`/role/${r}`)} />
      <div className="learning-path-area">
        <div className="area-title">知识地图区域</div>
        <div className="knowledge-map-content">
          {mapData ? mapData.map : `${searchKey} 的知识地图`}
        </div>
      </div>
      <div className="knowledge-area">
        <div className="area-title">知识呈现区域</div>
        <div className="knowledge-content">
          {mapData ? mapData.detail : `${searchKey} 的详细知识内容。`}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/role/:role" element={<RolePage />} />
        <Route path="/search/:keyword" element={<KnowledgeMapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
