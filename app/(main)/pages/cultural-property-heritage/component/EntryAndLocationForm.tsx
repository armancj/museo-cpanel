'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getUpdatedStatus } from '../utils/statusUtils';

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
    heritageTypeOptions: { label: string; value: string }[];
    genericClassificationOptions: { label: string; value: string }[];
}

export const EntryAndLocationForm = ({
    data,
    setData,
    canEditField,
    canViewHistory,
    canChangeStatus,
    openHistoryDialog,
    markStepCompleted,
    currentStep,
    heritageTypeOptions,
    genericClassificationOptions
}: EntryAndLocationFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // State for the selected status for each panel
    const [entryInfoStatus, setEntryInfoStatus] = useState<Status | null>(null);
    const [objectLocationStatus, setObjectLocationStatus] = useState<Status | null>(null);


    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

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
            entryAndLocation.auxiliaryInventory.value,
            entryAndLocation.declarationType.value,
            entryAndLocation.entryDate.value,
            entryAndLocation.entryMethod.value,
            entryAndLocation.genericClassification.value,
            entryAndLocation.heritageType.value,
            entryAndLocation.initialDescription.value,
            entryAndLocation.institutionType.value,
            entryAndLocation.inventoryNumber.value,
            entryAndLocation.pieceInventory.value,
            entryAndLocation.objectName.value,
            entryAndLocation.objectLocation.value
        ];

        const isValid = requiredFields.every(field => field !== null && field !== undefined && field !== '');

        if (isValid !== isFormValid && !formValidityUpdatedRef.current) {
            formValidityUpdatedRef.current = true;
            setIsFormValid(isValid);
            markStepCompleted(currentStep, isValid);
        } else {
            // Reset the ref if the validity hasn't changed
            formValidityUpdatedRef.current = false;
        }
    }, [currentStep, isFormValid, markStepCompleted, data]);

    // Update a field in the entry and location
    const updateField = (field: string, value: any) => {
        if (!data.entryAndLocation) return;

        // Get the current field data
        const currentField = data.entryAndLocation[field as keyof typeof data.entryAndLocation];

        // Automatically update status based on whether the field is filled
        const newStatus = getUpdatedStatus(value, currentField.status as Status);

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                [field]: {
                    ...currentField,
                    value,
                    status: newStatus
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

        // Create a new object location value with the updated field
        const newObjectLocationValue = {
            ...data.entryAndLocation.objectLocation.value,
            [subfield]: value
        };

        // Automatically update status based on whether any field in the object location is filled
        const newStatus = getUpdatedStatus(newObjectLocationValue, data.entryAndLocation.objectLocation.status as Status);

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                objectLocation: {
                    ...data.entryAndLocation.objectLocation,
                    value: newObjectLocationValue,
                    status: newStatus
                }
            }
        });
    };

    // Update all fields in the entry info panel
    const updateAllEntryInfoFields = (status: Status) => {
        if (!status || !data.entryAndLocation) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                inventoryNumber: {
                    ...data.entryAndLocation.inventoryNumber,
                    status
                },
                objectName: {
                    ...data.entryAndLocation.objectName,
                    status
                },
                entryDate: {
                    ...data.entryAndLocation.entryDate,
                    status
                },
                entryMethod: {
                    ...data.entryAndLocation.entryMethod,
                    status
                },
                heritageType: {
                    ...data.entryAndLocation.heritageType,
                    status
                },
                declarationType: {
                    ...data.entryAndLocation.declarationType,
                    status
                },
                institutionType: {
                    ...data.entryAndLocation.institutionType,
                    status
                },
                genericClassification: {
                    ...data.entryAndLocation.genericClassification,
                    status
                },
                auxiliaryInventory: {
                    ...data.entryAndLocation.auxiliaryInventory,
                    status
                },
                pieceInventory: {
                    ...data.entryAndLocation.pieceInventory,
                    status
                },
                initialDescription: {
                    ...data.entryAndLocation.initialDescription,
                    status
                }
            }
        });
    };

    // Update all fields in the object location panel
    const updateAllObjectLocationFields = (status: Status) => {
        if (!status || !data.entryAndLocation) return;

        setData({
            ...data,
            entryAndLocation: {
                ...data.entryAndLocation,
                objectLocation: {
                    ...data.entryAndLocation.objectLocation,
                    status
                }
            }
        });
    };

    // Sample options for dropdowns

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
        { label: 'Museo', value: 'Museo' },
        { label: 'Complejo Museológico', value: 'Complejo Mus' },
        { label: 'Extensión Museística', value: 'Ext. Mus' },
        { label: 'Salas Museísticas', value: 'Salas Mus' },
        { label: 'Oficina del Museólogo e Historiador', value: 'OMSH' },
        { label: 'Red de Bibliotecas Comunitarias', value: 'RBC' },
        { label: 'Centro Cultural', value: 'CCULT' },
        { label: 'Biblioteca', value: 'Bibliot' },
        { label: 'Archivo', value: 'Archivo' }
    ];


    // If entryAndLocation is not initialized yet, show loading or return null
    if (!data.entryAndLocation) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel
                    header="Información de Entrada"
                    toggleable
                    headerTemplate={(options) => {
                        return (
                            <div className="flex align-items-center justify-content-between w-full">
                                <div className="flex align-items-center">
                                    <button
                                        className={options.togglerClassName}
                                        onClick={options.onTogglerClick}
                                    >
                                        <span className={options.togglerIconClassName}></span>
                                    </button>
                                    <span className="font-bold">Información de Entrada</span>
                                </div>
                                {canChangeStatus() && (
                                    <div className="flex align-items-center gap-2">
                                        <Dropdown
                                            value={entryInfoStatus}
                                            options={statusOptions}
                                            onChange={(e) => setEntryInfoStatus(e.value)}
                                            placeholder="Seleccionar estado"
                                            className="p-inputtext-sm"
                                        />
                                        <Button
                                            label="Aplicar a todos"
                                            icon="pi pi-check"
                                            className="p-button-sm"
                                            onClick={() => {
                                                if (entryInfoStatus) {
                                                    updateAllEntryInfoFields(entryInfoStatus);
                                                    setEntryInfoStatus(null);
                                                }
                                            }}
                                            disabled={!entryInfoStatus}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                >
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
                            <div className="mb-2 p-2 bg-yellow-50 border-round text-xs">
                                <strong>🔍 Heritage Type Debug:</strong><br/>
                                Value: {JSON.stringify(data.entryAndLocation.heritageType.value)}<br/>
                                Options Count: {heritageTypeOptions?.length || 0}<br/>
                                Selected Option: {JSON.stringify(heritageTypeOptions?.find(opt => opt.value === data?.entryAndLocation?.heritageType?.value))}<br/>
                                From localStorage: {localStorage.getItem('preSelectedHeritageType')}
                            </div>
                            <FieldWithHistory
                                label="Tipo de Patrimonio"
                                field={data.entryAndLocation.heritageType}
                                type="dropdown"
                                required={true}
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
                                required={true}
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
                <Panel
                    header="Ubicación del Objeto"
                    toggleable
                    headerTemplate={(options) => {
                        return (
                            <div className="flex align-items-center justify-content-between w-full">
                                <div className="flex align-items-center">
                                    <button
                                        className={options.togglerClassName}
                                        onClick={options.onTogglerClick}
                                    >
                                        <span className={options.togglerIconClassName}></span>
                                    </button>
                                    <span className="font-bold">Ubicación del Objeto</span>
                                </div>
                                {canChangeStatus() && (
                                    <div className="flex align-items-center gap-2">
                                        <Dropdown
                                            value={objectLocationStatus}
                                            options={statusOptions}
                                            onChange={(e) => setObjectLocationStatus(e.value)}
                                            placeholder="Seleccionar estado"
                                            className="p-inputtext-sm"
                                        />
                                        <Button
                                            label="Aplicar a todos"
                                            icon="pi pi-check"
                                            className="p-button-sm"
                                            onClick={() => {
                                                if (objectLocationStatus) {
                                                    updateAllObjectLocationFields(objectLocationStatus);
                                                    setObjectLocationStatus(null);
                                                }
                                            }}
                                            disabled={!objectLocationStatus}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                >
                    <FieldWithHistory
                        label="Ubicación del Objeto"
                        field={data.entryAndLocation.objectLocation}
                        type="objectLocation"
                        onChange={() => {}} // No se usa para este tipo
                        onStatusChange={(status) => updateFieldStatus('objectLocation', status)}
                        onCommentChange={(comment) => updateFieldComment('objectLocation', comment)}
                        canEdit={canEditField(data.entryAndLocation.objectLocation.status as Status)}
                        canViewHistory={canViewHistory()}
                        canChangeStatus={canChangeStatus()}
                        openHistoryDialog={openHistoryDialog}
                        placeholder="Configure la ubicación del objeto"
                        onSubfieldChange={updateObjectLocationField}
                        subfieldLabels={{
                            floor: "Piso",
                            exhibitionRoom: "Sala de Exposición",
                            storage: "Almacén",
                            showcaseShelf: "Vitrina/Estante",
                            shelfDrawer: "Estante/Cajón",
                            box: "Caja",
                            fileFolder: "Carpeta/Archivo"
                        }}
                        subfieldPlaceholders={{
                            floor: "Ingrese el piso",
                            exhibitionRoom: "Ingrese la sala de exposición",
                            storage: "Ingrese el almacén",
                            showcaseShelf: "Ingrese la vitrina o estante",
                            shelfDrawer: "Ingrese el estante o cajón",
                            box: "Ingrese la caja",
                            fileFolder: "Ingrese la carpeta o archivo"
                        }}
                    />
                </Panel>
            </div>
        </div>
    );
};
