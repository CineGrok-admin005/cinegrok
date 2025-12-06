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
        setFeatured(shuffled.slice(0, 10)); // Take top 10 random
    }, [filmmakers]);

    if (featured.length === 0) return null;

    return (
        <div className="filmmaker-carousel-container">
            <div className="carousel-track">
                {/* Duplicate list for seamless infinite scroll */}
                {[...featured, ...featured].map((filmmaker, index) => (
                    <Link
                        href={`/filmmakers/${filmmaker.id}`}
                        key={`${filmmaker.id}-${index}`}
                        className="carousel-card"
                    >
                        <div className="carousel-image-wrapper">
                            <img
                                src={filmmaker.raw_form_data.profile_photo_url || '/placeholder-avatar.png'}
                                alt={filmmaker.name}
                                className="carousel-image"
                            />
                        </div>
                        <div className="carousel-info">
                            <span className="carousel-name">{filmmaker.name}</span>
                            <span className="carousel-role">
                                {filmmaker.raw_form_data.roles?.split(',')[0] || 'Filmmaker'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
