import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaTrophy, FaMedal } from 'react-icons/fa';
import axios from 'axios';

const RankingsContainer = styled.div`
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

const FormatTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
`;

const FormatTab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const RankingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const RankingCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PlayerRank = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.2s ease;

  &:hover {
    background: rgba(30, 58, 138, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RankNumber = styled.div<{ rank: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ rank, theme }) => 
    rank === 1 ? '#ffd700' :
    rank === 2 ? '#c0c0c0' :
    rank === 3 ? '#cd7f32' :
    theme.colors.primary
  };
  color: ${({ rank }) => rank <= 3 ? '#000' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PlayerCountry = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PlayerPoints = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

interface Player {
  rank: number;
  name: string;
  country: string;
  points: number;
}

interface Rankings {
  batsmen: Player[];
  bowlers: Player[];
}

const Rankings: React.FC = () => {
  const [rankings, setRankings] = useState<Rankings>({ batsmen: [], bowlers: [] });
  const [activeFormat, setActiveFormat] = useState<'test' | 'odi'>('test');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rankings/${activeFormat}`);
        setRankings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setLoading(false);
      }
    };

    fetchRankings();
  }, [activeFormat]);

  if (loading) {
    return (
      <RankingsContainer>
        <div>Loading rankings...</div>
      </RankingsContainer>
    );
  }

  return (
    <RankingsContainer>
      <PageTitle>
        <FaChartBar />
        ICC Player Rankings
      </PageTitle>

      <FormatTabs>
        <FormatTab 
          active={activeFormat === 'test'}
          onClick={() => setActiveFormat('test')}
        >
          Test Cricket
        </FormatTab>
        <FormatTab 
          active={activeFormat === 'odi'}
          onClick={() => setActiveFormat('odi')}
        >
          ODI Cricket
        </FormatTab>
      </FormatTabs>

      <RankingsGrid>
        <RankingCard>
          <CardTitle>
            <FaTrophy />
            Top Batsmen
          </CardTitle>
          {rankings.batsmen.map(player => (
            <PlayerRank key={player.rank}>
              <RankNumber rank={player.rank}>
                {player.rank <= 3 ? (
                  <FaMedal />
                ) : (
                  player.rank
                )}
              </RankNumber>
              <PlayerInfo>
                <PlayerName>{player.name}</PlayerName>
                <PlayerCountry>{player.country}</PlayerCountry>
              </PlayerInfo>
              <PlayerPoints>{player.points}</PlayerPoints>
            </PlayerRank>
          ))}
        </RankingCard>

        <RankingCard>
          <CardTitle>
            <FaTrophy />
            Top Bowlers
          </CardTitle>
          {rankings.bowlers.map(player => (
            <PlayerRank key={player.rank}>
              <RankNumber rank={player.rank}>
                {player.rank <= 3 ? (
                  <FaMedal />
                ) : (
                  player.rank
                )}
              </RankNumber>
              <PlayerInfo>
                <PlayerName>{player.name}</PlayerName>
                <PlayerCountry>{player.country}</PlayerCountry>
              </PlayerInfo>
              <PlayerPoints>{player.points}</PlayerPoints>
            </PlayerRank>
          ))}
        </RankingCard>
      </RankingsGrid>
    </RankingsContainer>
  );
};

export default Rankings;