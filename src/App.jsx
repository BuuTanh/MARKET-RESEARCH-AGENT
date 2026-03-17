import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Target, 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  Bot, 
  Send, 
  CheckCircle2, 
  Mail,
  Zap,
  BarChart3,
  Globe,
  PieChart as PieIcon,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

/* --- Knowledge Base (AI Intelligence Brain) --- */
const STRATEGY_BRAIN = {
  TOFU: {
    goal: "Nâng cao nhận thức (Awareness)",
    content: ["Blog review", "Infographic", "Video hướng dẫn cơ bản"],
    keywords: ["là gì", "cách làm", "review", "so sánh"]
  },
  MOFU: {
    goal: "Cân nhắc & Đánh giá (Consideration)",
    content: ["Case study", "Webinar", "Bảng so sánh tính năng"],
    keywords: ["tốt nhất", "giá", "hiệu quả", "hỗ trợ"]
  },
  BOFU: {
    goal: "Chốt đơn (Conversion)",
    content: ["Mã giảm giá", "Dùng thử miễn phí", "Tư vấn 1-1"],
    keywords: ["mua ở đâu", "chính hãng", "khuyến mãi", "đăng ký"]
  }
};

const MOCK_KEYWORDS = [
  { id: 1, keyword: "Gia vị nấu cháo cho bé 1 tuổi", intent: "Informational", funnel: "TOFU", score: 8.5, volume: "12,500", difficulty: "Low", trend: "+15%" },
  { id: 2, keyword: "Hạt nêm tự nhiên mua ở đâu", intent: "Transactional", funnel: "BOFU", score: 9.2, volume: "5,400", difficulty: "High", trend: "+28%" },
  { id: 3, keyword: "Cách nấu phở bò chuẩn vị", intent: "Informational", funnel: "TOFU", score: 7.8, volume: "45,000", difficulty: "Medium", trend: "-5%" },
  { id: 4, keyword: "Gia vị Jungsung review", intent: "Commercial", funnel: "MOFU", score: 8.9, volume: "2,100", difficulty: "Low", trend: "+42%" },
  { id: 5, keyword: "Tương ớt cô đặc giá sỉ", intent: "Transactional", funnel: "BOFU", score: 9.5, volume: "1,800", difficulty: "Medium", trend: "+12%" },
];

const TREND_DATA = [
  { name: 'T2', volume: 400 }, { name: 'T3', volume: 600 }, { name: 'T4', volume: 550 },
  { name: 'T5', volume: 900 }, { name: 'T6', volume: 750 }, { name: 'T7', volume: 1100 }, { name: 'CN', volume: 850 },
];

