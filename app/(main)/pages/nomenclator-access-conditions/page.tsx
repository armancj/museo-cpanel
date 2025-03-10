'use client';
import React from 'react';
import NomenclatureAccessConditions from './NomenclatureAccessConditions';

const EmptyPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <NomenclatureAccessConditions />
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
