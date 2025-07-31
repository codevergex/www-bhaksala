import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCircle, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const MatchCard = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MatchTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.live};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const LiveDot = styled(FaCircle)`
  font-size: 0.5rem;
  animation: pulse 2s infinite;
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TeamScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const TeamName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Score = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Overs = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VsText = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

const MatchStatus = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const NewsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
`;

const NewsTimestamp = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface Match {
  id: number;
  title: string;
  status: string;
  teams: {
    team1: { name: string; score: string; overs: string };
    team2: { name: string; score: string; overs: string };
  };
  venue: string;
  currentInning: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  category: string;
}

const Home: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [matchesResponse, newsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/matches/live'),
          axios.get('http://localhost:5000/api/news')
        ]);
        
        setLiveMatches(matchesResponse.data);
        setNews(newsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Setup WebSocket connection for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('liveMatches', (matches: Match[]) => {
      setLiveMatches(matches);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <div>Loading...</div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaCircle style={{ color: '#dc2626', fontSize: '0.8rem' }} />
            Live Matches
          </SectionTitle>
          <ViewAllLink to="/live">
            View All <FaArrowRight />
          </ViewAllLink>
        </SectionHeader>
        
        {liveMatches.map(match => (
          <MatchCard key={match.id} to={`/match/${match.id}`}>
            <MatchHeader>
              <div>
                <MatchTitle>{match.title}</MatchTitle>
                <MatchInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaMapMarkerAlt />
                    {match.venue}
                  </div>
                </MatchInfo>
              </div>
              <LiveBadge>
                <LiveDot />
                LIVE
              </LiveBadge>
            </MatchHeader>
            
            <TeamsContainer>
              <TeamScore>
                <TeamName>{match.teams.team1.name}</TeamName>
                <Score>{match.teams.team1.score}</Score>
                <Overs>({match.teams.team1.overs} ov)</Overs>
              </TeamScore>
              
              <VsText>vs</VsText>
              
              <TeamScore>
                <TeamName>{match.teams.team2.name}</TeamName>
                <Score>{match.teams.team2.score}</Score>
                <Overs>({match.teams.team2.overs} ov)</Overs>
              </TeamScore>
            </TeamsContainer>
            
            <MatchStatus>{match.currentInning}</MatchStatus>
          </MatchCard>
        ))}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Latest Cricket News</SectionTitle>
          <ViewAllLink to="/news">
            View All <FaArrowRight />
          </ViewAllLink>
        </SectionHeader>
        
        <NewsGrid>
          {news.slice(0, 3).map(item => (
            <NewsCard key={item.id}>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsSummary>{item.summary}</NewsSummary>
              <NewsTimestamp>
                <FaClock />
                {item.timestamp}
              </NewsTimestamp>
            </NewsCard>
          ))}
        </NewsGrid>
      </Section>
    </HomeContainer>
  );
};

export default Home;