/* --- Configuration --- */
const N8N_WEBHOOK_URL = "https://buutanh123.app.n8n.cloud/webhook/get-research-data"; 
const N8N_ANALYZE_URL = "https://buutanh123.app.n8n.cloud/webhook/update-research"; // DÁN LINK WEBHOOK POST (MỤC 3 TRONG GUIDE) VÀO ĐÂY

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Chào bạn! Tôi là Jungsung AI. Hãy nhập từ khóa hoặc vấn đề Marketing của bạn nhé!' }]);
  const [liveData, setLiveData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch data from n8n
  const refreshData = async () => {
    if (!N8N_WEBHOOK_URL) {
      console.warn("Chưa có Link Webhook n8n!");
      return;
    }
    setIsFetching(true);
    console.log("📡 Đang gọi n8n (GET) tại:", N8N_WEBHOOK_URL);
    try {
      const response = await fetch(N8N_WEBHOOK_URL);
      if (!response.ok) {
        throw new Error(`n8n báo lỗi ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Dữ liệu n8n trả về:", data);
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn("⚠️ n8n kết nối OK nhưng Sheets trả về rỗng!");
      }
      
      setLiveData(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("❌ LỖI KẾT NỐI N8N (GET):", error);
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        alert("LỖI CORS: Bạn chưa bật 'Enable CORS' trong node Webhook của n8n hoặc chưa bấm Publish!");
      } else {
        alert(`Lỗi: ${error.message}`);
      }
    } finally {
      setIsFetching(false);
    }
  };

  // Analyze and Save to n8n
  const analyzeKeyword = async (keyword) => {
    if (!N8N_ANALYZE_URL) {
      alert("Bạn chưa dán Link Webhook POST vào dòng 68!");
      return;
    }
    setIsFetching(true);
    console.log("🚀 Đang gửi yêu cầu phân tích (POST) cho:", keyword);
    try {
      const response = await fetch(N8N_ANALYZE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      
      if (!response.ok) {
        throw new Error(`n8n báo lỗi ${response.status}`);
      }
      
      console.log("✅ n8n đã nhận lệnh POST thành công!");
      alert("Đã gửi yêu cầu phân tích! Hãy kiểm tra Google Sheets.");
      refreshData();
    } catch (error) {
      console.error("❌ LỖI KẾT NỐI N8N (POST):", error);
      alert("Không thể gửi yêu cầu! Hãy kiểm tra n8n đã bấm 'Listen for test event' hoặc 'Publish' chưa.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');

    // AI Brain Logic
    setTimeout(() => {
      let response = "Tôi đã ghi nhận vấn đề của bạn. Để tối ưu từ khóa này, chúng ta cần tập trung vào nội dung SEO chuyên sâu.";
      
      if (userMsg.includes("tofu") || userMsg.includes("là gì")) {
        response = `Từ khóa này thuộc giai đoạn ${STRATEGY_BRAIN.TOFU.goal}. Chiến thuật đề xuất: ${STRATEGY_BRAIN.TOFU.content.join(", ")}.`;
      } else if (userMsg.includes("bofu") || userMsg.includes("mua")) {
        response = `Đây là "Từ khóa Vàng" (${STRATEGY_BRAIN.BOFU.goal}). Hãy tập trung vào: ${STRATEGY_BRAIN.BOFU.content.join(", ")} để chốt đơn ngay!`;
      } else if (userMsg.includes("mofu") || userMsg.includes("review")) {
        response = `Khách hàng đang cân nhắc (${STRATEGY_BRAIN.MOFU.goal}). Bạn nên triển khai: ${STRATEGY_BRAIN.MOFU.content.join(", ")}.`;
      }
      
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 800);
  };

  /* --- Render Functions --- */
  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        {[
          { label: 'Total Keywords', value: liveData.length > 0 ? liveData.length : '128', icon: Search, color: '#3b82f6', trend: '+12%' },
          { label: 'High Priority', value: '42', icon: Flame, color: '#ef4444', trend: '+5%' },
          { label: 'BOFU Intent', value: '18', icon: Zap, color: '#f59e0b', trend: '+18%' },
          { label: 'AI Processed', value: '98%', icon: ShieldCheck, color: '#10b981', trend: 'Stable' },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`trend-badge ${stat.trend.includes('-') ? 'negative' : ''}`}>{stat.trend}</div>
            <div className="stat-icon-bg" style={{ color: stat.color }}><stat.icon size={24} /></div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid-2-1">
        <div className="stat-card">
          <div className="card-header">
            <h3>Market Search Volume</h3>
            <button className="header-btn" onClick={refreshData} title="Làm mới dữ liệu từ n8n">
              <TrendingUp size={18} className={isFetching ? "spin" : ""} />
            </button>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <h3>Funnel Stages</h3>
            <PieIcon size={18} color="#94a3b8" />
          </div>
          {[
            { label: 'Awareness (TOFU)', color: '#3b82f6', val: 45 },
            { label: 'Consideration (MOFU)', color: '#8b5cf6', val: 30 },
            { label: 'Conversion (BOFU)', color: '#10b981', val: 25 },
          ].map((f, i) => (
            <div key={i} className="progress-container">
              <div className="progress-header"><span>{f.label}</span> <span>{f.val}%</span></div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${f.val}%`, background: f.color }} /></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderResearch = () => (
    <div className="table-container fade-in">
      <div className="table-header">
        <div>
          <h3>Deep Keyword Research</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Dữ liệu thời gian thực từ Jungsung Intelligence Hub.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={refreshData}>
            {isFetching ? "Updating..." : "Refresh Live"}
          </button>
          <button className="btn-primary">Export CSV</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Search Volume</th>
            <th>Difficulty</th>
            <th>Intent</th>
            <th>Trend</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(liveData.length > 0 ? liveData : MOCK_KEYWORDS).map((k, index) => (
            <tr key={k.id || index}>
              <td style={{ fontWeight: 600 }}>{k["Keyword (Từ khóa)"] || k.Keyword || k.keyword}</td>
              <td>{k.Search_Volume || k.volume || "Checking..."}</td>
              <td>
                <span className={`diff-badge ${(k.Difficulty || k.difficulty || "low").toLowerCase()}`}>
                  {k.Difficulty || k.difficulty || "Low"}
                </span>
              </td>
              <td>
                <span className="intent-badge" style={{ 
                  background: (k.Intent || k.intent) === 'Transactional' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  color: (k.Intent || k.intent) === 'Transactional' ? '#10b981' : '#3b82f6'
                }}>{k.Intent || k.intent || "Awareness"}</span>
              </td>
              <td style={{ color: (k.Trend || k.trend || "+").includes('+') ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                {k.Trend || k.trend || "+15%"}
              </td>
              <td>
                <button 
                  className="btn-icon" 
                  onClick={() => analyzeKeyword(k["Keyword (Từ khóa)"] || k.keyword)}
                  title="Phân tích & Ghi vào Sheets"
                >
                  <Bot size={16} color={k.Status === 'Done' ? '#10b981' : '#3b82f6'} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="placeholder-view">
      <div className="glow-circle"></div>
      <Bot size={64} color="#3b82f6" />
      <h2>{title} System</h2>
      <p>Module này đang được nạp dữ liệu từ Jungsung Strategy Lab.</p>
      <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Khởi chạy AI Scanner</button>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon"><Zap color="white" size={24} fill="white" /></div>
          <h2 className="logo-text">JUNGSUNG <span className="accent">AI</span></h2>
        </div>

        <nav className="nav-menu">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button className={`nav-link ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>
            <Search size={20} /> Research
          </button>
          <button className={`nav-link ${activeTab === 'strategy' ? 'active' : ''}`} onClick={() => setActiveTab('strategy')}>
            <Target size={20} /> Strategy
          </button>
          <button className={`nav-link ${activeTab === 'campaign' ? 'active' : ''}`} onClick={() => setActiveTab('campaign')}>
            <Layers size={20} /> Campaigns
          </button>
        </nav>

        <div className="premium-box">
          <p className="premium-label"><Zap size={14} fill="#3b82f6" /> PREMIUM</p>
          <p className="premium-text">Intelligence Active</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={16} color="#3b82f6" />
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>MARKET DATA • LIVE</span>
            </div>
            <h1 className="header-title">System <span className="gradient-text">Intelligence</span></h1>
          </div>
          <div className="header-actions">
            <button className="header-btn"><Search size={18} /></button>
            <button className="header-btn"><Mail size={18} /><span className="notif-dot"></span></button>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'research' && renderResearch()}
        {activeTab === 'strategy' && renderPlaceholder('Marketing Strategy')}
        {activeTab === 'campaign' && renderPlaceholder('Content Campaign')}
        
      </main>

      {/* Chatbot Popup */}
      {showChat && (
        <div className="chatbot-popup">
          <div className="chat-header">
            <div className="bot-icon-container">
              <Bot color="white" size={20} />
            </div>
            <div>
              <p className="bot-name">Jungsung AI Brain</p>
              <p className="bot-status">Sẵn sàng tư vấn chiến lược</p>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role === 'bot' ? 'bot-msg' : 'user-msg'}`}>{m.text}</div>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input className="chat-input" placeholder="Hỏi tôi về TOFU, MOFU, BOFU..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
            <button type="submit" className="chat-send-btn">
              <Send size={18} color="white" />
            </button>
          </form>
        </div>
      )}

      {/* Pulsing Chat Trigger */}
      <button className="chatbot-trigger" onClick={() => setShowChat(!showChat)}>
        <Bot color="white" size={32} />
        <div className="pulse"></div>
      </button>
    </div>
  );
}

export default App;
