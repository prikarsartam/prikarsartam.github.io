import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { type Note } from '../../services/storage';

const Card = styled.div`
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px; /* Reduced padding */
  cursor: pointer;
  transition: all 0.2s;
  height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 0.9rem; /* Smaller title */
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const DateStr = styled.span`
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: auto; /* Push to bottom */
  display: block;
  text-align: right;
`;

const Preview = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex: 1;
  overflow: hidden;
  margin-bottom: 12px;
  line-height: 1.5;
  
  p { margin: 0; }
  h1, h2, h3, h4, h5, h6 { font-size: 1em; margin: 0; font-weight: 600; }
  ul, ol { padding-left: 1.2em; margin: 0; }
`;

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}
export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Header>
        <Title>{note.title}</Title>
      </Header>
      <Preview>
        <ReactMarkdown>
          {(() => {
            // Remove the first line if it's a header or matches title
            const lines = note.content.split('\n');
            let contentToPreview = note.content;
            if (lines.length > 0) {
              const firstLine = lines[0].trim();
              if (firstLine.startsWith('#') || firstLine.toLowerCase().includes(note.title.toLowerCase())) {
                contentToPreview = lines.slice(1).join('\n').trim();
              }
            }
            return contentToPreview.substring(0, 150) + (contentToPreview.length > 150 ? '...' : '');
          })()}
        </ReactMarkdown>
      </Preview>
      <DateStr>{note.last_updated}</DateStr>
    </Card>
  );
};
