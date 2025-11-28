-- Quick SQL to add profile photos to existing test data
-- Run this after the main test_data.sql

-- Add profile photos using Unsplash (professional portraits)
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"') WHERE name = 'Christopher Nolan';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"') WHERE name = 'Greta Gerwig';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"') WHERE name = 'Roger Deakins';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"') WHERE name = 'Thelma Schoonmaker';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"') WHERE name = 'Ari Aster';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"') WHERE name = 'Chloe Zhao';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"') WHERE name = 'Priya Sharma';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400"') WHERE name = 'Marcus Chen';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400"') WHERE name = 'Sofia Rodriguez';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400"') WHERE name = 'Trent Reznor';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400"') WHERE name = 'Jamal Washington';
UPDATE filmmakers SET raw_form_data = jsonb_set(raw_form_data, '{profile_photo_url}', '"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400"') WHERE name LIKE 'Emma Thompson%';
