# Web3 Fullstack Demo (MetaMask + ethers.js + web3.js)

## 📑 Tổng quan dự án (cho báo cáo)

### Kiến trúc tổng thể
- **Smart Contract (`contracts/`)**
  - Solidity + Hardhat framework
  - Counter.sol: hợp đồng đơn giản với increment/decrement và event tracking
  - Unit tests và script deployment tự động

- **Backend API (`backend/`)**
  - Express.js RESTful API
  - ethers.js cho việc đọc dữ liệu (current value)
  - web3.js cho việc theo dõi events (ValueChanged)
  - Cache layer để tối ưu hiệu năng

- **Frontend (`frontend/`)**
  - Vite + React cho performance và developer experience
  - Tailwind CSS cho UI responsive và dark mode
  - MetaMask integration cho Web3 interactions
  - Real-time transaction tracking và event polling

## Quick Start (Localhost)

### 1) Contracts
```bash
cd contracts
npm i
npx hardhat node
npm run node   # keep this terminal open
# in another terminal:
npm run compile
npm run deploy:local
```
Copy the printed contract address.

### 2) Backend
```bash
cd ../backend
cp .env.example .env
# edit .env -> CONTRACT_ADDRESS=<address from deploy>
npm i
npm run dev
```
Check: http://localhost:4000/api/health

### 3) Frontend
```bash
cd ../frontend
cp .env.example .env
# edit .env -> VITE_COUNTER_ADDRESS=<address from deploy>
npm i
npm run dev
```
Open http://localhost:5173

### MetaMask
Add Localhost 8545 (ChainId 31337). Import one private key from Hardhat node output.

## 🎨 Giao diện và tính năng

### Thành phần giao diện
1. **Header (Responsive)**
   - Logo với gradient và brand identity
   - Navigation menu (Docs/Contracts/API) với mobile dropdown
   - Dark/Light mode toggle với animation
   - Wallet connection status và account info

2. **Main Panels**
   - **Wallet Panel**: 
     - Hiển thị địa chỉ ví (truncated), chain ID, balance
     - Avatar với gradient và monospace font
     - Responsive layout cho mobile/desktop
   
   - **Counter Panel**:
     - Current value với typography emphasis
     - Nút Increment/Decrement với state feedback
     - Recent Events list với scroll và hover states
     - Transaction history với timestamps

3. **Transaction UI**
   - **TxToast**: Notify giao dịch đang pending
   - **TxList**: Danh sách đầy đủ với status indicators
   - Export CSV cho transaction history
   - Links tới Etherscan cho mỗi transaction

4. **Documentation & API**
   - Modal-based documentation system
   - Contract info với ABI display
   - API testing interface
   - Hướng dẫn MetaMask setup

### Responsive Design
- Mobile-first approach với progressive enhancement
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Stack layout trên mobile, grid/flex trên desktop
- Touch-friendly buttons và scrollable areas

### Dark Mode Support
- System-preferred và manual toggle
- Consistent color palette cho light/dark
- Proper contrast ratios cho accessibility
- Smooth transition animations

## 🎯 Hướng dẫn demo (cho báo cáo)

### 1. Setup môi trường
```bash
# Terminal 1: Hardhat node
cd contracts
npm i
npx hardhat node

# Terminal 2: Deploy contract
cd contracts
npm run deploy:local  # copy địa chỉ contract

# Terminal 3: Backend
cd backend
cp .env.example .env  # paste địa chỉ contract
npm i
npm run dev

# Terminal 4: Frontend
cd frontend
cp .env.example .env  # paste địa chỉ contract
npm i
npm run dev
```

### 2. Demo flow
1. Mở http://localhost:5173
2. Thêm network Localhost 8545 vào MetaMask:
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
3. Import private key từ output của Hardhat node
4. Connect wallet và test các tính năng:
   - Toggle dark/light mode
   - Increment/decrement counter
   - Xem transaction notifications
   - Check event history
   - Export transaction CSV

### 3. Điểm nhấn kỹ thuật
- **Performance**: Vite dev server, React hooks optimization
- **UX**: Immediate feedback cho mọi action
- **Error Handling**: Graceful degradation
- **Extensibility**: Modular architecture, dễ thêm tính năng

## Testnet (Sepolia)
- Fill `contracts/.env` from `.env.example`
- `npm run deploy:sepolia` in `contracts`
- Update backend & frontend `.env` with new address; switch MetaMask to Sepolia.

