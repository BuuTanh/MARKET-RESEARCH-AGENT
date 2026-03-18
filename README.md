# 🏆 Jungsung Intelligence: Market Research Dashboard

**Jungsung Intelligence** là một Dashboard phân tích thị trường và tư vấn chiến lược Marketing cao cấp, được thiết kế riêng cho nhãn hàng **Jungsung (정성)** - Tinh hoa gia vị truyền thống Hàn Quốc.

Hệ thống kết hợp sức mạnh của **AI Automation (n8n)** và **Brand Intelligence** để giúp doanh nghiệp tối ưu hóa sự hiện diện trực tuyến và hiểu rõ khách hàng mục tiêu.

---

## 🌟 Tính năng Nổi bật

### 1. 🧠 Jungsung AI Brain (Chatbot Chiến lược)
- **Tri thức thương hiệu**: Được đào tạo dựa trên câu chuyện của Founder In-kyung Kim, triết lý "3 Không" (0% phụ gia, 0% hương liệu, 100% tự nhiên) và chứng nhận HACCP.
- **Tư vấn Marketing**: Khả năng phân tích từ khóa theo mô hình phễu **TOFU - MOFU - BOFU**.
- **Hỗ trợ thời gian thực**: Giải đáp thắc mắc về sản phẩm (Bột nấm, Nước tương, Chicken Stock...) và đề xuất chiến thuật nội dung.

### 2. 📊 Market Research Hub (n8n Integration)
- **Dữ liệu Live**: Kết nối trực tiếp với n8n Automation và Google Sheets.
- **Phân tích chiều sâu**: Cung cấp chỉ số Search Volume, Difficulty, Intent và Trend của từ khóa.
- **Interactive Action**: Nút "Analyze" gửi dữ liệu từ Dashboard về n8n để xử lý chuyên sâu và ghi lại vào hệ thống lưu trữ.

### 3. 🎯 Strategy & Campaign Management
- **Marketing Funnel**: Hiển thị kế hoạch hành động cụ thể cho từng giai đoạn nhận thức của khách hàng.
- **Quản lý chiến dịch**: Theo dõi các chiến dịch nội dung trên TikTok, Facebook và Google Ads với chỉ số hiệu năng (Performance) thực tế.

### 4. 💎 Premium Aesthetics (Glassmorphism)
- **Thiết kế hiện đại**: Sử dụng phong cách kính mờ (Backdrop Blur), hiệu ứng Shimmer và bảng màu Midnight Blue - Gold sang trọng.
- **Trải nghiệm mượt mà**: Các chuyển động micro-animations tạo cảm giác cao cấp và chuyên nghiệp.

---

## 🛠️ Công nghệ Sử dụng

- **Frontend**: React.js, Lucide Icons, Recharts (Biểu đồ).
- **Styling**: Vanilla CSS với kiến trúc Glassmorphism và CSS Variables.
- **Backend Automation**: **n8n** (Workflow Engine) kết nối qua Webhooks.
- **Data Storage**: Google Sheets (thông qua n8n).
- **Deployment**: Vercel.

---

## 🚀 Hướng dẫn Kết nối n8n

Để hệ thống hoạt động hoàn hảo, bạn cần cấu hình n8n như sau:

1. **GET Webhook**: Lấy dữ liệu từ Google Sheets về Dashboard.
2. **POST Webhook**: Nhận yêu cầu phân tích từ khóa từ Dashboard.
3. **CORS Configuration**: Trong Node Webhook của n8n, mục *Options* -> *Allowed Origins*, hãy điền Link Vercel của bạn để cho phép kết nối.

---

## 📖 Câu chuyện Thương hiệu (Brand Story)
> "Jungsung (정성) trong tiếng Hàn có nghĩa là 'Sự tận tâm'. Chúng tôi không chỉ bán gia vị, chúng tôi mang cả sự chân thành của người mẹ vào từng bữa cơm gia đình, cam kết 100% tự nhiên và an toàn tuyệt đối."

---

*Dự án được thực hiện bởi đội ngũ Marketing Research Agent - Tối ưu hóa cho Jungsung Brand.*
