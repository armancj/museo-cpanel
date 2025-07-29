'use client';
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { get, post } from '@/adapter/httpAdapter';

interface AIModel {
    name: string;
    size: string;
    status: string;
    description: string;
    isInstalled: boolean;
}

export const ModelList = () => {
    const [models, setModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [installDialog, setInstallDialog] = useState(false);
    const [modelName, setModelName] = useState('');
    const [installing, setInstalling] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        setLoading(true);
        try {
            const response = await get<AIModel[]>('/ai/models');
            if (Array.isArray(response)) {
                setModels(response);
            } else if (response && typeof response === 'object') {
                if ('data' in response && Array.isArray((response as any).data)) {
                    setModels((response as any).data);
                } else if ('models' in response && Array.isArray((response as any).models)) {
                    setModels((response as any).models);
                } else {
                    console.warn('La respuesta no contiene un array válido:', response);
                    setModels([]);
                }
            } else {
                console.warn('Respuesta inesperada de la API:', response);
                setModels([]);
            }
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            setModels([]); // Asegurar que models sea siempre un array
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los modelos de IA',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const installModel = async () => {
        if (!modelName.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, ingresa un nombre de modelo',
                life: 3000
            });
            return;
        }

        setInstalling(true);
        try {
            await post('/ai/models/install', { modelName });
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Modelo ${modelName} instalado correctamente`,
                life: 3000
            });
            setInstallDialog(false);
            setModelName('');
            fetchModels();
        } catch (error) {
            console.error('Error al instalar modelo:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo instalar el modelo',
                life: 3000
            });
        } finally {
            setInstalling(false);
        }
    };

    const statusBodyTemplate = (rowData: AIModel) => {
        return (
            <span className={`p-badge p-badge-${rowData.isInstalled ? 'success' : 'warning'}`}>
                {rowData.isInstalled ? 'Instalado' : 'No instalado'}
            </span>
        );
    };

    const actionBodyTemplate = (rowData: AIModel) => {
        return (
            <div className="flex justify-content-end">
                {!rowData.isInstalled && (
                    <Button
                        icon="pi pi-download"
                        className="p-button-rounded p-button-success mr-2"
                        onClick={() => {
                            setModelName(rowData.name);
                            setInstallDialog(true);
                        }}
                        tooltip="Instalar modelo"
                    />
                )}
            </div>
        );
    };

    const openInstallDialog = () => {
        setModelName('tinyllama');
        setInstallDialog(true);
    };

    const hideInstallDialog = () => {
        setInstallDialog(false);
        setModelName('');
    };

    const installDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideInstallDialog} disabled={installing} />
            <Button
                label="Instalar"
                icon="pi pi-check"
                className="p-button-text"
                onClick={installModel}
                disabled={installing || !modelName.trim()}
            />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="flex justify-content-end mb-3">
                <Button
                    label="Instalar Modelo"
                    icon="pi pi-plus"
                    className="p-button-primary"
                    onClick={openInstallDialog}
                />
            </div>

            <DataTable
                value={models} // Ahora garantizamos que siempre sea un array
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-gridlines"
                loading={loading}
                emptyMessage="No hay modelos disponibles"
            >
                <Column field="name" header="Nombre" sortable style={{ width: '20%' }}></Column>
                <Column field="description" header="Descripción" style={{ width: '40%' }}></Column>
                <Column field="size" header="Tamaño" sortable style={{ width: '15%' }}></Column>
                <Column header="Estado" body={statusBodyTemplate} sortable style={{ width: '15%' }}></Column>
                <Column body={actionBodyTemplate} style={{ width: '10%' }}></Column>
            </DataTable>

            <Dialog
                visible={installDialog}
                style={{ width: '450px' }}
                header="Instalar Modelo"
                modal
                className="p-fluid"
                footer={installDialogFooter}
                onHide={hideInstallDialog}
            >
                {installing && (
                    <div className="flex align-items-center justify-content-center mb-3">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                    </div>
                )}

                <div className="field">
                    <label htmlFor="modelName">Nombre del Modelo</label>
                    <InputText
                        id="modelName"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        required
                        autoFocus
                        disabled={installing}
                    />
                    <small className="p-error">El nombre del modelo es obligatorio.</small>
                </div>

                <div className="text-sm text-500 mt-2">
                    <p>Modelos recomendados:</p>
                    <ul className="pl-3 mt-1">
                        <li>tinyllama (predeterminado)</li>
                        <li>llama2</li>
                        <li>mistral</li>
                        <li>gemma</li>
                    </ul>
                </div>
            </Dialog>
        </div>
    );
};
