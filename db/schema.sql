-- 1. Users Table (The Pilots)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    rank_title VARCHAR(50) DEFAULT 'LS_SPAMMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Games Table (The Modules)
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'dodge-win'
    description TEXT,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5)
);

-- 3. Leaderboards Table (The Registry/Glue)
CREATE TABLE IF NOT EXISTS leaderboards (
    player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id VARCHAR(50),
    all_time_best INTEGER DEFAULT 0,
    total_cumulative_score BIGINT DEFAULT 0,
    times_played INTEGER DEFAULT 0,
    PRIMARY KEY (player_id, game_id)
);

CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    player_id INTEGER REFERENCES users(id),
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);