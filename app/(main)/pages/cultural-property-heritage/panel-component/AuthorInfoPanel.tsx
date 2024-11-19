import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { ProducerAuthor } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface props {
    producerAuthor: ProducerAuthor
}
const AuthorInfoPanel = ({ producerAuthor }:props) => {
    return (
        <Panel header="Información del Autor" toggleable collapsed={true}>
            <div className="p-grid">
                <div className="p-col-12 p-md-6">
                    <p><b>Nombre:</b> {producerAuthor.producerAuthorNames}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Historial de Entrada:</b> {producerAuthor.objectEntryHistory}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-4">
                    <p><b>Calle:</b> {producerAuthor.street}</p>
                </div>
                <div className="p-col-12 p-md-2">
                    <p><b>Número:</b> {producerAuthor.number}</p>
                </div>
                <div className="p-col-12 p-md-3">
                    <p><b>Entre Calle 1:</b> {producerAuthor.betweenStreet1}</p>
                </div>
                <div className="p-col-12 p-md-3">
                    <p><b>Entre Calle 2:</b> {producerAuthor.betweenStreet2}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Distrito:</b> {producerAuthor.district}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Localidad:</b> {producerAuthor.locality}</p>
                </div>
                <Divider />
                <div className="p-col-12 p-md-6">
                    <p><b>Municipio:</b> {producerAuthor.municipality}</p>
                </div>
                <div className="p-col-12 p-md-6">
                    <p><b>Provincia:</b> {producerAuthor.province}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Historia Institucional:</b> {producerAuthor.institutionalHistory}</p>
                </div>
            </div>
        </Panel>
    );
};

export default AuthorInfoPanel;
