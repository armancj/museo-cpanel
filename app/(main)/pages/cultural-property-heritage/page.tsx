'use client';
import { useRef, useState } from 'react';
import { CulturalHeritagePropertyWizard } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyWizard';
import { CulturalHeritagePropertyList } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyList';
import { Button } from 'primereact/button';
import {
    useHookCulturalHeritageProperty
} from '@/app/(main)/pages/cultural-property-heritage/useHookCulturalHeritageProperty';

const CulturalHeritagePropertyPage = () => {
    const [showWizard, setShowWizard] = useState(false);

    const isEditModeRef = useRef(false);


    const hookData = useHookCulturalHeritageProperty();


    const handleAddNew = () => {
        isEditModeRef.current = false;
        hookData.closeDialog();
        setShowWizard(true);
    };

    const handleEditOrView = () => {
        isEditModeRef.current = true;
        setShowWizard(true);
    };


    const handleBackToList = () => {
        isEditModeRef.current = false;
        hookData.closeDialog();
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
                    <CulturalHeritagePropertyWizard onBackToList={handleBackToList}
                                                    hookData={hookData}

                    />
                </div>
            ) : (
                <CulturalHeritagePropertyList onAddNew={handleAddNew}
                                              onEditOrView={handleEditOrView}
                                              hookData={hookData} />
            )}
        </div>
    );
};

export default CulturalHeritagePropertyPage;
