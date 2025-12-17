import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Note } from '../../services/storage';

// Modular Imports
import {
  remarkCallouts,
  getCalloutColor,
  getCalloutIcon,
  getAlignment,
  stripAlignmentMarker
} from '../../utils/markdownUtils';

import {
  Container,
  Header,
  Title,
  CloseButton,
  ScrollArea,
  MarkdownContent,
  StyledImage,
  AlertContainer,
  AlertTitle,
  AlertContent
} from './FocusView.styles';

interface FocusViewProps {
  note: Note;
  onClose: () => void;
}

const localImages = import.meta.glob('../../notes/images/*', { as: 'url', eager: true });



export const FocusView: React.FC<FocusViewProps> = ({ note, onClose }) => {
  const { setFocusedNoteId } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedNoteId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setFocusedNoteId]);

  return (
    <Container
      borderColor={note.color}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <Title>{note.title}</Title>
        <CloseButton onClick={onClose} title="Close (Esc)">
          <X size={24} />
        </CloseButton>
      </Header>
      <ScrollArea>
        <MarkdownContent>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkCallouts]}
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeExternalLinks]}
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
              p: ({ children, ...props }) => {
                const childrenArray = React.Children.toArray(children);
                const firstChild = childrenArray[0];

                if (typeof firstChild === 'string') {
                  const alignment = getAlignment(firstChild);
                  if (alignment !== 'left') {
                    const formmatedText = stripAlignmentMarker(firstChild);
                    const newChildren = [formmatedText, ...childrenArray.slice(1)];
                    return <p style={{ textAlign: alignment, margin: '1em 0' }} {...props}>{newChildren}</p>;
                  }
                }
                return <p {...props}>{children}</p>;
              },
              img: ({ node, src, ...props }) => {
                let finalSrc = src;
                if (src && src.startsWith('/images/')) {
                  const filename = src.replace('/images/', '');
                  const foundKey = Object.keys(localImages).find(key => key.endsWith(`/${filename}`));
                  if (foundKey) {
                    finalSrc = localImages[foundKey];
                  }
                }
                return <StyledImage src={finalSrc} {...props} loading="lazy" />;
              },
              blockquote: ({ node, children, ...props }) => {
                const data = (node?.data as any)?.hProperties || {};
                const propCallout = (props as any)['data-callout'];
                const propTitle = (props as any)['data-title'];

                const calloutType = data['data-callout'] || propCallout;
                const calloutTitle = data['data-title'] || propTitle;

                if (calloutType) {
                  const color = getCalloutColor(calloutType);
                  const Icon = getCalloutIcon(calloutType);
                  const title = calloutTitle || (calloutType.charAt(0).toUpperCase() + calloutType.slice(1));

                  return (
                    <AlertContainer color={color}>
                      <AlertTitle color={color}>
                        <Icon size={18} />
                        {title}
                      </AlertTitle>
                      <AlertContent>{children}</AlertContent>
                    </AlertContainer>
                  );
                }
                return <blockquote {...props}>{children}</blockquote>;
              }
            }}
          >
            {note.content}
          </ReactMarkdown>
        </MarkdownContent>
      </ScrollArea>
    </Container>
  );
};
