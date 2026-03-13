Project Infrastructure

    Platform Philosophy: A gaming hub designed to handle 2D rendering while maintaining strict data persistence for competitive leaderboards.

    Version Control & Modularity: The project uses a monorepo structure, separating the Next.js frontend logic from the modular game scripts to ensure scalability as the library grows.

Core Technical Specifications

    Game Engine: Migrated to Kaplay.js to utilize its modernized component-based architecture and better support for TypeScript types compared to its predecessor.

    Data Pipeline:

        PostgreSQL: Handles relational data between players and their respective scores.

        Next.js API Routes: Acts as the secure middleware, receiving game results and validating session data before committing to the database.

    State Management: Utilizes a "Handshake" pattern between React and the Canvas API. This prevents memory leaks by explicitly killing game instances during page transitions.

    Dynamic Resolution: Implemented Delta Time (dt) scaling. This ensures that a player on a 144Hz monitor and a player on a 60Hz monitor experience the same game speed and score progression.

Pending Development Goals

    Leaderboard Integration: Developing the GET request architecture to pull the Top 5 scores from the scores table for real-time display.

    Score Validation: Implementing server-side checks to ensure submitted scores are within the realm of physical possibility to prevent API tampering.

    Global Leveling: Planning an XP system that aggregates performance across different game IDs into a single user "Level."
