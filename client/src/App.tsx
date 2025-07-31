import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LiveMatches from './pages/LiveMatches';
import MatchDetails from './pages/MatchDetails';
import News from './pages/News';
import Rankings from './pages/Rankings';
import Series from './pages/Series';

const theme = {
  colors: {
    primary: '#1e3a8a',
    secondary: '#059669',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    live: '#dc2626',
    border: '#e5e7eb'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }

  .live-indicator {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 120px; // Account for fixed header and navigation
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-top: 100px;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header />
          <Navigation />
          <Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<LiveMatches />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/series" element={<Series />} />
            </Routes>
          </Main>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