## Giao diện Frontend (Pro) — Hướng dẫn cho báo cáo A+

Phần frontend đã được tinh chỉnh để trông chuyên nghiệp, responsive và dễ demo cho người chấm. Các điểm nổi bật:

- Header responsive với logo gradient, menu ẩn trên mobile, nút bật/tắt theme (dark/light) và hiển thị ví rút gọn.
- Bố cục sử dụng container có max-width lớn (90rem) và padding responsive để hiển thị đẹp trên điện thoại, tablet và desktop.
- WalletPanel và CounterPanel được tối ưu cho mobile: nút full-width trên điện thoại, nội dung rút gọn, và danh sách sự kiện có cuộn (scroll) rõ ràng.
- Các thành phần sử dụng Tailwind CSS (dark mode hỗ trợ) — dễ tuỳ chỉnh thêm nếu cần.

Cách demo cho giáo viên / hội đồng chấm:

1. Khởi chạy mạng local, triển khai hợp đồng, rồi cập nhật địa chỉ hợp đồng vào `backend/.env` và `frontend/.env`.
2. Chạy backend (`npm run dev`) và frontend (`npm run dev`). Mở http://localhost:5173.
3. Thêm mạng Localhost 8545 vào MetaMask (chainId 31337) và import private key từ Hardhat node.
4. Kết nối ví bằng nút "Connect" ở header. Thử thay đổi theme (dark/light) và thay đổi kích thước cửa sổ để hiển thị responsive.
5. Tăng/giảm giá trị counter để xem TxToast/TxList (giao dịch pending → success) và kiểm tra phần Recent Events.

Tài liệu bổ sung (nếu cần trong báo cáo): chụp màn hình cho 3 kích thước — mobile (375px), tablet (768px) và desktop (1440px) để minh hoạ tính responsive.

## Những cải tiến mới (dành cho báo cáo A+)

- **StatsPanel**: Bổ sung panel thống kê nhanh (contract value, số events recent, API health, last update). Panel này dùng backend `/api` để lấy dữ liệu và tự động refresh.
- **Tx UI được nâng cấp**: Toasts và Transaction list giờ có badges màu, liên kết mở explorer theo network (VITE_NETWORK), tên file export CSV có timestamp, và layout mobile-friendly.
- **Docs / Contracts / API UI**: Thêm modal-based Docs, Contracts và API demo (có thể test `/api/health`, `/api/counter/value`, `/api/counter/events` trực tiếp từ giao diện) để người chấm dễ kiểm tra.

### Tính năng "Generate Report" (mới)

- Nút "Generate Report" nằm trong `StatsPanel` — khi bấm sẽ thu thập snapshot hiện tại từ backend (`/api/counter/value`, `/api/counter/events`) và lịch sử giao dịch cục bộ (localStorage) rồi tạo một file Markdown tải về (`demo-report-<timestamp>.md`).
- Mục đích: nhanh chóng tạo tài liệu demo để đính kèm vào báo cáo (A+), bao gồm giá trị hiện tại, 5 events gần nhất và 20 giao dịch gần nhất.
- Lưu ý: file này chỉ thu thập dữ liệu read-only; không thực thi giao dịch hay thay đổi trạng thái blockchain.

## Ghi chú thay đổi (ngắn)
- Thêm: `frontend/src/components/StatsPanel.jsx` — panel thống kê.
- Cập nhật: `frontend/src/components/TxToast.jsx`, `frontend/src/components/TxList.jsx` — UI/UX nâng cao.
- Thêm: `frontend/src/components/modals/{DocsModal,ContractsModal,ApiModal}.jsx` — modal tài liệu và API demo.
- Cập nhật: `frontend/src/components/Header.jsx` — mở modal từ navigation, mobile menu improved.
- Thêm: `frontend/src/components/Footer.jsx` — hiển thị contract address cho demo.

Những thay đổi tập trung vào giao diện và trải nghiệm người dùng; logic backend và hợp đồng không bị thay đổi.

---

Nếu bạn muốn, tôi có thể tiếp tục tạo một trang `/docs` đầy đủ (route), thêm screenshot mẫu vào `docs/ui.md`, hoặc bổ sung một vài unit test để minh hoạ tính nghiêm túc kỹ thuật trong báo cáo.
