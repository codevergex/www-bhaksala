import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaTrophy, FaCircle, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const SeriesContainer = styled.div`
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

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SeriesCard = styled.div`
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

const SeriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SeriesTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const SeriesFormat = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ status, theme }) => 
    status === 'Live' ? theme.colors.live :
    status === 'Upcoming' ? theme.colors.accent :
    theme.colors.success
  };
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.sm};
  width: fit-content;
`;

const SeriesProgress = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const SeriesStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(30, 58, 138, 0.05);
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 500;
`;

interface SeriesData {
  id: number;
  name: string;
  format: string;
  status: string;
  matches: number;
  completed: number;
}

const Series: React.FC = () => {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/series');
        setSeries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching series:', error);
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  if (loading) {
    return (
      <SeriesContainer>
        <div>Loading cricket series...</div>
      </SeriesContainer>
    );
  }

  return (
    <SeriesContainer>
      <PageTitle>
        <FaTrophy />
        Cricket Series & Tournaments
      </PageTitle>

      <SeriesGrid>
        {series.map(seriesItem => {
          const progress = (seriesItem.completed / seriesItem.matches) * 100;
          
          return (
            <SeriesCard key={seriesItem.id}>
              <SeriesHeader>
                <div style={{ flex: 1 }}>
                  <SeriesTitle>{seriesItem.name}</SeriesTitle>
                  <SeriesFormat>{seriesItem.format}</SeriesFormat>
                </div>
              </SeriesHeader>

              <StatusBadge status={seriesItem.status}>
                {seriesItem.status === 'Live' && (
                  <FaCircle style={{ fontSize: '0.5rem', animation: 'pulse 2s infinite' }} />
                )}
                {seriesItem.status}
              </StatusBadge>

              <SeriesProgress>
                <ProgressBar>
                  <ProgressFill progress={progress} />
                </ProgressBar>
                <ProgressText>
                  {seriesItem.completed} of {seriesItem.matches} matches completed
                </ProgressText>
              </SeriesProgress>

              <SeriesStats>
                <StatItem>
                  <StatValue>{seriesItem.matches}</StatValue>
                  <StatLabel>Total Matches</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{seriesItem.matches - seriesItem.completed}</StatValue>
                  <StatLabel>Remaining</StatLabel>
                </StatItem>
              </SeriesStats>
            </SeriesCard>
          );
        })}
      </SeriesGrid>
    </SeriesContainer>
  );
};

export default Series;