import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { CulturalRecord } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    culturalRecord: CulturalRecord;
}

const CulturalRecordPanel = ({ culturalRecord }: Props) => {
    return (
        <Panel header="Registro Cultural" toggleable collapsed>
            <Card>
                <div className="p-grid">
                    <div className="p-col-12 p-md-6">
                        <p><b>Título:</b> {culturalRecord.objectTitle}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Descripción:</b> {culturalRecord.objectDescription}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Descriptores</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Onomásticos:</b> {culturalRecord.onomasticDescriptors}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Geográficos:</b> {culturalRecord.geographicDescriptors}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Institucionales:</b> {culturalRecord.institutionalDescriptors}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Temáticos:</b> {culturalRecord.subjectDescriptors}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Fechas Extremas</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p>{`${new Date(culturalRecord.extremeDates.start).toLocaleDateString()} - ${new Date(culturalRecord.extremeDates.end).toLocaleDateString()}`}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Grado y Nivel</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Grado de Valoración:</b> {culturalRecord.valueGrade}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Nivel de Descripción:</b> {culturalRecord.descriptionLevel}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Valoración:</b> {culturalRecord.valuation}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Idiomas y Soportes</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Idiomas:</b> {culturalRecord.languages.join(', ')}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Soportes:</b> {culturalRecord.supports.join(', ')}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Instrumentos y Conservación</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Instrumentos de Descripción:</b> {culturalRecord.descriptionInstrument.join(', ')}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Estado de Conservación:</b> {culturalRecord.conservationState.join(', ')}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Títulos</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Título del Fondo:</b> {culturalRecord.backgroundTitle}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Título de la Sección:</b> {culturalRecord.sectionTitle}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Volúmenes y Cantidades</b>
                    </Divider>
                    <Panel header="Volúmenes y Cantidades" toggleable collapsed>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <p><b>Archivos:</b> {culturalRecord.volumesQuantities.file}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Páginas:</b> {culturalRecord.volumesQuantities.pages}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Libros:</b> {culturalRecord.volumesQuantities.books}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Objetos:</b> {culturalRecord.volumesQuantities.objects}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Fotos:</b> {culturalRecord.volumesQuantities.photos}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Grabados:</b> {culturalRecord.volumesQuantities.engravings}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Diapositivas:</b> {culturalRecord.volumesQuantities.slides}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Negativos:</b> {culturalRecord.volumesQuantities.negatives}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Mapas/Planos/Bocetos:</b> {culturalRecord.volumesQuantities.mapsPlansSketches}</p>
                            </div>
                        </div>
                    </Panel>
                    <Divider align="center" type="dashed">
                        <b>Dimensiones</b>
                    </Divider>
                    <Panel header="Dimensiones" toggleable collapsed>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <p><b>Altura (cm):</b> {culturalRecord.dimensions.heightCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Ancho (cm):</b> {culturalRecord.dimensions.widthCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Longitud (cm):</b> {culturalRecord.dimensions.lengthCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Metros Cuadrados:</b> {culturalRecord.dimensions.squareMeters}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Metros Cúbicos:</b> {culturalRecord.dimensions.cubicMeters}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Peso (kg):</b> {culturalRecord.dimensions.weightKg}</p>
                            </div>
                        </div>
                    </Panel>
                </div>
            </Card>
        </Panel>
    );
};

export default CulturalRecordPanel;
