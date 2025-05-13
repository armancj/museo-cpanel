import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { EntryAndLocation } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    entryAndLocation: EntryAndLocation;
}

const EntryAndLocationPanel = ({ entryAndLocation }: Props) => {
    const {
        entryMethod,
        entryDate,
        declarationType,
        heritageType,
        institutionType,
        initialDescription,
        genericClassification,
        objectLocation,
        objectName,
        inventoryNumber,
        pieceInventory,
        auxiliaryInventory,
    } = entryAndLocation;

    return (
        <Panel header="Ubicación del Objeto" toggleable collapsed>
            <div className="p-grid">
                <div className="p-col-12 p-md-6">
                    <p>
                        <b>Ubicación:</b> {`${objectLocation?.value.box}, ${objectLocation?.value.shelfDrawer}, ${objectLocation?.value.storage}`}
                    </p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Institución:</b> {institutionType?.value}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Inventario Auxiliar:</b> {auxiliaryInventory?.value ? 'Sí' : 'No'}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Declaración:</b> {declarationType?.value }</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Fecha de Entrada:</b> {new Date(entryDate?.value ).toLocaleDateString()}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Método de Entrada:</b> {entryMethod?.value }</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Clasificación Genérica:</b> {genericClassification?.value }</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Patrimonio:</b> {heritageType?.value }</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Descripción Inicial:</b> {initialDescription?.value }</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Número de Inventario:</b> {inventoryNumber?.value }</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Nombre del Objeto:</b> {objectName?.value }</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Inventario de Piezas:</b> {pieceInventory ? 'Sí' : 'No'}</p>
                </div>
            </div>
        </Panel>
    );
};

export default EntryAndLocationPanel;
