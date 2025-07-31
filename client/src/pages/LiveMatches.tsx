import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCircle, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';

const LiveContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LiveMatchCard = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MatchInfo = styled.div`
  flex: 1;
`;

const MatchTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MatchDetails = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.live};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  font-weight: 500;
`;

const TeamsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TeamName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
`;

const TeamScore = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const TeamOvers = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 80px;
  text-align: right;
`;

const MatchStatus = styled.div`
  background: rgba(30, 58, 138, 0.05);
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-weight: 500;
`;

const RecentBalls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const RecentBallsLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const Ball = styled.div<{ runs: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ runs, theme }) => 
    runs === '4' ? theme.colors.success :
    runs === '6' ? theme.colors.accent :
    runs === '0' ? theme.colors.textSecondary :
    theme.colors.primary
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
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
  recentOvers: string[];
  target?: string;
}

const LiveMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches/live');
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();

    // Setup WebSocket for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('liveMatches', (liveMatches: Match[]) => {
      setMatches(liveMatches);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <LiveContainer>
        <div>Loading live matches...</div>
      </LiveContainer>
    );
  }

  return (
    <LiveContainer>
      <PageTitle>
        <FaCircle style={{ color: '#dc2626', fontSize: '1rem' }} />
        Live Cricket Matches
      </PageTitle>

      {matches.length === 0 ? (
        <div>No live matches at the moment</div>
      ) : (
        matches.map(match => (
          <LiveMatchCard key={match.id} to={`/match/${match.id}`}>
            <MatchHeader>
              <MatchInfo>
                <MatchTitle>{match.title}</MatchTitle>
                <MatchDetails>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaMapMarkerAlt />
                    {match.venue}
                  </div>
                  {match.target && <div>{match.target}</div>}
                </MatchDetails>
              </MatchInfo>
              <LiveBadge>
                <FaCircle style={{ fontSize: '0.5rem', animation: 'pulse 2s infinite' }} />
                LIVE
              </LiveBadge>
            </MatchHeader>

            <TeamsSection>
              <TeamRow>
                <TeamName>{match.teams.team1.name}</TeamName>
                <TeamScore>{match.teams.team1.score}</TeamScore>
                <TeamOvers>({match.teams.team1.overs} ov)</TeamOvers>
              </TeamRow>
              <TeamRow>
                <TeamName>{match.teams.team2.name}</TeamName>
                <TeamScore>{match.teams.team2.score}</TeamScore>
                <TeamOvers>({match.teams.team2.overs} ov)</TeamOvers>
              </TeamRow>
            </TeamsSection>

            <MatchStatus>{match.currentInning}</MatchStatus>

            <RecentBalls>
              <RecentBallsLabel>Recent:</RecentBallsLabel>
              {match.recentOvers.slice(0, 6).map((runs, index) => (
                <Ball key={index} runs={runs}>
                  {runs}
                </Ball>
              ))}
            </RecentBalls>
          </LiveMatchCard>
        ))
      )}
    </LiveContainer>
  );
};

export default LiveMatches;