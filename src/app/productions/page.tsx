/**
 * /productions
 * Browse all open productions (formerly called projects)
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard, { ProjectData } from '@/components/ProjectCard';

export default function ProductionsPage() {
  const [productions, setProductions] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/projects?status=open&limit=50');
      if (!response.ok) {
        throw new Error('Failed to load productions');
      }
      const { data } = await response.json();
      setProductions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productions-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Productions</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Browse productions looking for cast and crew</p>
        </div>
        <Link href="/productions/new" className="btn btn-primary">
          + New Production
        </Link>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading productions...</p>
      ) : productions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No productions available</p>
          <Link href="/productions/new" className="btn btn-primary">
            Create First Production
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {productions.map((production) => (
            <ProjectCard key={production.id} project={production} />
          ))}
        </div>
      )}
    </div>
  );
}
