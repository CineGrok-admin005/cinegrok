/**
 * Single Project API Routes
 * 
 * GET /api/v1/projects/[id] - Get single project with roles
 * PUT /api/v1/projects/[id] - Update project (creator only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /api/v1/projects/[id]
 * Get single project with all roles
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Fetch project with creator info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(
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
        announcements,
        created_at,
        updated_at,
        filmmakers:creator_id(id, name, profile_url, raw_form_data)
      `
      )
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Fetch all roles for this project
    const { data: roles, error: rolesError } = await supabase
      .from('project_roles')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (rolesError) {
      console.error('Roles fetch error:', rolesError);
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: 500 }
      );
    }

    // Fetch application counts for each role
    const { data: applicationCounts } = await supabase
      .from('project_applications')
      .select('role_id', { count: 'exact', head: false })
      .eq('project_id', projectId)
      .eq('status', 'submitted');

    // Enrich roles with application counts
    const rolesWithCounts = (roles || []).map((role) => ({
      ...role,
      application_count: applicationCounts?.filter(app => app.role_id === role.id).length || 0,
    }));

    return NextResponse.json(
      {
        project,
        roles: rolesWithCounts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/projects/[id]
 * Update project (creator only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
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

    // Verify user is project creator
    const { data: project } = await supabase
      .from('projects')
      .select('creator_id')
      .eq('id', projectId)
      .single();

    if (!project || project.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      shoot_location,
      shoot_start_date,
      shoot_end_date,
      budget_min,
      budget_max,
      is_paid,
      status,
      applications_open,
      announcements,
    } = body;

    // Update project
    const { data: updated, error: updateError } = await supabase
      .from('projects')
      .update({
        title,
        description,
        shoot_location,
        shoot_start_date,
        shoot_end_date,
        budget_min,
        budget_max,
        is_paid,
        status,
        applications_open,
        announcements,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Project update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
