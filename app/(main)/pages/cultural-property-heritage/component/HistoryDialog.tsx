'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UsersDatum, UserService } from '@/app/service/UserService';
import { useEffect, useState } from 'react';
import { FileStorageService } from '@/app/service/FileStorageService';

interface HistoryDialogProps {
    visible: boolean;
    onHide: () => void;
    field: any;
    title: string;
}

export const HistoryDialog = ({ visible, onHide, field, title }: HistoryDialogProps) => {
    const [users, setUsers] = useState<Map<string, UsersDatum>>(new Map());
    const [loading, setLoading] = useState(false);

    const formatDate = (date: Date | string | number): string => {
        try {
            let dateObj: Date;

            if (typeof date === 'object' && date !== null && '$date' in date) {
                dateObj = new Date((date as any).$date);
            } else {
                dateObj = date instanceof Date ? date : new Date(date);
            }

            if (isNaN(dateObj.getTime())) return 'Fecha inválida';
            return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    useEffect(() => {
        if (visible && field?.history?.length > 0) {
            loadUsers();
        }
    }, [visible, field]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            // @ts-ignore
            const userUuids = [...new Set(
                field.history
                    .map((item: any) => item.modifiedBy)
                    .filter((uuid: string) => uuid && typeof uuid === 'string' && uuid.trim() !== '')
            )];

            if (userUuids.length > 0) {
                const usersMap = await UserService.getUsersByUuids(userUuids);
                setUsers(usersMap);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Verificar si no hay historial o datos
    if (!field) {
        return (
            <Dialog
                header={`Historial de ${title}`}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={onHide}
                modal
                footer={null}
            >
                <div className="p-4 text-center">
                    <i className="pi pi-exclamation-triangle text-orange-500" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                    <p>❌ No se recibieron datos del campo</p>
                    <small className="text-muted">El campo es null o undefined</small>
                </div>
            </Dialog>
        );
    }

    if (!field.history) {
        return (
            <Dialog
                header={`Historial de ${title}`}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={onHide}
                modal
                footer={null}
            >
                <div className="p-4 text-center">
                    <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                    <p>📝 El campo no tiene propiedad 'history'</p>
                    <details className="mt-3">
                        <summary className="cursor-pointer text-primary">🔍 Ver estructura del campo</summary>
                        <pre className="text-left mt-2 text-xs border p-2 border-round bg-gray-50 overflow-auto">
                            {JSON.stringify(field, null, 2)}
                        </pre>
                    </details>
                </div>
            </Dialog>
        );
    }

    if (field.history.length === 0) {
        return (
            <Dialog
                header={`Historial de ${title}`}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={onHide}
                modal
                footer={null}
            >
                <div className="p-4 text-center">
                    <i className="pi pi-clock" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                    <p>📋 El historial está vacío</p>
                    <small className="text-muted">No hay registros de modificaciones</small>
                </div>
            </Dialog>
        );
    }

    const dateBodyTemplate = (rowData: any) => {
        return formatDate(rowData.modifiedAt);
    };

    const userBodyTemplate = (rowData: any) => {
        const userUuid = rowData.modifiedBy;

        if (!userUuid || userUuid.trim() === '') {
            return (
                <div className="flex align-items-center">
                    <i className="pi pi-cog mr-2 text-muted"></i>
                    <span className="text-muted">Sistema</span>
                </div>
            );
        }

        const user = users.get(userUuid);

        if (user) {
            return (
                <div className="flex align-items-center">
                    <div className="user-avatar mr-2">
                        {user.avatar?.id ? (
                            <img
                                src={FileStorageService.getFileUrl(user.avatar.id)}
                                alt={`${user.name} ${user.lastName}`}
                                className="w-2rem h-2rem border-circle"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : user.name && user.lastName ? (
                            // Iniciales con fondo azul
                            <div
                                className="w-2rem h-2rem border-circle flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }}
                            >
                            <span className="font-medium text-sm">
                                {user.name.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                            </div>
                        ) : (
                            // Ícono con fondo gris
                            <div
                                className="w-2rem h-2rem border-circle flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: '#e9ecef',
                                    color: '#6c757d'
                                }}
                            >
                                <i className="pi pi-user"></i>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium">
                            {user.name && user.lastName
                                ? `${user.name} ${user.lastName}`
                                : 'Usuario'
                            }
                        </div>
                        <small className="text-muted">{user.email}</small>
                    </div>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="flex align-items-center">
                    <i className="pi pi-spin pi-spinner mr-2"></i>
                    <span>Cargando...</span>
                </div>
            );
        }

        return (
            <div className="flex align-items-center">
                <i className="pi pi-user mr-2 text-muted"></i>
                <span className="text-muted">
                    {userUuid.length > 8 ? `${userUuid.substring(0, 8)}...` : userUuid}
                </span>
            </div>
        );
    };

    const valueBodyTemplate = (rowData: any) => {
        const value = rowData.previousValue;

        if (value === null || value === undefined) {
            return <span className="text-muted font-italic">No definido</span>;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return <span className="text-muted font-italic">Array vacío</span>;
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => (
                        <span key={index} className="p-tag p-tag-info">
                            {item}
                        </span>
                    ))}
                </div>
            );
        }

        if (typeof value === 'object') {
            if ('start' in value && 'end' in value) {
                return (
                    <div>
                        <i className="pi pi-calendar mr-1"></i>
                        {formatDate(value.start)} - {formatDate(value.end)}
                    </div>
                );
            }

            try {
                return (
                    <details>
                        <summary className="cursor-pointer text-primary">Ver objeto</summary>
                        <pre className="text-xs mt-2 p-2 border-round bg-gray-50 overflow-auto" style={{ maxHeight: '150px' }}>
                            {JSON.stringify(value, null, 2)}
                        </pre>
                    </details>
                );
            } catch {
                return <span className="text-muted">[Objeto complejo]</span>;
            }
        }

        if (typeof value === 'boolean') {
            return (
                <span className={`p-tag ${value ? 'p-tag-success' : 'p-tag-danger'}`}>
                    <i className={`pi ${value ? 'pi-check' : 'pi-times'} mr-1`}></i>
                    {value ? 'Sí' : 'No'}
                </span>
            );
        }

        if (typeof value === 'string' && value.length > 50) {
            return (
                <details>
                    <summary className="cursor-pointer text-primary">
                        {value.substring(0, 50)}...
                    </summary>
                    <div className="mt-2 p-2 border-round bg-gray-50">
                        {value}
                    </div>
                </details>
            );
        }

        return <span>{value.toString()}</span>;
    };

    const statusBodyTemplate = (rowData: any) => {
        const status = rowData.status;
        let severity = 'info';
        let icon = 'pi-info-circle';

        switch (status?.toLowerCase()) {
            case 'reviewed':
                severity = 'success';
                icon = 'pi-check-circle';
                break;
            case 'to review':
                severity = 'warning';
                icon = 'pi-clock';
                break;
            case 'rejected':
                severity = 'danger';
                icon = 'pi-times-circle';
                break;
            default:
                severity = 'info';
                icon = 'pi-question-circle';
        }

        return (
            <span className={`p-tag p-tag-${severity}`}>
                <i className={`pi ${icon} mr-1`}></i>
                {status || 'Desconocido'}
            </span>
        );
    };

    const commentBodyTemplate = (rowData: any) => {
        const comment = rowData.comment;

        if (!comment || comment.trim() === '') {
            return <span className="text-muted font-italic">Sin comentario</span>;
        }

        if (comment.length > 50) {
            return (
                <details>
                    <summary className="cursor-pointer text-primary">
                        {comment.substring(0, 50)}...
                    </summary>
                    <div className="mt-2 p-2 border-round bg-gray-50">
                        {comment}
                    </div>
                </details>
            );
        }

        return <span>{comment}</span>;
    };

    return (
        <Dialog
            header={
                <div className="flex align-items-center">
                    <i className="pi pi-history mr-2"></i>
                    <span>Historial de {title}</span>
                    <span className={`p-tag p-tag-info ml-2 ${field.history.length < 4 ? 'p-tag-warning' : ''}`}>
                        {field.history.length} registro{field.history.length !== 1 ? 's' : ''}
                        {field.history.length < 4 && ' ⚠️'}
                    </span>
                </div>
            }
            visible={visible}
            style={{ width: '85vw', maxWidth: '1400px' }}
            onHide={onHide}
            modal
            maximizable
            footer={
                <div className="flex justify-content-between align-items-center">
                    <small className="text-muted">
                        <i className="pi pi-info-circle mr-1"></i>
                        Historial ordenado por fecha (más reciente primero)
                    </small>
                    <div>
                        <button
                            className="p-button p-button-text p-button-secondary"
                            onClick={onHide}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            }
        >
            <DataTable
                value={field.history}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 15, 25]}
                tableStyle={{ minWidth: '50rem' }}
                loading={loading}
                emptyMessage="No hay registros en el historial"
                sortField="modifiedAt"
                sortOrder={-1}
                stripedRows
                responsiveLayout="scroll"
                className="p-datatable-sm"
            >
                <Column
                    field="modifiedBy"
                    header="Modificado por"
                    body={userBodyTemplate}
                    sortable
                    style={{ width: '25%', minWidth: '250px' }}
                />
                <Column
                    field="modifiedAt"
                    header="Fecha"
                    body={dateBodyTemplate}
                    sortable
                    style={{ width: '15%', minWidth: '150px' }}
                />
                <Column
                    field="previousValue"
                    header="Valor anterior"
                    body={valueBodyTemplate}
                    style={{ width: '30%', minWidth: '200px' }}
                />
                <Column
                    field="comment"
                    header="Comentario"
                    body={commentBodyTemplate}
                    style={{ width: '20%', minWidth: '150px' }}
                />
                <Column
                    field="status"
                    header="Estado"
                    body={statusBodyTemplate}
                    sortable
                    style={{ width: '10%', minWidth: '120px' }}
                />
            </DataTable>
        </Dialog>
    );
};
