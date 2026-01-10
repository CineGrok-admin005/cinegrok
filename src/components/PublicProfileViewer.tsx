'use client'

import React from 'react'
import ProfileView from '@/components/ProfileView'

export default function PublicProfileViewer({ data, isLoggedIn }: { data: any, isLoggedIn: boolean }) {
    return (
        <div className="public-profile-viewer">
            <ProfileView data={data} showToggle={true} initialViewMode="audience" isLoggedIn={isLoggedIn} />
        </div>
    )
}
