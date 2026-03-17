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

/* --- Jungsung Brand Knowledge Base --- */
const JUNGSUNG_KNOWLEDGE = {
  brand: {
    name: "Jungsung (정성)",
    ceo: "In-kyung Kim",
    philosophy: "Triết lý 3 Không: 0% chất phụ gia, 0% hương liệu nhân tạo, 100% nguyên liệu tự nhiên.",
    mission: "Mang tinh hoa gia vị truyền thống Hàn Quốc đến từng bữa cơm gia đình với sự tận tâm (Jungsung).",
    safety: "Chứng nhận HACCP, quy trình sản xuất khép kín hiện đại.",
  },
  products: [
    { name: "Bột Nấm Hương 100%", description: "Nấm hương nội địa Hàn Quốc, giữ trọn vị Umami." },
    { name: "Nước Tương Dasima", description: "Vị ngọt thanh từ tảo bẹ tự nhiên." },
    { name: "Chicken Stock (Cốt gà)", description: "Đậm đà, không bột ngọt, tốt cho sức khỏe." },
    { name: "Khối Hải Sản Cô Đặc", description: "Tiện lợi, giữ trọn hương vị biển cả." }
  ],
  strategies: {
    TOFU: {
      goal: "Nhận thức (Awareness)",
      tactics: ["Sử dụng video ngắn review bột nấm cho bé ăn dặm", "Blog về lối sống Clean Eating", "Ads Facebook nhắm mục tiêu mẹ bỉm"],
      content: "Nội dung giáo dục khách hàng về tác hại của bột ngọt và lợi ích của gia vị tự nhiên."
    },
    MOFU: {
      goal: "Cân nhắc (Consideration)",
      tactics: ["Livestream nấu ăn cùng đầu bếp", "Mini-game tặng mẫu thử", "E-book công thức nấu ăn 15 phút"],
      content: "So sánh trực quan giữa Jungsung và các loại gia vị công nghiệp."
    },
    BOFU: {
      goal: "Chốt đơn (Conversion)",
      tactics: ["Flash sale 24h trên TikTok Shop", "Combo dùng thử tiết kiệm", "Retargeting khách đã xem giỏ hàng"],
      content: "Tập trung vào sự khan hiếm và cam kết chất lượng 100% tự nhiên."
    }
  }
};

