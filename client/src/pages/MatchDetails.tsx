import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaCircle, FaMapMarkerAlt, FaUsers, FaBaseballBall } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';

const MatchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MatchHeader = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MatchTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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
  font-size: 0.9rem;
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const ScoreSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const TeamScore = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const TeamName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Score = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Overs = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CommentaryList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CommentaryItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommentaryBall = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CommentaryText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PlayerStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerName = styled.div`
  font-weight: 600;
`;

const PlayerStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

interface MatchDetail {
  id: number;
  title: string;
  status: string;
  teams: {
    team1: { name: string; score: string; overs: string };
    team2: { name: string; score: string; overs: string };
  };
  venue: string;
  toss: string;
  currentInning: string;
  liveCommentary: Array<{
    ball: string;
    bowler: string;
    batsman: string;
    commentary: string;
    runs: number;
  }>;
  currentBatsmen: Array<{
    name: string;
    score: string;
    balls: number;
    fours: number;
    sixes: number;
  }>;
  currentBowler: {
    name: string;
    overs: string;
    maidens: number;
    runs: number;
    wickets: number;
  };
  target?: string;
}

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${id}`);
        setMatch(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match details:', error);
        setLoading(false);
      }
    };

    fetchMatch();

    // Setup WebSocket for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('liveMatches', (matches: MatchDetail[]) => {
      const updatedMatch = matches.find(m => m.id === parseInt(id || '0'));
      if (updatedMatch) {
        setMatch(updatedMatch);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <MatchContainer>
        <div>Loading match details...</div>
      </MatchContainer>
    );
  }

  if (!match) {
    return (
      <MatchContainer>
        <div>Match not found</div>
      </MatchContainer>
    );
  }

  return (
    <MatchContainer>
      <MatchHeader>
        <MatchTitle>
          {match.title}
          {match.status === 'Live' && (
            <LiveBadge>
              <FaCircle style={{ fontSize: '0.5rem', animation: 'pulse 2s infinite' }} />
              LIVE
            </LiveBadge>
          )}
        </MatchTitle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaMapMarkerAlt />
            {match.venue}
          </div>
        </div>
        
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          {match.toss}
        </div>
        
        {match.target && (
          <div style={{ 
            marginTop: '12px', 
            padding: '8px 12px', 
            background: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: '6px',
            color: '#f59e0b',
            fontWeight: '500'
          }}>
            {match.target}
          </div>
        )}
      </MatchHeader>

      <ScoreSection>
        <TeamScore>
          <TeamName>{match.teams.team1.name}</TeamName>
          <Score>{match.teams.team1.score}</Score>
          <Overs>({match.teams.team1.overs} overs)</Overs>
        </TeamScore>
        
        <TeamScore>
          <TeamName>{match.teams.team2.name}</TeamName>
          <Score>{match.teams.team2.score}</Score>
          <Overs>({match.teams.team2.overs} overs)</Overs>
        </TeamScore>
      </ScoreSection>

      <div style={{ 
        textAlign: 'center',
        padding: '12px',
        background: 'rgba(30, 58, 138, 0.05)',
        borderRadius: '8px',
        marginBottom: '24px',
        fontWeight: '500',
        color: '#1e3a8a'
      }}>
        {match.currentInning}
      </div>

      <ContentGrid>
        <Card>
          <CardTitle>
            <FaBaseballBall />
            Live Commentary
          </CardTitle>
          <CommentaryList>
            {match.liveCommentary.map((comment, index) => (
              <CommentaryItem key={index}>
                <CommentaryBall>
                  {comment.ball} - {comment.bowler} to {comment.batsman}
                  {comment.runs > 0 && (
                    <span style={{ 
                      marginLeft: '8px',
                      background: comment.runs === 4 ? '#10b981' : comment.runs === 6 ? '#f59e0b' : '#1e3a8a',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {comment.runs}
                    </span>
                  )}
                </CommentaryBall>
                <CommentaryText>{comment.commentary}</CommentaryText>
              </CommentaryItem>
            ))}
          </CommentaryList>
        </Card>

        <div>
          <Card style={{ marginBottom: '24px' }}>
            <CardTitle>
              <FaUsers />
              Current Batsmen
            </CardTitle>
            {match.currentBatsmen.map((batsman, index) => (
              <PlayerStat key={index}>
                <PlayerName>{batsman.name}</PlayerName>
                <PlayerStats>
                  <div>
                    <StatValue>{batsman.score}</StatValue> ({batsman.balls})
                  </div>
                  <div>
                    <StatValue>{batsman.fours}</StatValue> × 4s
                  </div>
                  <div>
                    <StatValue>{batsman.sixes}</StatValue> × 6s
                  </div>
                </PlayerStats>
              </PlayerStat>
            ))}
          </Card>

          <Card>
            <CardTitle>Current Bowler</CardTitle>
            <PlayerStat>
              <PlayerName>{match.currentBowler.name}</PlayerName>
              <PlayerStats>
                <div>
                  <StatValue>{match.currentBowler.overs}</StatValue> ov
                </div>
                <div>
                  <StatValue>{match.currentBowler.runs}</StatValue> runs
                </div>
                <div>
                  <StatValue>{match.currentBowler.wickets}</StatValue> wkts
                </div>
              </PlayerStats>
            </PlayerStat>
          </Card>
        </div>
      </ContentGrid>
    </MatchContainer>
  );
};

export default MatchDetails;