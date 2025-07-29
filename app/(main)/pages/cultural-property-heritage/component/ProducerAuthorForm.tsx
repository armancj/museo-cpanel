'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getUpdatedStatus } from '../utils/statusUtils';

interface ProducerAuthorFormProps {
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
    provinceOptions: { label: string; value: string }[];
    municipalityOptions: { label: string; value: string }[];
    fetchMunicipalitiesForProvince: (provinceName: string) => Promise<void>;
}

export const ProducerAuthorForm = ({
                                       data,
                                       setData,
                                       canEditField,
                                       canViewHistory,
                                       canChangeStatus,
                                       openHistoryDialog,
                                       isEditMode,
                                       markStepCompleted,
                                       currentStep,
                                       submitted,
                                       provinceOptions,
                                       municipalityOptions,
                                       fetchMunicipalitiesForProvince
                                   }: ProducerAuthorFormProps) => {
    // States
    const [producerAuthorStatus, setProducerAuthorStatus] = useState<Status | null>(null);
    const [addressStatus, setAddressStatus] = useState<Status | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Refs para evitar loops infinitos
    const initializedRef = useRef(false);
    const lastProvinceRef = useRef<string>('');
    const lastValidationStateRef = useRef<boolean>(false); // Guardar último estado de validación

    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

    // ✅ Inicialización SOLO cuando es necesario
    useEffect(() => {
        if (!data || data.producerAuthor || initializedRef.current) return;

        initializedRef.current = true;

        setData({
            ...data,
            producerAuthor: {
                betweenStreet1: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                betweenStreet2: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                district: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                institutionalHistory: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                locality: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                municipality: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                number: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                objectEntryHistory: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                producerAuthorNames: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                province: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                street: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
            }
        });
    }, [data?.uuid]); // Solo depende del UUID

    // ✅ Reset cuando cambia el UUID
    useEffect(() => {
        const currentUuid = data?.uuid || '';
        if (currentUuid) {
            initializedRef.current = false;
            lastValidationStateRef.current = false;
        }
    }, [data?.uuid]);

    // ✅ Validación optimizada que evita llamadas constantes
    const isValidForm = useMemo(() => {
        if (!data.producerAuthor) return false;
        const requiredValue = data.producerAuthor.producerAuthorNames?.value || '';
        return requiredValue !== null && requiredValue !== undefined && requiredValue !== '';
    }, [data.producerAuthor?.producerAuthorNames?.value]);

    // ✅ Solo llamar markStepCompleted cuando el estado REALMENTE cambie
    useEffect(() => {
        if (!data.producerAuthor) {
            if (lastValidationStateRef.current !== false) {
                lastValidationStateRef.current = false;
                markStepCompleted(currentStep, false);
            }
            return;
        }

        // Solo llamar markStepCompleted si el estado de validación cambió
        if (lastValidationStateRef.current !== isValidForm) {
            lastValidationStateRef.current = isValidForm;
            markStepCompleted(currentStep, isValidForm);
        }
    }, [isValidForm, currentStep, markStepCompleted, data.producerAuthor]);

    // ✅ Fetch municipalities optimizado
    useEffect(() => {
        const currentProvince = data.producerAuthor?.province?.value;

        if (currentProvince && currentProvince !== lastProvinceRef.current) {
            lastProvinceRef.current = currentProvince;
            setIsLoading(true);

            fetchMunicipalitiesForProvince(currentProvince)
                .catch(error => {
                    console.error('Error fetching municipalities:', error);
                })
                .finally(() => setIsLoading(false));
        }
    }, [data.producerAuthor?.province?.value, fetchMunicipalitiesForProvince]);

    // ✅ Update functions sin loops
    const updateField = (field: string, value: any) => {
        if (!data.producerAuthor) return;

        const currentField = data.producerAuthor[field as keyof typeof data.producerAuthor];
        const newStatus = getUpdatedStatus(value, currentField.status as Status);

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...currentField,
                    value,
                    status: newStatus
                }
            }
        });
    };

    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.producerAuthor) return;

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...data.producerAuthor[field as keyof typeof data.producerAuthor],
                    status
                }
            }
        });
    };

    const updateFieldComment = (field: string, comment: string) => {
        if (!data.producerAuthor) return;

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...data.producerAuthor[field as keyof typeof data.producerAuthor],
                    comment
                }
            }
        });
    };

    const updateAllProducerAuthorFields = (status: Status) => {
        if (!status || !data.producerAuthor) return;

        const updatedFields = ['producerAuthorNames', 'institutionalHistory', 'objectEntryHistory'];

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                ...updatedFields.reduce((acc, field) => ({
                    ...acc,
                    [field]: {
                        ...data.producerAuthor![field as keyof typeof data.producerAuthor],
                        status
                    }
                }), {})
            }
        });
    };

    const updateAllAddressFields = (status: Status) => {
        if (!status || !data.producerAuthor) return;

        const addressFields = [
            'province', 'municipality', 'locality', 'district',
            'street', 'number', 'betweenStreet1', 'betweenStreet2'
        ];

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                ...addressFields.reduce((acc, field) => ({
                    ...acc,
                    [field]: {
                        ...data.producerAuthor![field as keyof typeof data.producerAuthor],
                        status
                    }
                }), {})
            }
        });
    };

    // ✅ Early return después de hooks
    if (!data.producerAuthor) {
        return (
            <div className="flex align-items-center justify-content-center p-4">
                <i className="pi pi-spin pi-spinner mr-2"></i>
                <span>Inicializando formulario...</span>
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel
                    header="Información del Productor/Autor"
                    toggleable
                    headerTemplate={(options) => (
                        <div className="flex align-items-center justify-content-between w-full">
                            <div className="flex align-items-center">
                                <button
                                    className={options.togglerClassName}
                                    onClick={options.onTogglerClick}
                                    type="button"
                                >
                                    <span className={options.togglerIconClassName}></span>
                                </button>
                                <span className="font-bold">Información del Productor/Autor</span>
                            </div>
                            {canChangeStatus() && (
                                <div className="flex align-items-center gap-2">
                                    <Dropdown
                                        value={producerAuthorStatus}
                                        options={statusOptions}
                                        onChange={(e) => setProducerAuthorStatus(e.value)}
                                        placeholder="Seleccionar estado"
                                        className="p-inputtext-sm"
                                        optionLabel="label"
                                        optionValue="value"
                                    />
                                    <Button
                                        label="Aplicar a todos"
                                        icon="pi pi-check"
                                        size="small"
                                        onClick={() => {
                                            if (producerAuthorStatus) {
                                                updateAllProducerAuthorFields(producerAuthorStatus);
                                                setProducerAuthorStatus(null);
                                            }
                                        }}
                                        disabled={!producerAuthorStatus}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                >
                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Nombres del Productor/Autor"
                                field={data.producerAuthor.producerAuthorNames}
                                type="text"
                                onChange={(value) => updateField('producerAuthorNames', value)}
                                onStatusChange={(status) => updateFieldStatus('producerAuthorNames', status)}
                                onCommentChange={(comment) => updateFieldComment('producerAuthorNames', comment)}
                                canEdit={canEditField(data.producerAuthor.producerAuthorNames.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese los nombres del productor o autor"
                            />
                        </div>
                        <div className="col-12">
                            <FieldWithHistory
                                label="Historia Institucional"
                                field={data.producerAuthor.institutionalHistory}
                                type="textarea"
                                onChange={(value) => updateField('institutionalHistory', value)}
                                onStatusChange={(status) => updateFieldStatus('institutionalHistory', status)}
                                onCommentChange={(comment) => updateFieldComment('institutionalHistory', comment)}
                                canEdit={canEditField(data.producerAuthor.institutionalHistory.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la historia institucional"
                            />
                        </div>
                        <div className="col-12">
                            <FieldWithHistory
                                label="Historia de Entrada del Objeto"
                                field={data.producerAuthor.objectEntryHistory}
                                type="textarea"
                                onChange={(value) => updateField('objectEntryHistory', value)}
                                onStatusChange={(status) => updateFieldStatus('objectEntryHistory', status)}
                                onCommentChange={(comment) => updateFieldComment('objectEntryHistory', comment)}
                                canEdit={canEditField(data.producerAuthor.objectEntryHistory.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la historia de entrada del objeto"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel
                    header="Dirección"
                    toggleable
                    headerTemplate={(options) => (
                        <div className="flex align-items-center justify-content-between w-full">
                            <div className="flex align-items-center">
                                <button
                                    className={options.togglerClassName}
                                    onClick={options.onTogglerClick}
                                    type="button"
                                >
                                    <span className={options.togglerIconClassName}></span>
                                </button>
                                <span className="font-bold">Dirección</span>
                                {isLoading && (
                                    <i className="pi pi-spin pi-spinner ml-2" style={{ fontSize: '1rem' }}></i>
                                )}
                            </div>
                            {canChangeStatus() && (
                                <div className="flex align-items-center gap-2">
                                    <Dropdown
                                        value={addressStatus}
                                        options={statusOptions}
                                        onChange={(e) => setAddressStatus(e.value)}
                                        placeholder="Seleccionar estado"
                                        className="p-inputtext-sm"
                                        optionLabel="label"
                                        optionValue="value"
                                    />
                                    <Button
                                        label="Aplicar a todos"
                                        icon="pi pi-check"
                                        size="small"
                                        onClick={() => {
                                            if (addressStatus) {
                                                updateAllAddressFields(addressStatus);
                                                setAddressStatus(null);
                                            }
                                        }}
                                        disabled={!addressStatus}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                >
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Provincia"
                                field={data.producerAuthor.province}
                                type="dropdown"
                                options={provinceOptions}
                                onChange={(value) => updateField('province', value)}
                                onStatusChange={(status) => updateFieldStatus('province', status)}
                                onCommentChange={(comment) => updateFieldComment('province', comment)}
                                canEdit={canEditField(data.producerAuthor.province.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione una provincia"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Municipio"
                                field={data.producerAuthor.municipality}
                                type="dropdown"
                                options={municipalityOptions}
                                onChange={(value) => updateField('municipality', value)}
                                onStatusChange={(status) => updateFieldStatus('municipality', status)}
                                onCommentChange={(comment) => updateFieldComment('municipality', comment)}
                                canEdit={canEditField(data.producerAuthor.municipality.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione un municipio"
                                disabled={isLoading || !data.producerAuthor.province.value}
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Localidad"
                                field={data.producerAuthor.locality}
                                type="text"
                                onChange={(value) => updateField('locality', value)}
                                onStatusChange={(status) => updateFieldStatus('locality', status)}
                                onCommentChange={(comment) => updateFieldComment('locality', comment)}
                                canEdit={canEditField(data.producerAuthor.locality.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la localidad"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Distrito"
                                field={data.producerAuthor.district}
                                type="text"
                                onChange={(value) => updateField('district', value)}
                                onStatusChange={(status) => updateFieldStatus('district', status)}
                                onCommentChange={(comment) => updateFieldComment('district', comment)}
                                canEdit={canEditField(data.producerAuthor.district.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el distrito"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Calle"
                                field={data.producerAuthor.street}
                                type="text"
                                onChange={(value) => updateField('street', value)}
                                onStatusChange={(status) => updateFieldStatus('street', status)}
                                onCommentChange={(comment) => updateFieldComment('street', comment)}
                                canEdit={canEditField(data.producerAuthor.street.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la calle"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Número"
                                field={data.producerAuthor.number}
                                type="text"
                                onChange={(value) => updateField('number', value)}
                                onStatusChange={(status) => updateFieldStatus('number', status)}
                                onCommentChange={(comment) => updateFieldComment('number', comment)}
                                canEdit={canEditField(data.producerAuthor.number.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el número"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Entre Calle 1"
                                field={data.producerAuthor.betweenStreet1}
                                type="text"
                                onChange={(value) => updateField('betweenStreet1', value)}
                                onStatusChange={(status) => updateFieldStatus('betweenStreet1', status)}
                                onCommentChange={(comment) => updateFieldComment('betweenStreet1', comment)}
                                canEdit={canEditField(data.producerAuthor.betweenStreet1.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la primera calle de referencia"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Entre Calle 2"
                                field={data.producerAuthor.betweenStreet2}
                                type="text"
                                onChange={(value) => updateField('betweenStreet2', value)}
                                onStatusChange={(status) => updateFieldStatus('betweenStreet2', status)}
                                onCommentChange={(comment) => updateFieldComment('betweenStreet2', comment)}
                                canEdit={canEditField(data.producerAuthor.betweenStreet2.status as Status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la segunda calle de referencia"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
