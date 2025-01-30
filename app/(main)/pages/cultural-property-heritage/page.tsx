"use client";
import React from 'react';
import CulturalPropertyTable from '@/app/(main)/pages/cultural-property-heritage/CulturalPropertyTable';
import { Button } from 'primereact/button';

const culturalPropertyHeritage = () => {

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Patrimonio de Bienes Culturales</h5>
                    <p>El patrimonio de bienes culturales abarca todos aquellos elementos que, por su valor histórico, artístico, arqueológico o etnográfico, representan la identidad y la memoria cultural de una comunidad o nación. Estos bienes incluyen monumentos, edificios históricos, obras de arte, manuscritos, objetos arqueológicos y otros elementos que son considerados de importancia cultural y deben ser preservados para las generaciones futuras.</p>
                </div>
                <CulturalPropertyTable />
            </div>
        </div>
    );
};

export default culturalPropertyHeritage;
