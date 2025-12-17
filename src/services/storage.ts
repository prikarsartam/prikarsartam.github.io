// Simple frontmatter parser to avoid gray-matter/Buffer issues in browser
function parseFrontmatter(content: string) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: content };
    }

    const yamlBlock = match[1];
    const body = match[2];
    const data: any = {};

    yamlBlock.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            // Handle arrays like [a, b]
            if (value.startsWith('[') && value.endsWith(']')) {
                const arrayContent = value.slice(1, -1);
                data[key.trim()] = arrayContent ? arrayContent.split(',').map(s => s.trim()) : [];
            } else {
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                data[key.trim()] = value;
            }
        }
    });

    // Parse numbers
    if (data.level) data.level = parseInt(data.level, 10);

    return { data, content: body };
}

export interface Note {
    id: string;
    title: string;
    content: string;
    level: number;
    color?: string;
    parent: string | null;
    connections: string[];
    path: string;
    last_updated: string;
}

export interface GraphNode extends Note {
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    radius?: number;
}

export interface GraphLink {
    source: string | GraphNode;
    target: string | GraphNode;
    value: number;
    type: 'hierarchical' | 'arbitrary';
}

// Load all markdown files from src/notes
const noteFiles = import.meta.glob('/src/notes/*.md', { as: 'raw', eager: true });
const noteFilesRelative = import.meta.glob('../notes/*.md', { as: 'raw', eager: true });

export async function loadNotes(): Promise<Note[]> {
    console.log('Loading notes...');
    const filesToUse = Object.keys(noteFiles).length > 0 ? noteFiles : noteFilesRelative;
    console.log('Found files:', Object.keys(filesToUse).length);

    const notes: Note[] = [];

    for (const [path, rawContent] of Object.entries(filesToUse)) {
        try {
            const { data, content } = parseFrontmatter(rawContent as string);

            // Generate random date if missing (for demo purposes)
            const randomDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0];

            const note: Note = {
                id: data.id || path.split('/').pop()?.replace('.md', '') || '',
                title: data.title || 'Untitled',
                content: content.trim(),
                level: typeof data.level === 'number' ? data.level : 0,
                color: data.color,
                parent: data.parent === 'null' ? null : (data.parent || null),
                connections: data.connections || [],
                path,
                last_updated: data.last_updated || randomDate,
            };

            notes.push(note);
        } catch (error) {
            console.error('Error parsing note:', path, error);
        }
    }

    console.log('Parsed notes:', notes.length);
    return notes;
}

// Build hierarchical structure
export function buildHierarchy(notes: Note[]): Map<number, Note[]> {
    const hierarchy = new Map<number, Note[]>();

    notes.forEach(note => {
        const level = note.level;
        if (!hierarchy.has(level)) {
            hierarchy.set(level, []);
        }
        hierarchy.get(level)!.push(note);
    });

    // Sort each level by title
    hierarchy.forEach(levelNotes => {
        levelNotes.sort((a, b) => a.title.localeCompare(b.title));
    });

    return hierarchy;
}

// Get arbitrary connections from localStorage
export function getArbitraryConnections(): Set<string> {
    const stored = localStorage.getItem('arbitrary-connections');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Save arbitrary connections to localStorage
export function saveArbitraryConnections(connections: Set<string>): void {
    localStorage.setItem('arbitrary-connections', JSON.stringify(Array.from(connections)));
}

// Toggle arbitrary connection
export function toggleConnection(nodeA: string, nodeB: string): void {
    const connections = getArbitraryConnections();
    const key = [nodeA, nodeB].sort().join('::');

    if (connections.has(key)) {
        connections.delete(key);
    } else {
        connections.add(key);
    }

    saveArbitraryConnections(connections);
}

// Check if two nodes are connected
export function areConnected(nodeA: string, nodeB: string): boolean {
    const connections = getArbitraryConnections();
    const key = [nodeA, nodeB].sort().join('::');
    return connections.has(key);
}
