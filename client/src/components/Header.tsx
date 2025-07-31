import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCricketBall, FaCircle } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const LogoIcon = styled(FaCricketBall)`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.accent};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.9rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    gap: 4px;
    padding: 4px 8px;
  }
`;

const LiveDot = styled(FaCircle)`
  color: ${({ theme }) => theme.colors.live};
  font-size: 0.6rem;
  animation: pulse 2s infinite;
`;

const LiveText = styled.span`
  font-weight: 500;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon />
          <span>Cricket Live Line</span>
        </Logo>
        <LiveIndicator>
          <LiveDot />
          <LiveText>2 LIVE</LiveText>
        </LiveIndicator>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;