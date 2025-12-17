import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const Container = styled(motion.div) <{ borderColor?: string }>`
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0;
  overflow: hidden;
  position: relative;
`;

export const Header = styled.div`
  padding: 8px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  max-width: calc(100% - 120px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px 10px 10px;

  @media  {
    padding-bottom: 5px;
  }
`;

export const MarkdownContent = styled.div`
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.4;

  /* Headings */
  h1 { display: none; }
  
  h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 700;
  }
  
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  
  p { margin: 1em 0; }

  /* Style links for dark mode visibility */
  a {
    color: var(--accent-color);
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
      text-decoration-thickness: 2px;
    }
    
    &:visited {
      color: #a78bfa;
    }
  }
  
  code {
    background-color: rgba(128, 128, 128, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.9em;
    border: 1px solid var(--border-color);
  }
  
  pre {
    margin: 1em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    padding: 16px;
  }
  
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  
  li { margin: 0.5em 0; }
  

  /* Table Styles */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5em 0;
    overflow-x: auto;
    display: block;
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background-color: var(--bg-secondary);
    font-weight: 600;
  }

  tr:nth-of-type(even) {
    background-color: rgba(128, 128, 128, 0.05);
  }

  /* Blockquote - default style (can be overridden by custom component if it's a callout) */
  blockquote {
    border-left: 4px solid var(--accent-color);
    padding-left: 1em;
    margin: 1em 0;
    color: var(--text-secondary);
    font-style: italic;
  }
`;

export const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 5px auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: zoom-in;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

/* 2. Styling Components
   These styled components control the valid CSS for the callout boxes.
   We use 'color' prop to dynamically apply the base color defined above. */

export const AlertContainer = styled.div<{ color: string }>`
  /* Border: Solid color on the left */
  border-left: 4px solid ${props => props.color};  
  
  /* Background: We append '1a' (approx 10% opacity) to the hex color.
     This ensures it looks good on BOTH Dark and Light themes by tinting the background.
     If you want a solid color, remove the '1a'. */
  background-color: ${props => props.color}1a;
  
  /* Optional: Add a subtle border around the rest */
  border: 1px solid ${props => props.color}33; /* 33 = ~20% opacity */
  /* border-left-width: 4px; -- already set above, but good for clarity */
  
  border-radius: 4px;
  margin: 1em 0;
  overflow: hidden;
`;

export const AlertTitle = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-weight: 600;
  
  /* Text Color: Uses the solid base color */
  color: ${props => props.color};
  
  /* Title Background: Very subtle tint (5% opacity) to distinguish title area slightly */
  background-color: ${props => props.color}0d; 
  
  gap: 8px;
  font-size: 0.95em;
`;

export const AlertContent = styled.div`
  padding: 8px 16px 16px 16px;
  color: var(--text-primary); /* Uses theme text color */
  
  p { margin: 8px 0; }
  p:first-of-type { margin-top: 0; }
  p:last-of-type { margin-bottom: 0; }
`;
