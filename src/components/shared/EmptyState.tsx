/**
 * Empty State Component
 * 
 * Consistent "no data" display used across the application.
 * DRY principle: Replaces duplicated empty state divs throughout pages.
 * 
 * @module components/shared/EmptyState
 */

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
    /** Icon or emoji to display */
    icon?: string;
    /** Title text */
    title: string;
    /** Description/subtitle text */
    description?: string;
    /** Optional action button */
    action?: {
        label: string;
        href: string;
    };
}

/**
 * Displays a centered empty state with optional action.
 * 
 * @param props - Component props
 * @returns Empty state UI
 * 
 * @example
 * <EmptyState 
 *   icon="🔍" 
 *   title="No results found" 
 *   description="Try adjusting your filters"
 *   action={{ label: "Clear Filters", href: "/browse" }}
 * />
 */
export function EmptyState({
    icon = '📭',
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <div
            className="empty-state"
            style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius)',
                margin: '2rem 0',
                border: '1px solid var(--border)'
            }}
        >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
                {icon}
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                {title}
            </h3>
            {description && (
                <p style={{
                    color: 'var(--muted-foreground)',
                    marginBottom: '1.5rem',
                    maxWidth: '400px',
                    margin: '0 auto 1.5rem'
                }}>
                    {description}
                </p>
            )}
            {action && (
                <Link href={action.href} className="btn btn-secondary">
                    {action.label}
                </Link>
            )}
        </div>
    );
}
