import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { EntryAndLocation } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    entryAndLocation: EntryAndLocation;
}

const EntryAndLocationPanel = ({ entryAndLocation }: Props) => {
    return (
        <Panel header="Ubicación del Objeto" toggleable collapsed>
            <div className="p-grid">
                <div className="p-col-12 p-md-6">
                    <p><b>Ubicación:</b> {`${entryAndLocation.objectLocation.box}, ${entryAndLocation.objectLocation.shelfDrawer}, ${entryAndLocation.objectLocation.storage}`}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Institución:</b> {entryAndLocation.institutionType}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Inventario Auxiliar:</b> {entryAndLocation.auxiliaryInventory ? 'Sí' : 'No'}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Declaración:</b> {entryAndLocation.declarationType}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Fecha de Entrada:</b> {new Date(entryAndLocation.entryDate).toLocaleDateString()}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Método de Entrada:</b> {entryAndLocation.entryMethod}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Clasificación Genérica:</b> {entryAndLocation.genericClassification}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Tipo de Patrimonio:</b> {entryAndLocation.heritageType}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Descripción Inicial:</b> {entryAndLocation.initialDescription}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Número de Inventario:</b> {entryAndLocation.inventoryNumber}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Nombre del Objeto:</b> {entryAndLocation.objectName}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Inventario de Piezas:</b> {entryAndLocation.pieceInventory ? 'Sí' : 'No'}</p>
                </div>
            </div>
        </Panel>
    );
};

export default EntryAndLocationPanel;
