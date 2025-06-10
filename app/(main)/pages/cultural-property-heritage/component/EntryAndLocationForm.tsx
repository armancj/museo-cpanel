'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';

interface EntryAndLocationFormProps {
    data: CulturalHeritageProperty;
    setData: (data: CulturalHeritageProperty) => void;
    canEditField: (status: Status) => boolean;
    canViewHistory: () => boolean;
    canChangeStatus: () => boolean;
    openHistoryDialog: (field: any, title: string) => void;
    isEditMode: boolean;
    markStepCompleted: (index: number, completed: boolean) => void;
    currentStep: number;
    submitted: boolean;
}

export const EntryAndLocationForm = ({
    data,
    setData,
    canEditField,
    canViewHistory,
    canChangeStatus,
    openHistoryDialog,
    isEditMode,
    markStepCompleted,
    currentStep,
    submitted
}: EntryAndLocationFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // Initialize entryAndLocation if it doesn't exist
    useEffect(() => {
        // Only initialize if data exists but entryAndLocation doesn't
        if (data && !data.entryAndLocation) {
            setData({
                ...data,
                entryAndLocation: {
                    auxiliaryInventory: { value: false, modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    declarationType: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    entryDate: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    entryMethod: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    genericClassification: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    heritageType: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
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
            });
        }
    // Only run this effect when the component mounts or when data.uuid changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.uuid]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.entryAndLocation) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        const { entryAndLocation } = data;
        const requiredFields = [
            entryAndLocation.inventoryNumber.value,
            entryAndLocation.objectName.value
        ];

        const isValid = requiredFields.every(field => field !== null && field !== undefined && field !== '');

        // Only update state and call markStepCompleted if the validity has changed
        // and we haven't already updated it for this set of values
        if (isValid !== isFormValid && !formValidityUpdatedRef.current) {
            formValidityUpdatedRef.current = true;
            setIsFormValid(isValid);
            markStepCompleted(currentStep, isValid);
        } else {
            // Reset the ref if the validity hasn't changed
            formValidityUpdatedRef.current = false;
        }
    }, [
        data.entryAndLocation?.inventoryNumber?.value,
        data.entryAndLocation?.objectName?.value,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update a field in the entry and location
    const updateField = (field: string, value: any) => {
        if (!data.entryAndLocation) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                [field]: {
                    ...data.entryAndLocation[field as keyof typeof data.entryAndLocation],
                    value
                }
            }
        });
    };

    // Update a field's status in the entry and location
    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.entryAndLocation) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                [field]: {
                    ...data.entryAndLocation[field as keyof typeof data.entryAndLocation],
                    status
                }
            }
        });
    };

    // Update a field's comment in the entry and location
    const updateFieldComment = (field: string, comment: string) => {
        if (!data.entryAndLocation) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                [field]: {
                    ...data.entryAndLocation[field as keyof typeof data.entryAndLocation],
                    comment
                }
            }
        });
    };

    // Update a field in the object location
    const updateObjectLocationField = (subfield: string, value: any) => {
        if (!data.entryAndLocation || !data.entryAndLocation.objectLocation.value) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                objectLocation: {
                    ...data.entryAndLocation.objectLocation,
                    value: {
                        ...data.entryAndLocation.objectLocation.value,
                        [subfield]: value
                    }
                }
            }
        });
    };

    // Sample options for dropdowns
    const heritageTypeOptions = [
        { label: 'Mueble', value: 'movable' },
        { label: 'Inmueble', value: 'immovable' },
        { label: 'Inmaterial', value: 'intangible' }
    ];

    const entryMethodOptions = [
        { label: 'Donación', value: 'donation' },
        { label: 'Compra', value: 'purchase' },
        { label: 'Préstamo', value: 'loan' },
        { label: 'Transferencia', value: 'transfer' },
        { label: 'Hallazgo', value: 'finding' }
    ];

    const declarationTypeOptions = [
        { label: 'Monumento Nacional', value: 'national_monument' },
        { label: 'Patrimonio Local', value: 'local_heritage' },
        { label: 'Patrimonio de la Humanidad', value: 'world_heritage' }
    ];

    const institutionTypeOptions = [
        { label: 'Museo', value: 'museum' },
        { label: 'Archivo', value: 'archive' },
        { label: 'Biblioteca', value: 'library' },
        { label: 'Centro Cultural', value: 'cultural_center' }
    ];

    const genericClassificationOptions = [
        { label: 'Arte', value: 'art' },
        { label: 'Historia', value: 'history' },
        { label: 'Arqueología', value: 'archaeology' },
        { label: 'Etnografía', value: 'ethnography' },
        { label: 'Ciencia y Tecnología', value: 'science_technology' }
    ];

    // If entryAndLocation is not initialized yet, show loading or return null
    if (!data.entryAndLocation) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel header="Información de Entrada" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Número de Inventario"
                                field={data.entryAndLocation.inventoryNumber}
                                type="text"
                                onChange={(value) => updateField('inventoryNumber', value)}
                                onStatusChange={(status) => updateFieldStatus('inventoryNumber', status)}
                                onCommentChange={(comment) => updateFieldComment('inventoryNumber', comment)}
                                canEdit={canEditField(data.entryAndLocation.inventoryNumber.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese el número de inventario"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Nombre del Objeto"
                                field={data.entryAndLocation.objectName}
                                type="text"
                                onChange={(value) => updateField('objectName', value)}
                                onStatusChange={(status) => updateFieldStatus('objectName', status)}
                                onCommentChange={(comment) => updateFieldComment('objectName', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectName.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese el nombre del objeto"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Fecha de Entrada"
                                field={data.entryAndLocation.entryDate}
                                type="date"
                                onChange={(value) => updateField('entryDate', value)}
                                onStatusChange={(status) => updateFieldStatus('entryDate', status)}
                                onCommentChange={(comment) => updateFieldComment('entryDate', comment)}
                                canEdit={canEditField(data.entryAndLocation.entryDate.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione la fecha de entrada"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Método de Entrada"
                                field={data.entryAndLocation.entryMethod}
                                type="dropdown"
                                options={entryMethodOptions}
                                onChange={(value) => updateField('entryMethod', value)}
                                onStatusChange={(status) => updateFieldStatus('entryMethod', status)}
                                onCommentChange={(comment) => updateFieldComment('entryMethod', comment)}
                                canEdit={canEditField(data.entryAndLocation.entryMethod.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione el método de entrada"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Tipo de Patrimonio"
                                field={data.entryAndLocation.heritageType}
                                type="dropdown"
                                options={heritageTypeOptions}
                                onChange={(value) => updateField('heritageType', value)}
                                onStatusChange={(status) => updateFieldStatus('heritageType', status)}
                                onCommentChange={(comment) => updateFieldComment('heritageType', comment)}
                                canEdit={canEditField(data.entryAndLocation.heritageType.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione el tipo de patrimonio"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Tipo de Declaración"
                                field={data.entryAndLocation.declarationType}
                                type="dropdown"
                                options={declarationTypeOptions}
                                onChange={(value) => updateField('declarationType', value)}
                                onStatusChange={(status) => updateFieldStatus('declarationType', status)}
                                onCommentChange={(comment) => updateFieldComment('declarationType', comment)}
                                canEdit={canEditField(data.entryAndLocation.declarationType.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione el tipo de declaración"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Tipo de Institución"
                                field={data.entryAndLocation.institutionType}
                                type="dropdown"
                                options={institutionTypeOptions}
                                onChange={(value) => updateField('institutionType', value)}
                                onStatusChange={(status) => updateFieldStatus('institutionType', status)}
                                onCommentChange={(comment) => updateFieldComment('institutionType', comment)}
                                canEdit={canEditField(data.entryAndLocation.institutionType.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione el tipo de institución"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Clasificación Genérica"
                                field={data.entryAndLocation.genericClassification}
                                type="dropdown"
                                options={genericClassificationOptions}
                                onChange={(value) => updateField('genericClassification', value)}
                                onStatusChange={(status) => updateFieldStatus('genericClassification', status)}
                                onCommentChange={(comment) => updateFieldComment('genericClassification', comment)}
                                canEdit={canEditField(data.entryAndLocation.genericClassification.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione la clasificación genérica"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Inventario Auxiliar"
                                field={data.entryAndLocation.auxiliaryInventory}
                                type="checkbox"
                                onChange={(value) => updateField('auxiliaryInventory', value)}
                                onStatusChange={(status) => updateFieldStatus('auxiliaryInventory', status)}
                                onCommentChange={(comment) => updateFieldComment('auxiliaryInventory', comment)}
                                canEdit={canEditField(data.entryAndLocation.auxiliaryInventory.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="¿Tiene inventario auxiliar?"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Inventario de Pieza"
                                field={data.entryAndLocation.pieceInventory}
                                type="checkbox"
                                onChange={(value) => updateField('pieceInventory', value)}
                                onStatusChange={(status) => updateFieldStatus('pieceInventory', status)}
                                onCommentChange={(comment) => updateFieldComment('pieceInventory', comment)}
                                canEdit={canEditField(data.entryAndLocation.pieceInventory.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="¿Tiene inventario de pieza?"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Descripción Inicial"
                                field={data.entryAndLocation.initialDescription}
                                type="textarea"
                                onChange={(value) => updateField('initialDescription', value)}
                                onStatusChange={(status) => updateFieldStatus('initialDescription', status)}
                                onCommentChange={(comment) => updateFieldComment('initialDescription', comment)}
                                canEdit={canEditField(data.entryAndLocation.initialDescription.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la descripción inicial"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Ubicación del Objeto" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Piso"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.floor || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('floor', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el piso"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Sala de Exposición"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.exhibitionRoom || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('exhibitionRoom', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la sala de exposición"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Almacén"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.storage || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('storage', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el almacén"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Vitrina/Estante"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.showcaseShelf || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('showcaseShelf', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la vitrina o estante"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Estante/Cajón"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.shelfDrawer || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('shelfDrawer', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el estante o cajón"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Caja"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.box || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('box', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la caja"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Carpeta/Archivo"
                                field={{
                                    ...data.entryAndLocation.objectLocation,
                                    value: data.entryAndLocation.objectLocation.value?.fileFolder || ''
                                }}
                                type="text"
                                onChange={(value) => updateObjectLocationField('fileFolder', value)}
                                onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                                canEdit={canEditField(data.entryAndLocation.objectLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la carpeta o archivo"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
