import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { ProducerAuthor } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface props {
    producerAuthor: ProducerAuthor;
}

const AuthorInfoPanel = ({ producerAuthor }: props) => {
    const {
        producerAuthorNames,
        objectEntryHistory,
        street,
        number,
        betweenStreet1,
        betweenStreet2,
        district,
        locality,
        municipality,
        province,
        institutionalHistory,
    } = producerAuthor;

    return (
        <Panel header="Información del Autor" toggleable collapsed={true}>
            <div className="p-grid">
                <div className="p-col-12 p-md-6">
                    <p><b>Nombre:</b> {producerAuthorNames?.value}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Historial de Entrada:</b> {objectEntryHistory?.value}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-4">
                    <p><b>Calle:</b> {street?.value}</p>
                </div>
                <div className="p-col-12 p-md-2">
                    <p><b>Número:</b> {number?.value}</p>
                </div>
                <div className="p-col-12 p-md-3">
                    <p><b>Entre Calle 1:</b> {betweenStreet1?.value}</p>
                </div>
                <div className="p-col-12 p-md-3">
                    <p><b>Entre Calle 2:</b> {betweenStreet2?.value}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Distrito:</b> {district?.value}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Localidad:</b> {locality?.value}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Municipio:</b> {municipality?.value}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Provincia:</b> {province?.value}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Historia Institucional:</b> {institutionalHistory?.value}</p>
                </div>
            </div>
        </Panel>
    );
};

export default AuthorInfoPanel;
