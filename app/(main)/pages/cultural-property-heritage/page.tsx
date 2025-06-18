'use client';
import { useEffect, useRef, useState } from 'react';
import { CulturalHeritagePropertyWizard } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyWizard';
import { CulturalHeritagePropertyList } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyList';
import { Button } from 'primereact/button';
import {
    useHookCulturalHeritageProperty
} from '@/app/(main)/pages/cultural-property-heritage/useHookCulturalHeritageProperty';
import { useAllDropdownData } from '@/app/common/hooks/useAllDropdownData';
import { UserRoles } from '@/app/(main)/pages/cultural-property-heritage/types';

const CulturalHeritagePropertyPage = () => {
    const [showWizard, setShowWizard] = useState(false);
    const isEditModeRef = useRef(false);

    const [currentUserRole, setCurrentUserRole] = useState<UserRoles>(UserRoles.employee);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Use the custom hook to fetch all dropdown data
    const {
        valueGradeOptions,
        descriptionInstrumentOptions,
        conservationStateOptions,
        heritageTypeOptions,
        provinceOptions,
        municipalityOptions,
        accessConditionsOptions,
        reproductionConditionsOptions,
        genericClassificationOptions,
        fetchMunicipalitiesForProvince,
        isLoading,
        error
    } = useAllDropdownData();

    const hookData = useHookCulturalHeritageProperty();


    useEffect(() => {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
            try {
                const user = JSON.parse(authUser);
                const userRole = mapBackendRoleToUserRole(user.roles);
                setCurrentUserRole(userRole);
                setIsSuperAdmin(user.roles === 'super Administrador');
            } catch (error) {
                console.error('Error parsing auth user:', error);
            }
        }
    }, []);

    const mapBackendRoleToUserRole = (backendRole: string): UserRoles => {
        switch (backendRole) {
            case 'super Administrador':
                return UserRoles.superAdmin;
            case 'Administrador':
                return UserRoles.administrator;
            case 'Especialista':
                return UserRoles.manager;
            case 'Técnico':
                return UserRoles.employee;
            default:
                return UserRoles.employee;
        }
    };



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


    if (isLoading) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                <span className="ml-2">Cargando...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'red' }}></i>
                <span className="ml-2">Error al cargar los datos: {error.message}</span>
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
                    <CulturalHeritagePropertyWizard
                        onBackToList={handleBackToList}
                        hookData={hookData}
                        currentUserRole={currentUserRole}
                        setCurrentUserRole={setCurrentUserRole}
                        isSuperAdmin={isSuperAdmin}
                        dropdownData={{
                            valueGradeOptions,
                            descriptionInstrumentOptions,
                            conservationStateOptions,
                            heritageTypeOptions,
                            provinceOptions,
                            municipalityOptions,
                            accessConditionsOptions,
                            reproductionConditionsOptions,
                            genericClassificationOptions,
                            fetchMunicipalitiesForProvince
                        }}
                    />
                </div>
            ) : (
                <CulturalHeritagePropertyList
                    onAddNew={handleAddNew}
                    onEditOrView={handleEditOrView}
                    hookData={hookData}
                    heritageTypeOptions={heritageTypeOptions}
                />
            )}
        </div>
    );
};

export default CulturalHeritagePropertyPage;
