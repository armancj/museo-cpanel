'use client';
import { useEffect, useRef, useState } from 'react';
import { CulturalHeritagePropertyWizard } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyWizard';
import { CulturalHeritagePropertyList } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyList';
import { Button } from 'primereact/button';
import {
    useHookCulturalHeritageProperty
} from '@/app/(main)/pages/cultural-property-heritage/useHookCulturalHeritageProperty';
import { HeritageTypeResponse, HeritageTypeService } from '@/app/service/HeritageTypeService';

const CulturalHeritagePropertyPage = () => {
    const [showWizard, setShowWizard] = useState(false);
    const [heritageTypes, setHeritageTypes] = useState<HeritageTypeResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const isEditModeRef = useRef(false);


    const hookData = useHookCulturalHeritageProperty();

    useEffect(() => {
        const fetchHeritageTypes = async () => {
            try {
                setLoading(true);
                const response = await HeritageTypeService.getHeritageTypes();
                setHeritageTypes(response);
            } catch (error) {
                console.error('Error fetching heritage types:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeritageTypes();
    }, []);


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


    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                <span className="ml-2">Cargando...</span>
            </div>
        );
    }

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
                                              hookData={hookData}
                                              heritageTypes={heritageTypes}
                />

            )}
        </div>
    );
};

export default CulturalHeritagePropertyPage;
