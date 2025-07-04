'use client';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Status } from '../types';
import { hasHistory } from '@/app/(main)/pages/cultural-property-heritage/utils/statusUtils';

interface FieldWithHistoryProps {
    label: string;
    field: any;
    type: 'text' | 'objectLocation' | 'textarea' | 'dropdown' | 'date' | 'number' | 'multiselect' | 'checkbox' | 'daterange';
    options?: any[];
    onChange: (value: any) => void;
    onStatusChange?: (status: Status) => void;
    onCommentChange?: (comment: string) => void;
    canEdit: boolean;
    canViewHistory: boolean;
    canChangeStatus: boolean;
    openHistoryDialog: (field: any, title: string) => void;
    required?: boolean;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    onSubfieldChange?: (subfield: string, value: any) => void;
    subfieldLabels?: Record<string, string>;
    subfieldPlaceholders?: Record<string, string>;
}

export const FieldWithHistory = ({
    label,
    field,
    type,
    options,
    onChange,
    onStatusChange,
    onCommentChange,
    canEdit,
    canViewHistory,
    canChangeStatus,
    openHistoryDialog,
    required = false,
    className = '',
    placeholder = '',
    disabled = false,
    onSubfieldChange,
    subfieldLabels,
    subfieldPlaceholders
}: FieldWithHistoryProps) => {
    const [showComment, setShowComment] = useState(false);

    const handleDateChange = (dateValue: Date | null) => {
        console.log('🔍 Date field change:', { label, dateValue });

        // Process the date value - convert to ISO string if it's a valid date, otherwise use empty string
        let processedValue = '';
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            processedValue = dateValue.toISOString();
        }

        console.log('🔍 Processed date value:', processedValue);
        onChange(processedValue);
    };

    // Function to handle daterange changes
    const handleDateRangeChange = (dateField: 'start' | 'end', dateValue: Date | null) => {
        let processedValue = '';
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            processedValue = dateValue.toISOString();
        }

        const currentRange = (field && field.value) ? field.value : {};

        onChange({
            ...currentRange,
            [dateField]: processedValue
        });
    };

    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

    // Function to get status label
    const getStatusLabel = (status: Status) => {
        switch (status) {
            case Status.Pending:
                return 'Pendiente';
            case Status.ToReview:
                return 'Para Revisar';
            case Status.Reviewed:
                return 'Revisado';
            case Status.HasIssue:
                return 'Con Problemas';
            default:
                return 'Desconocido';
        }
    };

    // Function to get status class
    const getStatusClass = (status: Status) => {
        switch (status) {
            case Status.Pending:
                return 'bg-blue-100 text-blue-900';
            case Status.ToReview:
                return 'bg-yellow-100 text-yellow-900';
            case Status.Reviewed:
                return 'bg-green-100 text-green-900';
            case Status.HasIssue:
                return 'bg-red-100 text-red-900';
            default:
                return 'bg-gray-100 text-gray-900';
        }
    };

    const renderObjectLocation = () => {
        if (!onSubfieldChange || !subfieldLabels || !subfieldPlaceholders) {
            return <div>Error: Configuración incompleta para objectLocation</div>;
        }

        const locationValue = field.value || {};
        const subfields = ['floor', 'exhibitionRoom', 'storage', 'showcaseShelf', 'shelfDrawer', 'box', 'fileFolder'];

        return (
            <div className="grid">
                {subfields.map((subfieldKey, index) => (
                    <div key={subfieldKey} className="col-12 md:col-6">
                        <label className="block mb-1">{subfieldLabels[subfieldKey]}</label>
                        {canEdit ? (
                            <InputText value={locationValue[subfieldKey] || ''} onChange={(e) => onSubfieldChange(subfieldKey, e.target.value)} className="w-full" placeholder={subfieldPlaceholders[subfieldKey]} disabled={disabled} />
                        ) : (
                            <div className="p-2 border-1 border-gray-300 border-round">{locationValue[subfieldKey] || 'No definido'}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // Render the appropriate input based on type
    const renderInput = () => {
        if (!canEdit) {
            // Read-only view
            switch (type) {
                case 'objectLocation':
                    return <div className="p-2 border-1 border-gray-300 border-round">{renderObjectLocation()}</div>;
                case 'text':
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value || 'No definido'}</div>;
                case 'textarea':
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value || 'No definido'}</div>;
                case 'dropdown':
                    const selectedOption = options?.find((opt) => opt.value === field.value);
                    return <div className="p-2 border-1 border-gray-300 border-round">{selectedOption?.label || 'No definido'}</div>;
                case 'date':
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value ? new Date(field.value).toLocaleDateString() : 'No definido'}</div>;
                case 'daterange':
                    return (
                        <div className="p-2 border-1 border-gray-300 border-round">
                            {field?.value?.start ? new Date(field.value.start).toLocaleDateString() : 'No definido'} - {field?.value?.end ? new Date(field.value.end).toLocaleDateString() : 'No definido'}
                        </div>
                    );
                case 'number':
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value !== undefined ? field.value : 'No definido'}</div>;
                case 'multiselect':
                    const selectedLabels = field.value
                        ?.map((val: any) => {
                            const opt = options?.find((o) => o.value === val);
                            return opt?.label || val;
                        })
                        .join(', ');
                    return <div className="p-2 border-1 border-gray-300 border-round">{selectedLabels || 'No definido'}</div>;
                case 'checkbox':
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value ? 'Sí' : 'No'}</div>;
                default:
                    return <div className="p-2 border-1 border-gray-300 border-round">{field.value || 'No definido'}</div>;
            }
        }

        // Editable inputs
        switch (type) {
            case 'objectLocation':
                return renderObjectLocation();
            case 'text':
                return <InputText value={field.value || ''} onChange={(e) => onChange(e.target.value)} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
            case 'textarea':
                return <InputTextarea value={field.value || ''} onChange={(e) => onChange(e.target.value)} rows={5} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
            case 'dropdown':
                return <Dropdown value={field.value} options={options} onChange={(e) => onChange(e.value)} className={`w-full ${className}`} placeholder={placeholder || 'Seleccione una opción'} required={required} disabled={disabled} filter />;
            case 'date':
                return (
                    <Calendar
                        value={field.value ? new Date(field.value) : null}
                        onChange={(e) => handleDateChange(e.value as  Date | null )}
                        dateFormat="dd/mm/yy"
                        className={`w-full ${className}`}
                        placeholder={placeholder || 'Seleccione una fecha'}
                        required={required}
                    />
                );
            case 'daterange':
                return (
                    <div className="grid">
                        <div className="col-6">
                            <label className="block mb-1">Fecha Inicio</label>
                            <Calendar
                                value={field?.value?.start ? new Date(field.value.start) : null}
                                onChange={(e) => handleDateRangeChange('start', e.value as  Date | null)}
                                dateFormat="dd/mm/yy"
                                className={`w-full ${className}`}
                                placeholder="Fecha inicio"
                                required={required}
                            />
                        </div>
                        <div className="col-6">
                            <label className="block mb-1">Fecha Fin</label>
                            <Calendar
                                value={field?.value?.end ? new Date(field.value.end) : null}
                                onChange={(e) => handleDateRangeChange('end', e.value as  Date | null)}
                                dateFormat="dd/mm/yy"
                                className={`w-full ${className}`}
                                placeholder="Fecha fin"
                                required={required}
                            />
                        </div>
                    </div>
                );
            case 'number':
                return <InputNumber value={field.value} onValueChange={(e) => onChange(e.value)} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
            case 'multiselect':
                return <MultiSelect value={field.value || []} options={options} onChange={(e) => onChange(e.value)} className={`w-full ${className}`} placeholder={placeholder || 'Seleccione opciones'} required={required} filter />;
            case 'checkbox':
                return (
                    <div className="flex align-items-center">
                        <Checkbox checked={field.value || false} onChange={(e) => onChange(e.checked)} className={className} />
                        <label className="ml-2">{placeholder}</label>
                    </div>
                );
            default:
                return <InputText value={field.value || ''} onChange={(e) => onChange(e.target.value)} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
        }
    };

    return (
        <div className="field mb-4">
            <div className="flex justify-content-between align-items-center mb-2">
                <label className={required ? 'required' : ''}>{label}</label>
                <div className="flex gap-2">
                    {canViewHistory && hasHistory(field) && field.history && field.history.length > 0 && <Button icon="pi pi-history" className="p-button-rounded p-button-text p-button-sm" tooltip="Ver historial" onClick={() => openHistoryDialog(field, label)} />}
                    {canChangeStatus && <Button icon="pi pi-comment" className="p-button-rounded p-button-text p-button-sm" tooltip="Agregar comentario" onClick={() => setShowComment(!showComment)} />}
                </div>
            </div>

            <div className="mb-2">{renderInput()}</div>

            {/* Status indicator */}
            <div className="flex justify-content-between align-items-center">
                <div className={`text-sm px-2 py-1 border-round ${getStatusClass(field?.status || Status.Pending
                )}`}>{getStatusLabel(field?.status || Status.Pending)}</div>

                {canChangeStatus &&
                    <Dropdown
                        value={field?.status || Status.Pending}
                        options={statusOptions}
                        onChange={(e) => onStatusChange && onStatusChange(e.value)}
                        className="p-inputtext-sm"
                        disabled={disabled} />}
            </div>

            {/* Comment section */}
            {showComment && (
                <div className="mt-2">
                    <InputTextarea value={field.comment || ''} onChange={(e) => onCommentChange && onCommentChange(e.target.value)} rows={2} className="w-full" placeholder="Agregar comentario..." />
                </div>
            )}

            {/*/!* Debug info *!/*/}
            {/*{label === 'Condiciones de Acceso' && (*/}
            {/*    <div className="mt-2 p-2 bg-yellow-50 border-round text-xs">*/}
            {/*        <strong>🔍 DEBUG INFO:</strong><br/>*/}
            {/*        History Length: {field?.history?.length || 0}<br/>*/}
            {/*        Button Visible: {canViewHistory && field.history && field.history.length > 0 ? 'Sí' : 'No'}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};
