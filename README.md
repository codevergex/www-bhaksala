# 🏏 Cricket Live Line

A modern, real-time cricket live scoring application inspired by CricLine Guru. Built with React, TypeScript, Node.js, and Socket.io for instant live updates.

![Cricket Live Line](https://img.shields.io/badge/Cricket-Live%20Line-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4-black)

## ✨ Features

### 🔴 Live Cricket Scores
- **Real-time updates** every 30 seconds via WebSocket
- **Ball-by-ball commentary** with detailed match insights
- **Live match indicators** with pulsing animations
- **Current batting & bowling stats** for active players

### 📊 Comprehensive Cricket Data
- **Live Matches**: Current ongoing matches with scores and commentary
- **Match Details**: Detailed scorecards, player statistics, and venue information
- **Cricket News**: Latest cricket news and match reports
- **Player Rankings**: ICC rankings for Test and ODI formats
- **Series Information**: Tournament progress and match schedules

### 🎨 Modern UI/UX
- **Responsive design** for mobile, tablet, and desktop
- **Clean, modern interface** with smooth animations
- **Live indicators** and real-time visual feedback
- **Intuitive navigation** between different sections

### ⚡ Real-time Features
- **WebSocket integration** for instant score updates
- **Live commentary streaming**
- **Dynamic score changes** with visual feedback
- **Recent balls tracking** with color-coded runs

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for CSS-in-JS styling
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Axios** for HTTP requests
- **React Icons** for beautiful icons

### Backend
- **Node.js** with Express.js
- **Socket.io** for real-time communication
- **CORS** enabled for cross-origin requests
- **Compression** for optimized responses
- **Node Cron** for scheduled score updates

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cricket-live-line
   ```

2. **Install dependencies for all projects**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd server && npm install
   
   # Frontend dependencies
   cd ../client && npm install
   ```

### Development

1. **Start both frontend and backend in development mode**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

2. **Or start them separately**
   ```bash
   # Start backend server
   npm run server
   
   # In another terminal, start frontend
   npm run client
   ```

### Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 Features Walkthrough

### Home Page
- Featured live matches with real-time scores
- Latest cricket news and updates
- Quick navigation to different sections

### Live Matches
- All currently live matches
- Real-time score updates every 30 seconds
- Recent balls tracking with color-coded runs
- Quick access to detailed match view

### Match Details
- Comprehensive ball-by-ball commentary
- Current batsmen statistics (runs, balls, 4s, 6s)
- Current bowler figures (overs, runs, wickets)
- Match information (venue, toss, target)

### Rankings
- ICC player rankings for Test and ODI formats
- Top batsmen and bowlers with points
- Medal indicators for top 3 positions

### Series & Tournaments
- Current and upcoming cricket series
- Progress tracking for ongoing tournaments
- Match completion statistics

### Cricket News
- Latest cricket news and match reports
- Categorized news articles
- Timestamped updates

## 🔧 API Endpoints

### Live Matches
- `GET /api/matches/live` - Get all live matches
- `GET /api/matches/:id` - Get specific match details

### News & Information
- `GET /api/news` - Get latest cricket news
- `GET /api/rankings/:format` - Get player rankings (test/odi)
- `GET /api/series` - Get cricket series information

### WebSocket Events
- `liveMatches` - Real-time match updates every 30 seconds

## 🎯 Key Features Comparison with CricLine Guru

| Feature | Cricket Live Line | CricLine Guru |
|---------|-------------------|---------------|
| Live Scores | ✅ Real-time | ✅ |
| Ball-by-ball Commentary | ✅ | ✅ |
| Player Rankings | ✅ | ✅ |
| Series Information | ✅ | ✅ |
| Cricket News | ✅ | ✅ |
| Modern UI | ✅ Enhanced | ⚡ |
| Real-time Updates | ✅ WebSocket | ✅ |
| Mobile Responsive | ✅ | ✅ |

## 🔮 Future Enhancements

- [ ] **Player Profiles** - Detailed player statistics and career records
- [ ] **Match Predictions** - AI-powered match outcome predictions
- [ ] **Fantasy Cricket** - Integration with fantasy cricket features
- [ ] **Push Notifications** - Browser notifications for important events
- [ ] **Social Features** - User polls and community discussions
- [ ] **Video Highlights** - Integration with match video highlights
- [ ] **Multiple Languages** - Support for regional languages
- [ ] **Dark Mode** - Theme switching for better user experience

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by CricLine Guru and other cricket live score applications
- Icons provided by React Icons
- UI design inspired by modern sports applications

## 📞 Support

For support, email support@cricketliveline.com or create an issue in the repository.

---

**Built with ❤️ for cricket fans worldwide** 🏏