'use client';
import React from 'react';
import DescriptionInstruments from '@/app/(main)/pages/description-instruments/DescriptionInstruments';


const EmptyPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <DescriptionInstruments />
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
