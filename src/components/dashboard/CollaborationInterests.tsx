'use client';

/**
 * Collaboration Interests Component
 * 
 * Dashboard tab showing saved filmmaker interests with:
 * - Server-side filtering by role, location, status
 * - Status management (Shortlist, Contacted, Archive)
 * - Private notes for each interest
 * - "Currently Unavailable" badge for unpublished profiles
 * 
 * @module components/dashboard/CollaborationInterests
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Star,
    MapPin,
    Filter,
    Trash2,
    MessageSquare,
    ChevronDown,
    AlertCircle,
    Search,
    UserX,
    Handshake,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface CollaborationInterest {
    id: string;
    filmmakerId: string;
    filmmaker: {
        id: string;
        name: string;
        status: string;
        generated_bio: string | null;
        raw_form_data: any;
        profile_url: string | null;
    } | null;
    status: 'interested' | 'shortlisted' | 'contacted' | 'archived';
    privateNotes: string | null;
    addedAt: string;
    updatedAt: string;
    isAvailable: boolean;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    interested: { label: 'Interested', color: 'bg-blue-100 text-blue-800' },
    shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800' },
    contacted: { label: 'Contacted', color: 'bg-green-100 text-green-800' },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-600' },
};

// Role options for filtering
const ROLES = [
    'Director', 'Actor', 'Cinematographer', 'Editor', 'Producer',
    'Writer', 'Composer', 'Sound Designer', 'Production Designer', 'VFX Artist'
];

export default function CollaborationInterests() {
    const [interests, setInterests] = useState<CollaborationInterest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [locationFilter, setLocationFilter] = useState<string>('');

    // Notes editing
    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesValue, setNotesValue] = useState('');

    // Fetch interests
    const fetchInterests = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (roleFilter !== 'all') params.append('role', roleFilter);
            if (locationFilter) params.append('location', locationFilter);

            const response = await fetch(`/api/v1/collaboration-interests?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch interests');
            }

            setInterests(data.interests || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load interests');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, roleFilter, locationFilter]);

    useEffect(() => {
        fetchInterests();
    }, [fetchInterests]);

    // Update status
    const updateStatus = async (filmmakerId: string, status: string) => {
        try {
            const response = await fetch('/api/v1/collaboration-interests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filmmakerId, status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setInterests(prev => prev.map(interest =>
                interest.filmmakerId === filmmakerId
                    ? { ...interest, status: status as any }
                    : interest
            ));
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    // Save notes
    const saveNotes = async (filmmakerId: string) => {
        try {
            const response = await fetch('/api/v1/collaboration-interests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filmmakerId, notes: notesValue }),
            });

            if (!response.ok) {
                throw new Error('Failed to save notes');
            }

            // Update local state
            setInterests(prev => prev.map(interest =>
                interest.filmmakerId === filmmakerId
                    ? { ...interest, privateNotes: notesValue }
                    : interest
            ));

            setEditingNotes(null);
            setNotesValue('');
        } catch (err) {
            console.error('Error saving notes:', err);
        }
    };

    // Remove interest
    const removeInterest = async (filmmakerId: string) => {
        try {
            const response = await fetch('/api/interested-profiles', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filmmakerId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove interest');
            }

            // Remove from local state
            setInterests(prev => prev.filter(i => i.filmmakerId !== filmmakerId));
        } catch (err) {
            console.error('Error removing interest:', err);
        }
    };

    // Get role from filmmaker data
    const getFilmmakerRole = (filmmaker: CollaborationInterest['filmmaker']) => {
        if (!filmmaker?.raw_form_data) return 'Filmmaker';
        const formData = filmmaker.raw_form_data;
        const roles = formData.roles || formData.primaryRole || [];
        if (Array.isArray(roles) && roles.length > 0) return roles[0];
        if (typeof roles === 'string') return roles;
        return 'Filmmaker';
    };

    // Get location from filmmaker data
    const getFilmmakerLocation = (filmmaker: CollaborationInterest['filmmaker']) => {
        if (!filmmaker?.raw_form_data) return null;
        const formData = filmmaker.raw_form_data;
        return formData.currentState || formData.current_state || formData.currentCity || null;
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-60" />
                </div>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Interests</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchInterests}>Try Again</Button>
            </div>
        );
    }

    // Empty state
    if (interests.length === 0 && statusFilter === 'all' && roleFilter === 'all' && !locationFilter) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collaboration Interests Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start discovering filmmakers and save the ones you'd like to collaborate with.
                    Your saved interests will appear here.
                </p>
                <Link href="/browse">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Filmmakers
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {ROLES.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />

                {(statusFilter !== 'all' || roleFilter !== 'all' || locationFilter) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setStatusFilter('all');
                            setRoleFilter('all');
                            setLocationFilter('');
                        }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
                Showing {interests.length} interest{interests.length !== 1 ? 's' : ''}
            </div>

            {/* Interest Cards */}
            <div className="space-y-4">
                {interests.map((interest) => (
                    <div
                        key={interest.id}
                        className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${!interest.isAvailable ? 'opacity-75 border-dashed' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Filmmaker Info */}
                            <div className="flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-gray-900">
                                                {interest.filmmaker?.name || 'Unknown Filmmaker'}
                                            </h4>
                                            <Badge className={STATUS_LABELS[interest.status].color}>
                                                {STATUS_LABELS[interest.status].label}
                                            </Badge>
                                            {!interest.isAvailable && (
                                                <Badge variant="outline" className="text-orange-600 border-orange-300">
                                                    <UserX className="w-3 h-3 mr-1" />
                                                    Currently Unavailable
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {getFilmmakerRole(interest.filmmaker)}
                                        </p>
                                        {getFilmmakerLocation(interest.filmmaker) && (
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3" />
                                                {getFilmmakerLocation(interest.filmmaker)}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                            Added {new Date(interest.addedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Private Notes */}
                                {editingNotes === interest.filmmakerId ? (
                                    <div className="mt-3 space-y-2">
                                        <Textarea
                                            value={notesValue}
                                            onChange={(e) => setNotesValue(e.target.value)}
                                            placeholder="Add private notes about this filmmaker..."
                                            className="text-sm"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => saveNotes(interest.filmmakerId)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setEditingNotes(null);
                                                    setNotesValue('');
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : interest.privateNotes ? (
                                    <div
                                        className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 cursor-pointer hover:bg-yellow-100"
                                        onClick={() => {
                                            setEditingNotes(interest.filmmakerId);
                                            setNotesValue(interest.privateNotes || '');
                                        }}
                                    >
                                        <MessageSquare className="w-3 h-3 inline mr-1" />
                                        {interest.privateNotes}
                                    </div>
                                ) : null}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-2 items-start">
                                {interest.isAvailable && (
                                    <Link href={`/filmmakers/${interest.filmmakerId}`}>
                                        <Button variant="outline" size="sm">
                                            View Profile
                                        </Button>
                                    </Link>
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Star className="w-4 h-4 mr-1" />
                                            Status
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => updateStatus(interest.filmmakerId, 'interested')}>
                                            Interested
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateStatus(interest.filmmakerId, 'shortlisted')}>
                                            Shortlisted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateStatus(interest.filmmakerId, 'contacted')}>
                                            Contacted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateStatus(interest.filmmakerId, 'archived')}>
                                            Archived
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setEditingNotes(interest.filmmakerId);
                                        setNotesValue(interest.privateNotes || '');
                                    }}
                                >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Notes
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeInterest(interest.filmmakerId)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state when filters return no results */}
            {interests.length === 0 && (statusFilter !== 'all' || roleFilter !== 'all' || locationFilter) && (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Found</h3>
                    <p className="text-gray-600 mb-4">
                        No interests match your current filters.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setStatusFilter('all');
                            setRoleFilter('all');
                            setLocationFilter('');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
