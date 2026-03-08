-- Required Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------
-- USERS
--------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  green_preference_score INTEGER DEFAULT 50 
    CHECK (green_preference_score >= 0 AND green_preference_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

--------------------------------------------------
-- SAVED ROUTES
--------------------------------------------------

CREATE TABLE IF NOT EXISTS saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,

  label VARCHAR(100) NOT NULL,

  start_point GEOMETRY(POINT, 4326) NOT NULL,
  start_name VARCHAR(120),

  end_point GEOMETRY(POINT, 4326) NOT NULL,
  end_name VARCHAR(120),

  last_co2_score DECIMAL CHECK (last_co2_score >= 0),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial indexes
CREATE INDEX IF NOT EXISTS idx_saved_routes_start_geom 
ON saved_routes USING GIST(start_point);

CREATE INDEX IF NOT EXISTS idx_saved_routes_end_geom 
ON saved_routes USING GIST(end_point);

CREATE INDEX IF NOT EXISTS idx_saved_routes_user 
ON saved_routes(user_id);

--------------------------------------------------
-- TRIP HISTORY
--------------------------------------------------

CREATE TABLE IF NOT EXISTS trip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,

  -- user defined name
  trip_name VARCHAR(120),

  -- start/end names
  start_name VARCHAR(120),
  end_name VARCHAR(120),

  -- start/end coordinates
  start_point GEOMETRY(POINT,4326) NOT NULL,
  end_point GEOMETRY(POINT,4326) NOT NULL,

  mode VARCHAR(20) NOT NULL
    CHECK (mode IN ('car','bike','walk')),

  distance_km DECIMAL NOT NULL
    CHECK (distance_km > 0),

  duration_minutes INTEGER
    CHECK (duration_minutes >= 0),

  route_co2_kg DECIMAL(8,4) NOT NULL
    CHECK (route_co2_kg >= 0),

  -- route line for drawing map
  route_geometry GEOMETRY(LINESTRING,4326),

  -- turn-by-turn directions
  segments JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- INDEXES
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_trip_history_user
ON trip_history(user_id);

CREATE INDEX IF NOT EXISTS idx_trip_history_start_geom
ON trip_history USING GIST(start_point);

CREATE INDEX IF NOT EXISTS idx_trip_history_end_geom
ON trip_history USING GIST(end_point);

CREATE INDEX IF NOT EXISTS idx_trip_history_route_geom
ON trip_history USING GIST(route_geometry);