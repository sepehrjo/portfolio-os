-- Migration: Update project screenshots
-- Created: 2026-06-23

-- Update Ariana Global Trade screenshots
UPDATE projects
SET screenshots = '[{"src":"/assets/languages-support.png","alt":"Multi-language support"},{"src":"/assets/quote-inquiry.png","alt":"Quote form"},{"src":"/assets/chatbot-sensitivity.png","alt":"AI chatbot"}]',
    updated_at = unixepoch()
WHERE url = 'arianasepehr.vercel.app';

-- Update FORMA Studio screenshots
UPDATE projects
SET screenshots = '[{"src":"/assets/hero_en.png","alt":"FORMA hero"},{"src":"/assets/assistant_active.png","alt":"FORMA assistant"},{"src":"/assets/journal.png","alt":"FORMA journal"},{"src":"/assets/portfolio.png","alt":"FORMA portfolio"}]',
    updated_at = unixepoch()
WHERE url = 'adart-alpha.vercel.app';
