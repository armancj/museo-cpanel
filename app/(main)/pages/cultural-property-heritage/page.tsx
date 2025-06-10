'use client';
import { useState } from 'react';
import { CulturalHeritagePropertyWizard } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyWizard';
import { CulturalHeritagePropertyList } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyList';
import { Button } from 'primereact/button';

const CulturalHeritagePropertyPage = () => {
    const [showWizard, setShowWizard] = useState(false);

    const handleAddNew = () => {
        setShowWizard(true);
    };

    const handleBackToList = () => {
        setShowWizard(false);
    };

    return (
        <div>
            {showWizard ? (
                <div>
                    <div className="flex justify-content-between align-items-center mb-3">
                        <Button
                            label="Volver al Listado"
                            icon="pi pi-arrow-left"
                            className="p-button-secondary"
                            onClick={handleBackToList}
                        />
                    </div>
                    <CulturalHeritagePropertyWizard onBackToList={handleBackToList} />
                </div>
            ) : (
                <CulturalHeritagePropertyList onAddNew={handleAddNew} />
            )}
        </div>
    );
};

export default CulturalHeritagePropertyPage;
