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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    tickets INTEGER DEFAULT 0
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

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prizes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    category TEXT,                              
    item_value TEXT NOT NULL                                   
);

CREATE TABLE user_prizes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prize_id INTEGER REFERENCES prizes(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, prize_id)
);

--INSERT INTO prizes (name, description, cost, category, item_value) VALUES 
--('Golden Pilot', 'An exclusive gold-tinted avatar.', 500, 'avatar', 'gold_bean.png'),
--('Neon Pulse', 'Your name will pulse with a purple glow.', 1500, 'theme', 'shadow-purple'),
--('Dreadnought Badge', 'A massive shield icon next to your name.', 1000, 'badge', 'badge_shield.png')
--ON CONFLICT DO NOTHING;