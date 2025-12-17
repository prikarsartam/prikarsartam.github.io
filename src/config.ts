export const CONFIG = {
    THEME: {
        LIGHT: {
            bgPrimary: '#ffffff',
            bgSecondary: '#f8f9fa',
            textPrimary: '#212529',
            textSecondary: '#297fcaff',
            borderColor: '#dee2e6',
            accentColor: '#0d6efd',
        },
        DARK: {
            bgPrimary: '#0f0f12',
            bgSecondary: '#18181b',
            textPrimary: '#f4f4f5',
            textSecondary: '#5885acff',
            borderColor: '#27272a',
            accentColor: '#818cf8',
        }
    },
    UI: {
        BASE_FONT_SIZE: '2px', // Global scaling
        GRID_COLUMN_MIN_WIDTH: '195px',
        SIDEBAR_WIDTH: '300px', // Approximate
        MAX_LEVELS: 8,
    },
    GRAPH: {
        RADIUS_BUFFER: 40,
        RADIUS_SCALE: 1.0,
        ANIMATION: {
            VELOCITY_DECAY: 10, // Higher = Slower
            STRENGTH_RADIAL: 0.8,
            STRENGTH_CHARGE: -200,
        },
        EDGES: {
            HIERARCHICAL_OPACITY: 0.6,
            DIMMED_OPACITY: 0.1,
            HIGHLIGHT_OPACITY: 0.8,
            BASE_LENGTH: 50,
        },
        NODES: {
            // RADIUS_L0: 13,
            // RADIUS_L1: 9,
            // RADIUS_L2: 6,
            // RADIUS_L3: 4,
            // RADIUS_L4: 2,
            // DIMMED_OPACITY: 0.65, // Very dim for strict highlighting

            // Map specific levels to radius values.
            // You can add arbitrary integers here (e.g., 5: 2, 10: 1).
            RADIUS_BY_LEVEL: {
                0: 14,
                1: 9,
                2: 7,
                3: 5,
                4: 3,
            } as Record<number, number>,
            
            // Fallback for any level not explicitly defined above
            DEFAULT_RADIUS: 1, 
            
            DIMMED_OPACITY: 0.65,
        }
    }
};