const STRATEGY_BRAIN = {
  TOFU: {
    goal: "Nâng cao nhận thức (Awareness)",
    content: ["Blog review", "Infographic", "Video hướng dẫn cơ bản"],
    keywords: ["là gì", "cách làm", "review", "so sánh", "tác hại", "tự nhiên"]
  },
  MOFU: {
    goal: "Cân nhắc & Đánh giá (Consideration)",
    content: ["Case study", "Webinar", "Bảng so sánh tính năng"],
    keywords: ["tốt nhất", "giá", "hiệu quả", "hỗ trợ", "an toàn", "chứng nhận"]
  },
  BOFU: {
    goal: "Chốt đơn (Conversion)",
    content: ["Mã giảm giá", "Dùng thử miễn phí", "Tư vấn 1-1"],
    keywords: ["mua ở đâu", "chính hãng", "khuyến mãi", "đăng ký", "địa chỉ", "đặt hàng"]
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
const N8N_ANALYZE_URL = "https://buutanh123.app.n8n.cloud/webhook/update-research";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ 
    role: 'bot', 
    text: 'Chào bạn! Tôi là chuyên gia Jungsung AI. Tôi hiểu rõ về tinh hoa gia vị Hàn Quốc và chiến lược Marketing. Bạn cần tôi tư vấn gì về từ khóa hay thương hiệu Jungsung không?' 
  }]);
  const [liveData, setLiveData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Export CSV Logic
  const exportToCSV = () => {
    const data = liveData.length > 0 ? liveData : MOCK_KEYWORDS;
    const headers = ["Keyword", "Search Volume", "Difficulty", "Intent", "Trend"];
    const csvRows = [
      headers.join(","),
      ...data.map(row => [
        row["Keyword (Từ khóa)"] || row.keyword || row.Keyword,
        row.Search_Volume || row.volume || 0,
        row.Difficulty || row.difficulty || "Low",
        row.Intent || row.intent || "Awareness",
        row.Trend || row.trend || "0%"
      ].join(","))
    ];
    
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Jungsung_Market_Analysis.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fetch data from n8n
  const refreshData = async () => {
    if (!N8N_WEBHOOK_URL) return;
    setIsFetching(true);
    try {
      const response = await fetch(N8N_WEBHOOK_URL);
      const data = await response.json();
      setLiveData(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Analyze and Save to n8n
  const analyzeKeyword = async (keyword) => {
    if (!N8N_ANALYZE_URL) return;
    setIsFetching(true);
    try {
      await fetch(N8N_ANALYZE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      alert("Đã gửi yêu cầu phân tích chuyên sâu cho Jungsung AI!");
    } catch (error) {
      console.error("POST error:", error);
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

    // Jungsung Intelligent Brain Logic
    setTimeout(() => {
      let response = "Câu hỏi rất hay! Để phát triển Jungsung, chúng ta nên kết hợp giữa triết lý 'Tận tâm' và dữ liệu thị trường thực tế.";
      
      if (userMsg.includes("ceo") || userMsg.includes("founder") || userMsg.includes("kim")) {
        response = `CEO của Jungsung là bà ${JUNGSUNG_KNOWLEDGE.brand.ceo}. Bà khởi nghiệp với mong muốn mang lại gia vị an toàn tuyệt đối cho gia đình.`;
      } else if (userMsg.includes("3 không") || userMsg.includes("triết lý")) {
        response = `Jungsung cam kết ${JUNGSUNG_KNOWLEDGE.brand.philosophy}. Đây là điểm bán hàng độc nhất (USP) giúp chúng ta cạnh tranh.`;
      } else if (userMsg.includes("sản phẩm") || userMsg.includes("bán gì")) {
        response = `Các sản phẩm chủ lực gồm: ${JUNGSUNG_KNOWLEDGE.products.map(p => p.name).join(", ")}. Bạn muốn tôi tư vấn chiến lược cho sản phẩm nào?`;
      } else if (userMsg.includes("tofu") || userMsg.includes("là gì")) {
        response = `Giai đoạn ${JUNGSUNG_KNOWLEDGE.strategies.TOFU.goal}: ${JUNGSUNG_KNOWLEDGE.strategies.TOFU.content}. Chiến thuật gợi ý: ${JUNGSUNG_KNOWLEDGE.strategies.TOFU.tactics.join(", ")}.`;
      } else if (userMsg.includes("bofu") || userMsg.includes("mua")) {
        response = `Giai đoạn ${JUNGSUNG_KNOWLEDGE.strategies.BOFU.goal}: ${JUNGSUNG_KNOWLEDGE.strategies.BOFU.content}. Chạy ngay: ${JUNGSUNG_KNOWLEDGE.strategies.BOFU.tactics.join(", ")}.`;
      } else if (userMsg.includes("haccp") || userMsg.includes("an toàn")) {
        response = `Bạn hoàn toàn yên tâm, Jungsung đạt ${JUNGSUNG_KNOWLEDGE.brand.safety}. Đây là bảo chứng mạnh mẽ nhất khi làm Marketing.`;
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
          <div key={i} className="stat-card glass shimmer-bg">
            <div className={`trend-badge ${stat.trend.includes('-') ? 'negative' : ''}`}>{stat.trend}</div>
            <div className="stat-icon-bg" style={{ color: stat.color }}><stat.icon size={24} /></div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid-2-1">
        <div className="stat-card glass">
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

        <div className="stat-card glass">
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
          <button className="btn-primary" onClick={exportToCSV}>Export CSV</button>
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
              <td style={{ fontWeight: 600 }}>{k["Keyword (Từ khóa)"] || k.keyword || k.Keyword}</td>
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
                  onClick={() => analyzeKeyword(k["Keyword (Từ khóa)"] || k.keyword || k.Keyword)}
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

  const renderStrategy = () => (
    <div className="strategy-grid fade-in">
      {Object.entries(JUNGSUNG_KNOWLEDGE.strategies).map(([key, value]) => (
        <div key={key} className="stat-card glass strategy-card">
          <div className="strategy-header">
            <span className={`funnel-pill ${key.toLowerCase()}`}>{key}</span>
            <Target size={18} color="#d4af37" />
          </div>
          <h3 className="strategy-title">{value.goal}</h3>
          <p className="strategy-desc">{value.content}</p>
          <div className="tactics-list">
            {value.tactics.map((t, i) => (
              <div key={i} className="tactic-item">
                <CheckCircle2 size={14} color="#10b981" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCampaign = () => (
    <div className="campaign-list fade-in">
      <div className="stat-card glass">
        <div className="card-header">
          <h3>Active Content Campaigns</h3>
          <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>+ New Campaign</button>
        </div>
        <div className="campaign-table-wrapper">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Jungsung x Mẹ Bỉm sữa Review", channel: "TikTok", status: "Running", perf: "High", color: "#3b82f6" },
                { name: "Sạch lành chuẩn Hàn (Branding)", channel: "Facebook", status: "Draft", perf: "-", color: "#94a3b8" },
                { name: "Google Ads - Keywords BOFU", channel: "Search", status: "Running", perf: "Medium", color: "#10b981" },
              ].map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span className="channel-pill">{c.channel}</span></td>
                  <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td style={{ color: '#10b981', fontWeight: 800 }}>{c.perf}</td>
                  <td><button className="header-btn"><ArrowUpRight size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
        {activeTab === 'strategy' && renderStrategy()}
        {activeTab === 'campaign' && renderCampaign()}
        
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
