/**
 * Project Applications API Routes
 * 
 * POST /api/v1/projects/[id]/applications - Filmmaker applies to role
 * GET /api/v1/projects/[id]/applications - Producer views applications
 * PUT /api/v1/projects/[id]/applications/[appId] - Producer updates application status
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * POST /api/v1/projects/[id]/applications
 * Filmmaker applies to a role
 */
export async function POST(
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

    // Verify project exists and accepts applications
    const { data: project } = await supabase
      .from('projects')
      .select('id, applications_open')
      .eq('id', projectId)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (!project.applications_open) {
      return NextResponse.json(
        { error: 'Applications are closed for this project' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { role_id, portfolio_url, cover_letter } = body;

    if (!role_id) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Verify role exists in this project
    const { data: role } = await supabase
      .from('project_roles')
      .select('id')
      .eq('id', role_id)
      .eq('project_id', projectId)
      .single();

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found in this project' },
        { status: 404 }
      );
    }

    // Create application
    const { data: application, error: appError } = await supabase
      .from('project_applications')
      .insert({
        project_id: projectId,
        role_id,
        filmmaker_id: user.id,
        portfolio_url,
        cover_letter,
        status: 'submitted',
      })
      .select()
      .single();

    if (appError) {
      // Check if error is duplicate application
      if (appError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already applied to this role' },
          { status: 409 }
        );
      }
      console.error('Application creation error:', appError);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error('POST application error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/projects/[id]/applications
 * Producer views all applications for a project
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(req.url);
    const role_id = searchParams.get('role_id');
    const status = searchParams.get('status'); // submitted, under_review, accepted, rejected
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

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

    // Fetch applications
    let query = supabase
      .from('project_applications')
      .select(
        `
        id,
        project_id,
        role_id,
        filmmaker_id,
        portfolio_url,
        cover_letter,
        status,
        producer_notes,
        applied_at,
        reviewed_at,
        filmmakers:filmmaker_id(
          id,
          name,
          profile_url,
          raw_form_data
        ),
        project_roles:role_id(
          id,
          role_title,
          experience_level
        )
      `,
        { count: 'exact' }
      )
      .eq('project_id', projectId);

    if (role_id) {
      query = query.eq('role_id', role_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Applications fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET applications error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
