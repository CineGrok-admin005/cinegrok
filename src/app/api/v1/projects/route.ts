/**
 * Projects API Route
 * 
 * POST /api/v1/projects - Create new project
 * GET /api/v1/projects - List projects (public or user's own)
 * 
 * Security: Uses Supabase RLS and authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /api/v1/projects
 * List projects with optional filters
 * 
 * Query params:
 * - status: 'draft' | 'open' | 'in_production' | 'completed'
 * - creator_id: Filter by creator (only shows if user is owner or public)
 * - my_projects: true/false - show only user's projects
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const creatorId = searchParams.get('creator_id');
    const myProjects = searchParams.get('my_projects') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get auth context
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();

    let query = supabase.from('projects').select(
      `
        id,
        creator_id,
        title,
        project_code,
        description,
        shoot_location,
        shoot_start_date,
        shoot_end_date,
        budget_min,
        budget_max,
        is_paid,
        status,
        applications_open,
        created_at,
        updated_at,
        filmmakers:creator_id(id, name, profile_url)
      `,
      { count: 'exact' }
    );

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // If requesting "my projects", only show user's own projects
    if (myProjects && user) {
      query = query.eq('creator_id', user.id);
    } 
    // Otherwise, only show "open" projects to public
    else if (!user) {
      query = query.eq('status', 'open');
    }
    // If creator_id specified and different from user, only show if status is open
    else if (creatorId && (!user || user.id !== creatorId)) {
      query = query.eq('status', 'open');
    }

    // Filter by creator if specified
    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }

    // Pagination
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: data || [],
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: count ? offset + limit < count : false,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/projects
 * Create new project (authenticated users only)
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get filmmaker record to ensure user exists in filmmakers table
    const { data: filmmaker, error: filmmakerError } = await supabase
      .from('filmmakers')
      .select('id')
      .eq('id', user.id)
      .single();

    if (filmmakerError || !filmmaker) {
      return NextResponse.json(
        { error: 'User profile not found in filmmakers table' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      title,
      description,
      shoot_location,
      shoot_start_date,
      shoot_end_date,
      budget_min,
      budget_max,
      is_paid = true,
      status = 'draft',
      roles = [], // Array of roles to create with project
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate unique project code
    const { data: projectCode, error: codeError } = await supabase
      .rpc('generate_project_code');

    if (codeError || !projectCode) {
      console.error('Project code generation error:', codeError);
      return NextResponse.json(
        { error: 'Failed to generate project code' },
        { status: 500 }
      );
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        creator_id: user.id,
        title,
        project_code: projectCode,
        description,
        shoot_location,
        shoot_start_date,
        shoot_end_date,
        budget_min,
        budget_max,
        is_paid,
        status,
        applications_open: status === 'open',
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    // Create roles if provided
    let createdRoles = [];
    if (roles.length > 0) {
      const { data: rolesData, error: rolesError } = await supabase
        .from('project_roles')
        .insert(
          roles.map((role: any) => ({
            project_id: project.id,
            role_title: role.role_title,
            role_description: role.role_description,
            role_category: role.role_category || 'crew',
            experience_level: role.experience_level || 'intermediate',
            quantity_needed: role.quantity_needed || 1,
          }))
        )
        .select();

      if (rolesError) {
        console.error('Roles creation error:', rolesError);
        // Don't fail - project was created, just warn about roles
      } else {
        createdRoles = rolesData || [];
      }
    }

    return NextResponse.json(
      {
        project,
        roles: createdRoles,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Projects POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
