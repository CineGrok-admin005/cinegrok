'use client';

import { Filmmaker } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import './FilmmakerCarousel.css';

interface FilmmakerCarouselProps {
    filmmakers: Filmmaker[];
}

export default function FilmmakerCarousel({ filmmakers }: FilmmakerCarouselProps) {
    // Use a subset of filmmakers for the carousel (max 10, random order)
    const [featured, setFeatured] = useState<Filmmaker[]>([]);

    useEffect(() => {
        const shuffled = [...filmmakers].sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 21)); // Take top 21 random
    }, [filmmakers]);

    if (featured.length === 0) return null;

    return (
        <div className="filmmaker-carousel-container">
            <div className="carousel-track">
                {/* Duplicate list for seamless infinite scroll */}
                {[...featured, ...featured].map((filmmaker, index) => {
                    const profilePhoto = filmmaker.raw_form_data?.profile_photo_url || '/placeholder-avatar.png';
                    let role = 'Filmmaker';
                    const roles = filmmaker.raw_form_data?.roles;
                    if (Array.isArray(roles)) {
                        role = roles[0] || 'Filmmaker';
                    } else if (typeof roles === 'string') {
                        role = roles.split(',')[0] || 'Filmmaker';
                    }

                    return (
                        <Link
                            href={`/filmmakers/${filmmaker.id}`}
                            key={`${filmmaker.id}-${index}`}
                            className="carousel-card"
                        >
                            <div className="carousel-image-wrapper">
                                <img
                                    src={profilePhoto}
                                    alt={filmmaker.name}
                                    className="carousel-image"
                                />
                            </div>
                            <div className="carousel-info">
                                <span className="carousel-name">{filmmaker.name}</span>
                                <span className="carousel-role">{role}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
