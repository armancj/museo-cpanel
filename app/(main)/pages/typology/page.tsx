'use client';
import React from 'react';
import Typology from './Typology';

const EmptyPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Typology />
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
