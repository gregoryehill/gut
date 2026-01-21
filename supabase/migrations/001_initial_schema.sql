-- GUT (Grand Unified Theory of Cooking) - Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cuisines table
CREATE TABLE cuisines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category enum for the 5 F's
CREATE TYPE ingredient_category AS ENUM ('fat', 'foundation', 'feature', 'flavor', 'finish');

-- Ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category ingredient_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cuisine-Ingredient join table (many-to-many)
-- Allows ingredients to belong to multiple cuisines
CREATE TABLE cuisine_ingredients (
  cuisine_id UUID REFERENCES cuisines(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (cuisine_id, ingredient_id)
);

-- Feedback table for thumbs down logging
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_inputs JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_cuisine_ingredients_cuisine ON cuisine_ingredients(cuisine_id);
CREATE INDEX idx_cuisine_ingredients_ingredient ON cuisine_ingredients(ingredient_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- Enable Row Level Security (optional, but recommended for Supabase)
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisine_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust based on your needs)
CREATE POLICY "Allow public read access to cuisines" ON cuisines
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to ingredients" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to cuisine_ingredients" ON cuisine_ingredients
  FOR SELECT USING (true);

-- Feedback can be inserted by anyone, but not read (for analytics only)
CREATE POLICY "Allow public insert to feedback" ON feedback
  FOR INSERT WITH CHECK (true);
