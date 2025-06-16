'use client';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Status } from '../types';

interface FieldWithHistoryProps {
    label: string;
    field: any;
    type: 'text' | 'textarea' | 'dropdown' | 'date' | 'number' | 'multiselect' | 'checkbox' | 'daterange';
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
}: FieldWithHistoryProps) => {
    const [showComment, setShowComment] = useState(false);

    // 🔍 DEBUGGING: Log field data when it changes
    useEffect(() => {
        if (label === 'Condiciones de Acceso') {
            console.log('🔍 FIELD WITH HISTORY - Field data for "Condiciones de Acceso":', field);
            console.log('🔍 FIELD WITH HISTORY - Field keys:', field ? Object.keys(field) : 'null');
            console.log('🔍 FIELD WITH HISTORY - History exists?', !!field?.history);
            console.log('🔍 FIELD WITH HISTORY - History length:', field?.history?.length);
            console.log('🔍 FIELD WITH HISTORY - Full history array:', field?.history);
        }
    }, [field, label]);

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

    const handleHistoryClick = () => {
        console.log('🔍 FIELD WITH HISTORY - History button clicked');
        console.log('🔍 FIELD WITH HISTORY - About to call openHistoryDialog with:', field);
        console.log('🔍 FIELD WITH HISTORY - Label:', label);
        console.log('🔍 FIELD WITH HISTORY - Field history before calling:', field?.history);

        openHistoryDialog(field, label);
    };

    // Render the appropriate input based on type
    const renderInput = () => {
        if (!canEdit) {
            // Read-only view
            switch (type) {
                case 'text':
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
                            {field.value?.start ? new Date(field.value.start).toLocaleDateString() : 'No definido'} -{field.value?.end ? new Date(field.value.end).toLocaleDateString() : 'No definido'}
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
            case 'text':
                return <InputText value={field.value || ''} onChange={(e) => onChange(e.target.value)} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
            case 'textarea':
                return <InputTextarea value={field.value || ''} onChange={(e) => onChange(e.target.value)} rows={5} className={`w-full ${className}`} placeholder={placeholder} required={required} />;
            case 'dropdown':
                return <Dropdown value={field.value} options={options} onChange={(e) => onChange(e.value)} className={`w-full ${className}`} placeholder={placeholder || 'Seleccione una opción'} required={required} disabled={disabled} filter/>;
            case 'date':
                return (
                    <Calendar value={field.value ? new Date(field.value) : null} onChange={(e) => onChange(e.value)} dateFormat="dd/mm/yy" className={`w-full ${className}`} placeholder={placeholder || 'Seleccione una fecha'} required={required} />
                );
            case 'daterange':
                return (
                    <div className="grid">
                        <div className="col-6">
                            <label className="block mb-1">Fecha Inicio</label>
                            <Calendar
                                value={field.value?.start ? new Date(field.value.start) : null}
                                onChange={(e) => onChange({ ...field.value, start: e.value })}
                                dateFormat="dd/mm/yy"
                                className={`w-full ${className}`}
                                placeholder="Fecha inicio"
                                required={required}
                            />
                        </div>
                        <div className="col-6">
                            <label className="block mb-1">Fecha Fin</label>
                            <Calendar
                                value={field.value?.end ? new Date(field.value.end) : null}
                                onChange={(e) => onChange({ ...field.value, end: e.value })}
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
                    {canViewHistory && field.history && field.history.length > 0 && <Button icon="pi pi-history" className="p-button-rounded p-button-text p-button-sm" tooltip="Ver historial" onClick={() => openHistoryDialog(field, label)} />}
                    {canChangeStatus && <Button icon="pi pi-comment" className="p-button-rounded p-button-text p-button-sm" tooltip="Agregar comentario" onClick={() => setShowComment(!showComment)} />}
                </div>
            </div>

            <div className="mb-2">{renderInput()}</div>

            {/* Status indicator */}
            <div className="flex justify-content-between align-items-center">
                <div className={`text-sm px-2 py-1 border-round ${getStatusClass(field.status)}`}>{getStatusLabel(field.status)}</div>

                {canChangeStatus && <Dropdown value={field.status} options={statusOptions} onChange={(e) => onStatusChange && onStatusChange(e.value)} className="p-inputtext-sm" disabled={disabled} />}
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
