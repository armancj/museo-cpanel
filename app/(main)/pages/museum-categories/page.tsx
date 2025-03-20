'use client';
import React from 'react';
import MuseumCategories from './MuseumCategories';

const EmptyPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <MuseumCategories />
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
