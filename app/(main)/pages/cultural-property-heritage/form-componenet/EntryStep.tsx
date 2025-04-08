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
    const {
        entryDate,
        entryMethod,
        pieceInventory,
        inventoryNumber,
        auxiliaryInventory,
        objectLocation,
        objectName,
        initialDescription,
        institutionType,
        declarationType,
        heritageType,
        genericClassification,
    } = data;

    // Submanejador para propiedades anidadas (ObjectLocation)
    const handleObjectLocationChange = (field: keyof ObjectLocation, value: string) => {
        const updatedObjectLocation = {
            ...objectLocation,
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
                    value={objectName.value}
                    onChange={(e) => onChange('objectName', { ...objectName, value: e.target.value })}
                />
            </div>

            {/* Tipo de Patrimonio */}
            <div className="field">
                <label htmlFor="heritageType">Tipo de Patrimonio</label>
                <Dropdown
                    id="heritageType"
                    value={heritageType.value}
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
                    value={institutionType.value}
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
                    value={inventoryNumber.value}
                    onChange={(e) => onChange('inventoryNumber', {...inventoryNumber, value: e.target.value })}
                />
            </div>

            {/* Clasificación Genérica */}
            <div className="field">
                <label htmlFor="genericClassification">Clasificación Genérica</label>
                <InputText
                    id="genericClassification"
                    value={genericClassification.value}
                    onChange={(e) => onChange('genericClassification', { ...genericClassification, value: e.target.value })}
                />
            </div>

            {/* Fecha de Entrada */}
            <div className="field">
                <label htmlFor="entryDate">Fecha de Entrada</label>
                <Calendar
                    id="entryDate"
                    value={entryDate?.value}
                    onChange={(e) => onChange('entryDate', { ...entryDate, value: e.value ?? new Date(Date.now()) })}
                    showButtonBar
                    dateFormat="yy-mm-dd"
                />
            </div>

            {/* Descripción Inicial */}
            <div className="field">
                <label htmlFor="initialDescription">Descripción Inicial</label>
                <InputText
                    id="initialDescription"
                    value={initialDescription.value}
                    onChange={(e) => onChange('initialDescription', { ...initialDescription, value: e.target.value })}
                />
            </div>

            {/* Inventarios Auxiliares y Piezas */}
            <div className="p-grid">
                <div className="p-col-6">
                    <div className="field">
                        <label htmlFor="auxiliaryInventory">Inventario Auxiliar</label>
                        <InputSwitch
                            id="auxiliaryInventory"
                            checked={auxiliaryInventory.value}
                            onChange={(e) => onChange('auxiliaryInventory', { ...auxiliaryInventory, value: e.value })}
                        />
                    </div>
                </div>
                <div className="p-col-6">
                    <div className="field">
                        <label htmlFor="pieceInventory">Inventario de Piezas</label>
                        <InputSwitch
                            id="pieceInventory"
                            checked={pieceInventory.value}
                            onChange={(e) => onChange('pieceInventory', { ...pieceInventory, value: e.value })}
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
                            value={objectLocation?.value?.storage}
                            onChange={(e) => handleObjectLocationChange('storage', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="box">Caja</label>
                        <InputText
                            id="box"
                            value={objectLocation?.value?.box}
                            onChange={(e) => handleObjectLocationChange('box', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="fileFolder">Carpeta</label>
                        <InputText
                            id="fileFolder"
                            value={objectLocation?.value?.fileFolder}
                            onChange={(e) => handleObjectLocationChange('fileFolder', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="floor">Piso</label>
                        <InputText
                            id="floor"
                            value={objectLocation?.value?.floor}
                            onChange={(e) => handleObjectLocationChange('floor', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="shelfDrawer">Estantería</label>
                        <InputText
                            id="shelfDrawer"
                            value={objectLocation?.value?.shelfDrawer}
                            onChange={(e) => handleObjectLocationChange('shelfDrawer', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="showcaseShelf">Vitrina</label>
                        <InputText
                            id="showcaseShelf"
                            value={objectLocation?.value?.showcaseShelf}
                            onChange={(e) => handleObjectLocationChange('showcaseShelf', e.target.value)}
                        />
                    </div>
                    <div className="p-col-6">
                        <label htmlFor="exhibitionRoom">Sala de Exhibición</label>
                        <InputText
                            id="exhibitionRoom"
                            value={objectLocation?.value?.exhibitionRoom}
                            onChange={(e) => handleObjectLocationChange('exhibitionRoom', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntryStep;
