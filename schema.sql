-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the table
create table filmmakers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  profile_url text unique,
  raw_form_data jsonb,
  ai_generated_bio text,
  style_vector vector(1536)
);

-- Create a function to search for filmmakers
create or replace function search_filmmakers (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  profile_url text,
  ai_generated_bio text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    filmmakers.id,
    filmmakers.name,
    filmmakers.profile_url,
    filmmakers.ai_generated_bio,
    1 - (filmmakers.style_vector <=> query_embedding) as similarity
  from filmmakers
  where 1 - (filmmakers.style_vector <=> query_embedding) > match_threshold
  order by filmmakers.style_vector <=> query_embedding
  limit match_count;
end;
$$;
