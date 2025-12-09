/**
 * Update Application Status API Route
 * 
 * PUT /api/v1/projects/[id]/applications/[appId] - Producer accepts/rejects application
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * PUT /api/v1/projects/[id]/applications/[appId]
 * Update application status (accept/reject/review)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  try {
    const projectId = params.id;
    const appId = params.appId;

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
    const { status, producer_notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['submitted', 'under_review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update application
    const { data: application, error: updateError } = await supabase
      .from('project_applications')
      .update({
        status,
        producer_notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Application update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // If accepted, update role's filled_count
    if (status === 'accepted') {
      const { data: currentRole } = await supabase
        .from('project_roles')
        .select('filled_count, quantity_needed')
        .eq('id', application.role_id)
        .single();

      if (currentRole && currentRole.filled_count < currentRole.quantity_needed) {
        await supabase
          .from('project_roles')
          .update({
            filled_count: currentRole.filled_count + 1,
          })
          .eq('id', application.role_id);
      }
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error: any) {
    console.error('PUT application error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
