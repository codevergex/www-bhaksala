import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaCircle, FaCalendarAlt, FaNewspaper, FaTrophy, FaChartBar } from 'react-icons/fa';

const NavigationContainer = styled.nav`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 999;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 60px;
  }
`;

const NavigationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(30, 58, 138, 0.05);
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    background: rgba(30, 58, 138, 0.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.9rem;
    
    span {
      display: none;
    }
  }
`;

const NavIcon = styled.div`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/live', icon: FaCircle, label: 'Live' },
    { path: '/series', icon: FaCalendarAlt, label: 'Series' },
    { path: '/news', icon: FaNewspaper, label: 'News' },
    { path: '/rankings', icon: FaChartBar, label: 'Rankings' },
  ];

  return (
    <NavigationContainer>
      <NavigationContent>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavItem
            key={path}
            to={path}
            className={location.pathname === path ? 'active' : ''}
          >
            <NavIcon>
              <Icon />
            </NavIcon>
            <span>{label}</span>
          </NavItem>
        ))}
      </NavigationContent>
    </NavigationContainer>
  );
};

export default Navigation;