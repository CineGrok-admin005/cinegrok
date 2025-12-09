/**
 * /projects
 * Browse all open projects
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard, { ProjectData } from '@/components/ProjectCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/projects?status=open&limit=50');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      const { data } = await response.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        <Link href="/projects/new" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No projects found</p>
          <Link href="/projects/new" className="btn btn-primary">
            Create First Project
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
