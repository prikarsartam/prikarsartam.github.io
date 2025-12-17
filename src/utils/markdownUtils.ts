import { Info, AlertTriangle, Flame, Zap, Bug, FileText, Quote, Pencil } from 'lucide-react';

/* 1. Callout Colors */
export const calloutColors: Record<string, string> = {
    note: '#086ddd',      // Blue
    tip: '#00bfa5',       // Teal/Emerald
    important: '#9333ea', // Purple
    warning: '#e6a700',   // Amber/Orange
    fail: '#d93f0b',      // Red-Orange
    error: '#d32f2f',     // Red
    bug: '#f43f5e',       // Rose
    example: '#7c4dff',   // Violet
    quote: '#9e9e9e',     // Gray
};

export const getCalloutColor = (type: string) => {
    if (['note'].includes(type)) return calloutColors.note;
    if (['tip', 'hint'].includes(type)) return calloutColors.tip;
    if (['important', 'attention', 'caution'].includes(type)) return calloutColors.important;
    if (['warning'].includes(type)) return calloutColors.warning;
    if (['fail', 'failure', 'missing'].includes(type)) return calloutColors.fail;
    if (['error', 'danger'].includes(type)) return calloutColors.error;
    if (['bug'].includes(type)) return calloutColors.bug;
    if (['example'].includes(type)) return calloutColors.example;
    if (['quote', 'cite'].includes(type)) return calloutColors.quote;
    return calloutColors.note;
};

export const getCalloutIcon = (type: string) => {
    switch (type) {
        case 'note': return Pencil;
        case 'tip': return Flame;
        case 'important': return Zap;
        case 'warning': return AlertTriangle;
        case 'error': return Zap;
        case 'bug': return Bug;
        case 'example': return FileText;
        case 'quote': return Quote;
        default: return Info;
    }
};

/* Remark Plugin */
export const remarkCallouts = () => {
    return (tree: any) => {
        const visit = (node: any) => {
            if (node.children) node.children.forEach(visit);

            if (node.type === 'blockquote') {
                const firstChild = node.children[0];
                if (firstChild && firstChild.type === 'paragraph') {
                    const firstTextNode = firstChild.children[0];

                    if (firstTextNode && firstTextNode.type === 'text') {
                        const text = firstTextNode.value;
                        // Robust regex allow start match
                        const match = text.match(/^\[!([\w-]+)\](?:[ \t]+(.*?))?(\n|$)/);
                        const strictMatch = text.match(/^\[!([\w-]+)\]/);

                        let type = '';
                        let title = '';
                        let cutIndex = 0;

                        if (match) {
                            type = match[1];
                            title = match[2];
                            cutIndex = match[0].length;
                        } else if (strictMatch) {
                            type = strictMatch[1];
                            const newlineIndex = text.indexOf('\n');
                            if (newlineIndex !== -1) {
                                title = text.substring(strictMatch[0].length, newlineIndex).trim();
                                cutIndex = newlineIndex + 1;
                            } else {
                                title = text.substring(strictMatch[0].length).trim();
                                cutIndex = text.length;
                            }
                        }

                        if (type) {
                            type = type.toLowerCase();
                            node.data = node.data || {};
                            node.data.hProperties = node.data.hProperties || {};
                            node.data.hProperties['data-callout'] = type;
                            node.data.hProperties['data-title'] = title;

                            const remainingText = text.substring(cutIndex);
                            if (!remainingText.trim()) {
                                firstChild.children.shift();
                                if (firstChild.children.length === 0) {
                                    node.children.shift();
                                }
                            } else {
                                firstTextNode.value = remainingText;
                            }
                        }
                    }
                }
            }
        };
        visit(tree);
    };
};

export const getAlignment = (text: string) => {
    if (text.startsWith('-><- ') || text.startsWith('>< ')) return 'center';
    if (text.startsWith('-> ')) return 'right';
    return 'left';
};

export const stripAlignmentMarker = (text: string) => {
    if (text.startsWith('-><- ')) return text.substring(5);
    if (text.startsWith('>< ')) return text.substring(3);
    if (text.startsWith('-> ')) return text.substring(3);
    return text;
};
