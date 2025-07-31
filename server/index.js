const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Mock data for cricket matches
let liveMatches = [
  {
    id: 1,
    title: "India vs England - 5th Test",
    status: "Live",
    teams: {
      team1: { name: "India", score: "245/4", overs: "68.2" },
      team2: { name: "England", score: "353", overs: "89.4" }
    },
    venue: "The Oval, London",
    toss: "England won the toss and chose to bat",
    currentInning: "India 1st Innings",
    liveCommentary: [
      { ball: "68.2", bowler: "J. Root", batsman: "V. Kohli", commentary: "Short of length, defended back to the bowler", runs: 0 },
      { ball: "68.1", bowler: "J. Root", batsman: "V. Kohli", commentary: "Full delivery, driven straight to mid-off", runs: 0 }
    ],
    currentBatsmen: [
      { name: "V. Kohli", score: "45*", balls: 67, fours: 6, sixes: 0 },
      { name: "K.L. Rahul", score: "23*", balls: 31, fours: 2, sixes: 0 }
    ],
    currentBowler: { name: "J. Root", overs: "8.2", maidens: 1, runs: 24, wickets: 0 },
    recentOvers: ["1", "0", "4", "2", "1", "0"]
  },
  {
    id: 2,
    title: "Australia vs South Africa - 2nd ODI",
    status: "Live",
    teams: {
      team1: { name: "Australia", score: "189/3", overs: "32.4" },
      team2: { name: "South Africa", score: "276/8", overs: "50.0" }
    },
    venue: "Adelaide Oval",
    toss: "South Africa won the toss and chose to bat",
    currentInning: "Australia 1st Innings",
    target: "277 runs needed from 104 balls",
    liveCommentary: [
      { ball: "32.4", bowler: "K. Rabada", batsman: "S. Smith", commentary: "Good length ball, played to square leg for a single", runs: 1 },
      { ball: "32.3", bowler: "K. Rabada", batsman: "M. Labuschagne", commentary: "Short ball, pulled hard to deep square leg for FOUR!", runs: 4 }
    ],
    currentBatsmen: [
      { name: "S. Smith", score: "67*", balls: 71, fours: 7, sixes: 1 },
      { name: "M. Labuschagne", score: "34*", balls: 41, fours: 4, sixes: 0 }
    ],
    currentBowler: { name: "K. Rabada", overs: "7.4", maidens: 0, runs: 38, wickets: 1 },
    recentOvers: ["6", "8", "4", "7", "5", "12"]
  }
];

let cricketNews = [
  {
    id: 1,
    title: "India takes commanding lead in 5th Test against England",
    summary: "Virat Kohli's brilliant innings puts India in strong position",
    timestamp: "2 hours ago",
    category: "Match Report"
  },
  {
    id: 2,
    title: "World Cup 2025 Schedule Announced",
    summary: "ICC announces dates and venues for upcoming Cricket World Cup",
    timestamp: "5 hours ago",
    category: "Tournament News"
  },
  {
    id: 3,
    title: "IPL 2025 Auction: Key Players to Watch",
    summary: "Top international players set for bidding war in upcoming auction",
    timestamp: "1 day ago",
    category: "IPL News"
  }
];

let playerRankings = {
  test: {
    batsmen: [
      { rank: 1, name: "Joe Root", country: "England", points: 893 },
      { rank: 2, name: "Marnus Labuschagne", country: "Australia", points: 848 },
      { rank: 3, name: "Kane Williamson", country: "New Zealand", points: 829 }
    ],
    bowlers: [
      { rank: 1, name: "Pat Cummins", country: "Australia", points: 908 },
      { rank: 2, name: "Jasprit Bumrah", country: "India", points: 883 },
      { rank: 3, name: "Kagiso Rabada", country: "South Africa", points: 862 }
    ]
  },
  odi: {
    batsmen: [
      { rank: 1, name: "Babar Azam", country: "Pakistan", points: 887 },
      { rank: 2, name: "Rassie van der Dussen", country: "South Africa", points: 777 },
      { rank: 3, name: "Virat Kohli", country: "India", points: 746 }
    ],
    bowlers: [
      { rank: 1, name: "Josh Hazlewood", country: "Australia", points: 728 },
      { rank: 2, name: "Trent Boult", country: "New Zealand", points: 715 },
      { rank: 3, name: "Mujeeb Ur Rahman", country: "Afghanistan", points: 701 }
    ]
  }
};

// API Routes
app.get('/api/matches/live', (req, res) => {
  res.json(liveMatches);
});

app.get('/api/matches/:id', (req, res) => {
  const match = liveMatches.find(m => m.id === parseInt(req.params.id));
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  res.json(match);
});

app.get('/api/news', (req, res) => {
  res.json(cricketNews);
});

app.get('/api/rankings/:format', (req, res) => {
  const format = req.params.format.toLowerCase();
  if (!playerRankings[format]) {
    return res.status(404).json({ error: 'Format not found' });
  }
  res.json(playerRankings[format]);
});

app.get('/api/series', (req, res) => {
  const series = [
    {
      id: 1,
      name: "India tour of England 2025",
      format: "Test",
      status: "Live",
      matches: 5,
      completed: 4
    },
    {
      id: 2,
      name: "Australia tour of South Africa 2025",
      format: "ODI",
      status: "Live",
      matches: 3,
      completed: 1
    },
    {
      id: 3,
      name: "IPL 2025",
      format: "T20",
      status: "Upcoming",
      matches: 74,
      completed: 0
    }
  ];
  res.json(series);
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send initial live matches data
  socket.emit('liveMatches', liveMatches);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simulate live score updates every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  // Update live matches with new ball-by-ball data
  liveMatches.forEach(match => {
    if (match.status === 'Live') {
      // Simulate score updates
      const team1Score = match.teams.team1.score.split('/');
      const runs = parseInt(team1Score[0]);
      const wickets = parseInt(team1Score[1]);
      
      // Random score update (0-6 runs)
      const newRuns = Math.floor(Math.random() * 7);
      const newTotalRuns = runs + newRuns;
      
      // Update overs
      const overs = match.teams.team1.overs.split('.');
      let overNum = parseInt(overs[0]);
      let ballNum = parseInt(overs[1]) + 1;
      
      if (ballNum > 5) {
        ballNum = 0;
        overNum += 1;
      }
      
      match.teams.team1.score = `${newTotalRuns}/${wickets}`;
      match.teams.team1.overs = `${overNum}.${ballNum}`;
      
      // Add new commentary
      const commentaries = [
        "Driven straight down the ground",
        "Worked away to the leg side",
        "Defended back to the bowler",
        "Cut away to point for a boundary",
        "Pulled hard to deep square leg",
        "Played to cover for a quick single"
      ];
      
      const newCommentary = {
        ball: `${overNum}.${ballNum}`,
        bowler: match.currentBowler.name,
        batsman: match.currentBatsmen[0].name,
        commentary: commentaries[Math.floor(Math.random() * commentaries.length)],
        runs: newRuns
      };
      
      match.liveCommentary.unshift(newCommentary);
      if (match.liveCommentary.length > 10) {
        match.liveCommentary.pop();
      }
      
      // Update recent overs
      match.recentOvers.unshift(newRuns.toString());
      if (match.recentOvers.length > 6) {
        match.recentOvers.pop();
      }
    }
  });
  
  // Broadcast updates to all connected clients
  io.emit('liveMatches', liveMatches);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`🏏 Cricket Live Line Server running on port ${PORT}`);
  console.log(`📊 Live scores updating every 30 seconds`);
});