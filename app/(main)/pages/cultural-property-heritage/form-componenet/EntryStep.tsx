import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {
    EntryAndLocation,
    ObjectLocation,
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface EntryStepProps {
    data: EntryAndLocation; // Datos del paso
    onChange: <K extends keyof EntryAndLocation>(field: K, value: EntryAndLocation[K]) => void; // Evento principal de cambio
}

const EntryStep: React.FC<EntryStepProps> = ({ data, onChange }) => {
    // Submanejador para propiedades anidadas (ObjectLocation)
    const handleObjectLocationChange = (field: keyof ObjectLocation, value: string) => {
        const updatedObjectLocation = {
            ...data.objectLocation,
            [field]: value,
        };
        onChange('objectLocation', updatedObjectLocation);
    };

    /* Opciones de dropdown para tipos de clasificación */
    const heritageTypes = [
        { label: 'Tipo A', value: 'A' },
        { label: 'Tipo B', value: 'B' },
        { label: 'Tipo C', value: 'C' },
    ];

    const institutionTypes = [
        { label: 'Público', value: 'public' },
        { label: 'Privado', value: 'private' },
    ];

    return (
        <div className="p-fluid">
            {/* Nombre del Objeto */}
            <div className="field">
                <label htmlFor="objectName">Nombre del Objeto</label>
                <InputText
                    id="objectName"
                    value={data.objectName}
                    onChange={(e) => onChange('objectName', e.target.value)}
                />
            </div>

            {/* Tipo de Patrimonio */}
            <div className="field">
                <label htmlFor="heritageType">Tipo de Patrimonio</label>
                <Dropdown
                    id="heritageType"
                    value={data.heritageType}
                    options={heritageTypes}
                    onChange={(e) => onChange('heritageType', e.value)}
                    placeholder="Seleccione un tipo"
                />
            </div>

            {/* Tipo de Institución */}
            <div className="field">
                <label htmlFor="institutionType">Tipo de Institución</label>
                <Dropdown
                    id="institutionType"
                    value={data.institutionType}
                    options={institutionTypes}
                    onChange={(e) => onChange('institutionType', e.value)}
                    placeholder="Seleccione un tipo"
                />
            </div>

            {/* Número de Inventario */}
            <div className="field">
                <label htmlFor="inventoryNumber">Número de Inventario</label>
                <InputText
                    id="inventoryNumber"
                    value={data.inventoryNumber}
                    onChange={(e) => onChange('inventoryNumber', e.target.value)}
                />
            </div>

            {/* Clasificación Genérica */}
            <div className="field">
                <label htmlFor="genericClassification">Clasificación Genérica</label>
                <InputText
                    id="genericClassification"
                    value={data.genericClassification}
                    onChange={(e) => onChange('genericClassification', e.target.value)}
                />
            </div>

            {/* Fecha de Entrada */}
            <div className="field">
                <label htmlFor="entryDate">Fecha de Entrada</label>
                <Calendar
                    id="entryDate"
                    value={data.entryDate}
                    onChange={(e) => onChange('entryDate', e.value ?? new Date(Date.now()))}
                    showButtonBar
                    dateFormat="yy-mm-dd"
                />
            </div>

            {/* Descripción Inicial */}
            <div className="field">
                <label htmlFor="initialDescription">Descripción Inicial</label>
                <InputText
                    id="initialDescription"
                    value={data.initialDescription}
                    onChange={(e) => onChange('initialDescription', e.target.value)}
                />
            </div>

            {/* Inventarios Auxiliares y Piezas */}
            <div className="p-grid">
                <div className="p-col-6">
                    <div className="field">
                        <label htmlFor="auxiliaryInventory">Inventario Auxiliar</label>
                        <InputSwitch
                            id="auxiliaryInventory"
                            checked={data.auxiliaryInventory}
                            onChange={(e) => onChange('auxiliaryInventory', e.value)}
                        />
                    </div>
                </div>
                <div className="p-col-6">
                    <div className="field">
                        <label htmlFor="pieceInventory">Inventario de Piezas</label>
                        <InputSwitch
                            id="pieceInventory"
                            checked={data.pieceInventory}
                            onChange={(e) => onChange('pieceInventory', e.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Localización del Objeto */}
            <div className="field">
                <label>Ubicación del Objeto</label>
                <div className="p-grid">
                    <div className="p-col-6">
                        <label htmlFor="storage">Almacenamiento</label>
                        <InputText
                            id="storage"
                            value={data.objectLocation.storage}
                            onChange={(e) => handleObjectLocationChange('storage', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="box">Caja</label>
                        <InputText
                            id="box"
                            value={data.objectLocation.box}
                            onChange={(e) => handleObjectLocationChange('box', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="fileFolder">Carpeta</label>
                        <InputText
                            id="fileFolder"
                            value={data.objectLocation.fileFolder}
                            onChange={(e) => handleObjectLocationChange('fileFolder', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="floor">Piso</label>
                        <InputText
                            id="floor"
                            value={data.objectLocation.floor}
                            onChange={(e) => handleObjectLocationChange('floor', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="shelfDrawer">Estantería</label>
                        <InputText
                            id="shelfDrawer"
                            value={data.objectLocation.shelfDrawer}
                            onChange={(e) => handleObjectLocationChange('shelfDrawer', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="showcaseShelf">Vitrina</label>
                        <InputText
                            id="showcaseShelf"
                            value={data.objectLocation.showcaseShelf}
                            onChange={(e) => handleObjectLocationChange('showcaseShelf', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="exhibitionRoom">Sala de Exhibición</label>
                        <InputText
                            id="exhibitionRoom"
                            value={data.objectLocation.exhibitionRoom}
                            onChange={(e) => handleObjectLocationChange('exhibitionRoom', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntryStep;
