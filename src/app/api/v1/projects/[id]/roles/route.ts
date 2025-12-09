/**
 * Project Roles API Routes
 * 
 * POST /api/v1/projects/[id]/roles - Add role to project
 * PUT /api/v1/projects/[id]/roles/[roleId] - Update role
 * DELETE /api/v1/projects/[id]/roles/[roleId] - Delete role
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper to verify user is project creator
async function verifyProjectCreator(projectId: string, userId: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('creator_id')
    .eq('id', projectId)
    .single();

  return project?.creator_id === userId;
}

/**
 * POST /api/v1/projects/[id]/roles
 * Add new role to project
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

    // Verify creator
    const isCreator = await verifyProjectCreator(projectId, user.id);
    if (!isCreator) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      role_title,
      role_description,
      role_category = 'crew',
      experience_level = 'intermediate',
      quantity_needed = 1,
    } = body;

    if (!role_title) {
      return NextResponse.json(
        { error: 'Role title is required' },
        { status: 400 }
      );
    }

    const { data: role, error: roleError } = await supabase
      .from('project_roles')
      .insert({
        project_id: projectId,
        role_title,
        role_description,
        role_category,
        experience_level,
        quantity_needed,
      })
      .select()
      .single();

    if (roleError) {
      console.error('Role creation error:', roleError);
      return NextResponse.json(
        { error: 'Failed to create role' },
        { status: 500 }
      );
    }

    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    console.error('POST role error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
