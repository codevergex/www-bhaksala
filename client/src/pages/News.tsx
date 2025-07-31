import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaNewspaper, FaClock, FaTag } from 'react-icons/fa';
import axios from 'axios';

const NewsContainer = styled.div`
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

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
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

const NewsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.6;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NewsTimestamp = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NewsCategory = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  category: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <NewsContainer>
        <div>Loading cricket news...</div>
      </NewsContainer>
    );
  }

  return (
    <NewsContainer>
      <PageTitle>
        <FaNewspaper />
        Cricket News
      </PageTitle>

      <NewsGrid>
        {news.map(item => (
          <NewsCard key={item.id}>
            <NewsTitle>{item.title}</NewsTitle>
            <NewsSummary>{item.summary}</NewsSummary>
            <NewsFooter>
              <NewsTimestamp>
                <FaClock />
                {item.timestamp}
              </NewsTimestamp>
              <NewsCategory>
                <FaTag />
                {item.category}
              </NewsCategory>
            </NewsFooter>
          </NewsCard>
        ))}
      </NewsGrid>
    </NewsContainer>
  );
};

export default News;