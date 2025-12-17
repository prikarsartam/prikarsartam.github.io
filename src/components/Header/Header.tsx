import React from 'react';
import styled from '@emotion/styled';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';

const HeaderContainer = styled.header`
  height: 60px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
`;

// const QuoteText = styled.div`
//   font-size: 0.8rem;
//   color: var(--text-secondary);
//   font-style: italic;
//   text-align: right;
//   white-space: pre-line; /* Enable newlines */
// `;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
  font-family: 'Inter', sans-serif;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <HeaderContainer>
      <Logo>notework</Logo>
      <ThemeToggle onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </ThemeToggle>
    </HeaderContainer>
  );
};
