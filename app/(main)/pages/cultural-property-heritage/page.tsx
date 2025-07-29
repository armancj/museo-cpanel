'use client';
import { useEffect, useRef, useState } from 'react';
import { CulturalHeritagePropertyWizard } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyWizard';
import { CulturalHeritagePropertyList } from '@/app/(main)/pages/cultural-property-heritage/CulturalHeritagePropertyList';
import { Button } from 'primereact/button';
import {
    useHookCulturalHeritageProperty
} from '@/app/(main)/pages/cultural-property-heritage/useHookCulturalHeritageProperty';
import { useAllDropdownData } from '@/app/common/hooks/useAllDropdownData';
import { UserRoles, Status } from '@/app/(main)/pages/cultural-property-heritage/types';

const CulturalHeritagePropertyPage = () => {
    const [showWizard, setShowWizard] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

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

    const processPreselectedHeritageType = (preSelectedHeritageType: string) => {
        const typeExists = heritageTypeOptions.some(option => option.value === preSelectedHeritageType);

        if (!typeExists) {
             localStorage.removeItem('preSelectedHeritageType');
            return;
        }

        const newData = {
            ...hookData.data,
            entryAndLocation: {
                auxiliaryInventory: { value: false, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                declarationType: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                entryDate: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                entryMethod: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                genericClassification: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                heritageType: { value: preSelectedHeritageType, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                initialDescription: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                institutionType: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                inventoryNumber: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                pieceInventory: { value: false, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                objectName: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                objectLocation: {
                    value: {
                        floor: '',
                        exhibitionRoom: '',
                        storage: '',
                        showcaseShelf: '',
                        shelfDrawer: '',
                        box: '',
                        fileFolder: '',
                        _id: ''
                    },
                    modifiedBy: '',
                    comment: '',
                    status: Status.Pending,
                    history: []
                }
            }
        };
        hookData.setData(newData);
        localStorage.removeItem('preSelectedHeritageType');
    };


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

        // Check if there's a preselected heritage type in localStorage
        // If so, automatically show the wizard for creating a new item
        const preSelectedHeritageType = localStorage.getItem('preSelectedHeritageType');
        if (preSelectedHeritageType) {
            // Call handleAddNew after the component has fully mounted
            setTimeout(() => {
                handleAddNew();
            }, 0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const preSelectedHeritageType = localStorage.getItem('preSelectedHeritageType');

        if (preSelectedHeritageType && heritageTypeOptions.length > 0 && showWizard) {
            processPreselectedHeritageType(preSelectedHeritageType);
        }
    }, [heritageTypeOptions, processPreselectedHeritageType, showWizard]);

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

        const preSelectedHeritageType = localStorage.getItem('preSelectedHeritageType');
        setShowWizard(true);

        if (preSelectedHeritageType) {
            if (heritageTypeOptions.length === 0) {
                console.log('⏳ Options not loaded yet, will process when available');
                return;
            }

            processPreselectedHeritageType(preSelectedHeritageType);
        }
    };

    const handleView = () => {
        setIsViewMode(true);
        setShowWizard(true);
    };

    const handleEdit = () => {
        setIsViewMode(false);
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
                        isViewMode={isViewMode}
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
                    onView={handleView}
                    onEdit={handleEdit}
                    hookData={hookData}
                    heritageTypeOptions={heritageTypeOptions}
                />
            )}
        </div>
    );
};

export default CulturalHeritagePropertyPage;
