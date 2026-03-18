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

import JUNGSUNG_DB from './knowledge_base.json';

/* --- Jungsung Brand Knowledge Base (Legacy fallback) --- */
const JUNGSUNG_KNOWLEDGE = {
  brand: JUNGSUNG_DB.brand_name,
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
  { 
    id: 1, 
    "Keyword (Từ khóa)": "Gia vị nấu cháo cho bé 1 tuổi", 
    intent: "Thông tin", 
    stage: "TOFU", 
    score: 9, 
    product: "Gia vị nấm Dasima", 
    hook: "Vị ngọt tự nhiên, không muối, an toàn cho hệ tiêu hóa của bé.",
    Status: "Done"
  },
  { 
    id: 2, 
    "Keyword (Từ khóa)": "Hạt nêm hữu cơ mua ở đâu", 
    intent: "Mua sắm", 
    stage: "BOFU", 
    score: 10, 
    product: "Combo Gia vị Jungsung", 
    hook: "Ưu đãi 20% khi mua tại Intelligence Hub hôm nay!",
    Status: "Done"
  },
  { 
    id: 3, 
    "Keyword (Từ khóa)": "Gia vị Jungsung có tốt không", 
    intent: "Cân nhắc", 
    stage: "MOFU", 
    score: 8, 
    product: "Trọn bộ 5 loại cốt lèo", 
    hook: "Review thực tế từ 1000+ mẹ bỉm sữa thông thái.",
    Status: "Done"
  },
  { 
    id: 4, 
    "Keyword (Từ khóa)": "Cách dùng cốt lèo Jungsung", 
    intent: "Hướng dẫn", 
    stage: "TOFU", 
    score: 7, 
    product: "Cốt lèo cô đặc", 
    hook: "Nấu phở chuẩn vị chỉ trong 15 phút.",
    Status: "Done"
  }
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
    text: 'Chào bạn! Tôi là Jungsung AI. Tôi đã được cập nhật kho kiến thức mới nhất về thương hiệu. Bạn cần tìm hiểu gì về sản phẩm, chứng nhận hay chiến lược bán hàng của Jungsung không?' 
  }]);
  const [liveData, setLiveData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Hệ thống đã sẵn sàng', desc: 'Kết nối n8n Intelligence Hub thành công.', time: 'vừa xong' },
    { id: 2, title: 'Email Automation', desc: 'Mẫu email Premium đã được cấu hình.', time: '10p trước' }
  ]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  // Filtered data for search
  const filteredResearchData = (liveData.length > 0 ? liveData : MOCK_KEYWORDS).filter(item => {
    const kw = (item["Keyword (Từ khóa)"] || item.keyword || item.Keyword || "").toLowerCase();
    return kw.includes(searchTerm.toLowerCase());
  });

  // Export CSV Logic
  const exportToCSV = () => {
    const data = liveData.length > 0 ? liveData : MOCK_KEYWORDS;
    const headers = ["Keyword (Từ khóa)", "Intent", "Funnel Stage", "Score", "Recommended Product", "Marketing Hook", "Status"];
    const csvRows = [
      headers.join(","),
      ...data.map(row => [
        `"${row["Keyword (Từ khóa)"] || row.keyword || row.Keyword}"`,
        `"${row.Intent || row.intent || "Awareness"}"`,
        `"${row["Funnel Stage"] || row.stage || row.funnel || "TOFU"}"`,
        `"${row.score || row.potential_score || "0"}"`,
        `"${row.Content_Type || row.product || row["Recommended Product"] || "-"}"`,
        `"${row.Title_Idea || row.hook || row.Marketing_Hook || "-"}"`,
        `"${row.Status || "Pending"}"`
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
      const newData = Array.isArray(data) ? data : [data];
      
      // Notify if new items arrive
      if (liveData.length > 0 && newData.length > liveData.length) {
        setNotifications(prev => [{
          id: Date.now(),
          title: 'Dữ liệu mới!',
          desc: `Phát hiện ${newData.length - liveData.length} từ khóa mới từ Intelligence Hub.`,
          time: 'vừa xong'
        }, ...prev]);
      }
      
      setLiveData(newData);
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

    // --- Advanced AI Scanning & Response Logic ---
    setTimeout(() => {
      let bestMatch = null;
      let maxScore = 0;

      // Extract all potential knowledge sectors dynamically
      const allKnowledge = Object.values(JUNGSUNG_DB)
        .filter(val => Array.isArray(val))
        .flat();

      // Scan all entries for the best score
      allKnowledge.forEach(entry => {
        let score = 0;

        // 1. Keyword Score (Weighted by length)
        if (entry.keywords) {
          entry.keywords.forEach(kw => {
            if (userMsg.includes(kw.toLowerCase())) {
              // Exact word matching or sub-phrase matching with weight
              score += kw.length; 
            }
          });
        }

        // 2. Question Score (High priority for matching exact/similar questions)
        if (entry.questions) {
          entry.questions.forEach(q => {
            const questionStr = q.toLowerCase();
            if (userMsg.includes(questionStr) || questionStr.includes(userMsg)) {
              // Huge bonus for question match
              score += 20;
            }
          });
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = entry;
        }
      });

      let response = "";

      if (bestMatch && maxScore > 0) {
        response = bestMatch.answer;
      } else {
        // Fallback or contextual help
        if (userMsg.includes("tofu")) {
          response = `Giai đoạn ${JUNGSUNG_KNOWLEDGE.strategies.TOFU.goal}: ${JUNGSUNG_KNOWLEDGE.strategies.TOFU.content}.`;
        } else if (userMsg.includes("mofu")) {
          response = `Giai đoạn ${JUNGSUNG_KNOWLEDGE.strategies.MOFU.goal}: ${JUNGSUNG_KNOWLEDGE.strategies.MOFU.content}.`;
        } else if (userMsg.includes("bofu")) {
          response = `Giai đoạn ${JUNGSUNG_KNOWLEDGE.strategies.BOFU.goal}: ${JUNGSUNG_KNOWLEDGE.strategies.BOFU.content}.`;
        } else {
          response = "Tôi là Jungsung AI Expert. Bạn có thể hỏi về Triết lý thương hiệu, Thành phần nguyên liệu (Bột nấm, Tảo bẹ...), Công nghệ nghiền siêu mịn, hoặc các chỉ số Dashboard. Bạn cần tôi giải đáp phần nào?";
        }
      }
      
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 600);
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

  // Smart Fallback Helper
  const getSmartFallback = (item, field) => {
    const kw = (item["Keyword (Từ khóa)"] || item.keyword || "").toLowerCase();
    const stage = (item["Funnel Stage"] || item.stage || item.funnel || "TOFU").toUpperCase();

    if (field === 'intent') {
      if (kw.includes("mua") || kw.includes("giá") || stage === "BOFU") return "Mua sắm (Transactional)";
      if (kw.includes("là gì") || kw.includes("cách") || stage === "TOFU") return "Thông tin (Informational)";
      return "Khám phá (Navigational)";
    }
    
    if (field === 'outcome') {
      if (item.Content_Type || item.product || item["Recommended Product"]) return item.Content_Type || item.product || item["Recommended Product"];
      if (stage === "TOFU") return "Blog hướng dẫn / Video Reels";
      if (stage === "MOFU") return "Ebook / Quiz so sánh";
      if (stage === "BOFU") return "Landing Page Chốt đơn / Coupon";
      return "Phân tích Strategy...";
    }

    if (field === 'insight') {
      if (item.Title_Idea || item.hook || item.Marketing_Hook || item["Marketing Hook"]) return item.Title_Idea || item.hook || item.Marketing_Hook || item["Marketing Hook"];
      if (stage === "TOFU") return "Bật mí bí kíp sử dụng Jungsung chuẩn Hàn";
      if (stage === "MOFU") return "Top 5 sai lầm khi chọn gia vị cho gia đình";
      if (stage === "BOFU") return "Cơ hội sở hữu trọn bộ Jungsung với giá sốc";
      return "Đang lên ý tưởng giật tít...";
    }

    if (field === 'score') {
      if (item.score || item.potential_score) return item.score || item.potential_score;
      if (stage === "BOFU") return 9;
      if (stage === "MOFU") return 8;
      return 7;
    }

    return "-";
  };

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
      <div className="table-scroll-wrapper" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Keyword (Từ khóa)</th>
              <th>Intent</th>
              <th>Stage</th>
              <th>Strategy (Product/Type)</th>
              <th>Creative (Hook/Title)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(liveData.length > 0 ? filteredResearchData : MOCK_KEYWORDS).map((k, index) => (
              <tr key={k.id || index}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {k["Keyword (Từ khóa)"] || k.keyword || k.Keyword}
                    <span title="AI Potential Score" style={{ color: '#f59e0b', fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {getSmartFallback(k, 'score')}/10
                    </span>
                  </div>
                </td>
                <td>
                  <span className="intent-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    {getSmartFallback(k, 'intent')}
                  </span>
                </td>
                <td>
                  <span className={`funnel-pill ${(k["Funnel Stage"] || k.stage || k.funnel || "tofu").toLowerCase().split(' ')[0]}`}>
                    {k["Funnel Stage"] || k.stage || k.funnel || "TOFU"}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {getSmartFallback(k, 'outcome')}
                </td>
                <td style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#94a3b8', maxWidth: '250px' }}>
                  {getSmartFallback(k, 'insight')}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      className="btn-icon" 
                      onClick={() => analyzeKeyword(k["Keyword (Từ khóa)"] || k.keyword || k.Keyword)}
                      title="Phân tích chuyên sâu"
                    >
                      <Bot size={16} />
                    </button>
                    {(k.Status === 'Pending' || !k.Status) && <div className="status-dot pulsing" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>}
                    {k.Status === 'Done' && <CheckCircle2 size={16} color="#10b981" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

  const renderCampaign = () => {
    if (selectedCampaign) return renderCampaignDetails();
    
    return (
      <div className="campaign-list fade-in">
        <div className="stat-card glass">
          <div className="card-header">
            <h3>Active Content Campaigns</h3>
            <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }} onClick={() => setShowNewCampaignModal(true)}>+ New Campaign</button>
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
                    <td><button className="header-btn" onClick={() => setSelectedCampaign(c)}><ArrowUpRight size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderNewCampaignModal()}
      </div>
    );
  };

  const renderNotifications = () => (
    <div className={`notifications-dropdown glass ${showNotifications ? 'show' : ''}`}>
      <div className="dropdown-header">Notifications</div>
      <div className="notifications-list">
        {notifications.map(n => (
          <div key={n.id} className="notif-item">
            <div className="notif-title">{n.title}</div>
            <div className="notif-desc">{n.desc}</div>
            <div className="notif-time">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewCampaignModal = () => (
    <div className={`modal-overlay ${showNewCampaignModal ? 'show' : ''}`} onClick={() => setShowNewCampaignModal(false)}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Campaign</h3>
          <button className="close-btn" onClick={() => setShowNewCampaignModal(false)}>×</button>
        </div>
        <form className="modal-form" onSubmit={e => { e.preventDefault(); setShowNewCampaignModal(false); alert('Campaign created successfully (Simulated)'); }}>
          <div className="form-group">
            <label>Campaign Name</label>
            <input type="text" placeholder="e.g. TikTok Review" required />
          </div>
          <div className="form-group">
            <label>Channel</label>
            <select><option>TikTok</option><option>Facebook</option><option>YouTube</option><option>Google Search</option></select>
          </div>
          <button type="submit" className="btn-primary w-100">Khởi tạo Chiến dịch</button>
        </form>
      </div>
    </div>
  );

  const renderCampaignDetails = () => (
    <div className="campaign-details fade-in">
      <button className="btn-secondary mb-1" onClick={() => setSelectedCampaign(null)}>← Quay lại Danh sách</button>
      <div className="stat-card glass">
        <div className="detail-header">
          <h2 className="gradient-text">{selectedCampaign.name}</h2>
          <span className={`status-pill ${selectedCampaign.status.toLowerCase()}`}>{selectedCampaign.status}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-stat">
            <p>Channel</p>
            <h3>{selectedCampaign.channel}</h3>
          </div>
          <div className="detail-stat">
            <p>Performance</p>
            <h3 style={{ color: '#10b981' }}>{selectedCampaign.perf}</h3>
          </div>
          <div className="detail-stat">
            <p>ROI Dự báo</p>
            <h3>+2.4x</h3>
          </div>
        </div>
        <div className="detail-section">
          <h4>Kế hoạch Content (AI Suggested)</h4>
          <p>Dựa trên Research, chiến dịch này sẽ nhắm vào nhóm khách hàng TOFU với thông điệp: "Gia vị Jungsung - Tinh hoa tự nhiên Hàn Quốc cho sức khỏe gia đình".</p>
          <div className="tactics-list">
            <div className="tactic-item"><CheckCircle2 size={14} color="#10b981" /> <span>Hợp tác 5 KOC TikTok ngành Mẹ & Bé</span></div>
            <div className="tactic-item"><CheckCircle2 size={14} color="#10b981" /> <span>Chạy Ads Landing Page giới thiệu bột nấm Dasima</span></div>
          </div>
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
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm từ khóa..." 
                className="header-search-input"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (activeTab !== 'research') setActiveTab('research');
                }}
              />
            </div>
            <div className="notif-wrapper">
              <button className="header-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Mail size={18} />
                <span className="notif-dot"></span>
              </button>
              {renderNotifications()}
            </div>
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
