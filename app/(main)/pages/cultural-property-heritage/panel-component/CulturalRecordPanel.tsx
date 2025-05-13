import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { CulturalRecord } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    culturalRecord: CulturalRecord;
}

const CulturalRecordPanel = ({ culturalRecord }: Props) => {
    const {
        objectTitle,
        backgroundTitle,
        objectDescription,
        descriptionInstrument,
        descriptionLevel,
        sectionTitle,
        dimensions,
        volumesQuantities,
        extremeDates,
        institutionalDescriptors,
        geographicDescriptors,
        onomasticDescriptors,
        subjectDescriptors,
        languages,
        conservationState,
        supports,
        valueGrade,
        valuation,
        letters,
    } = culturalRecord;
    return (
        <Panel header="Registro Cultural" toggleable collapsed>
            <Card>
                <div className="p-grid">
                    <div className="p-col-12 p-md-6">
                        <p><b>Título:</b> {objectTitle?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Descripción:</b> {objectDescription?.value}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Descriptores</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Onomásticos:</b> {onomasticDescriptors?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Geográficos:</b> {geographicDescriptors?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Institucionales:</b> {institutionalDescriptors?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Temáticos:</b> {subjectDescriptors?.value}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Fechas Extremas</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p>{`${extremeDates?.value?.start ? new Date(extremeDates.value.start).toLocaleDateString() : 'N/A'} - ${extremeDates?.value?.end ? new Date(extremeDates.value.end).toLocaleDateString() : 'N/A'}`}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Grado y Nivel</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Grado de Valoración:</b> {valueGrade?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Nivel de Descripción:</b> {descriptionLevel?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Valoración:</b> {valuation?.value}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Idiomas y Soportes</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Idiomas:</b> {languages?.value.join(', ')}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Soportes:</b> {supports?.value.join(', ')}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Letras:</b> {letters?.value.join(', ')}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Instrumentos y Conservación</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Instrumentos de Descripción:</b> {descriptionInstrument?.value.join(', ')}
                        </p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Estado de Conservación:</b> {conservationState?.value.join(', ')}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Títulos</b>
                    </Divider>
                    <div className="p-col-12 p-md-6">
                        <p><b>Título del Fondo:</b> {backgroundTitle?.value}</p>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <p><b>Título de la Sección:</b> {sectionTitle?.value}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Volúmenes y Cantidades</b>
                    </Divider>
                    <Panel header="Volúmenes y Cantidades" toggleable collapsed>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <p><b>Archivos:</b> {volumesQuantities?.value.file}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Páginas:</b> {volumesQuantities?.value.pages}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Libros:</b> {volumesQuantities?.value.books}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Objetos:</b> {volumesQuantities?.value.objects}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Fotos:</b> {volumesQuantities?.value.photos}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Grabados:</b> {volumesQuantities?.value.engravings}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Diapositivas:</b> {volumesQuantities?.value.slides}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Negativos:</b> {volumesQuantities?.value.negatives}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p>
                                    <b>Mapas/Planos/Bocetos:</b> {volumesQuantities?.value.mapsPlansSketches}
                                </p>
                            </div>
                        </div>
                    </Panel>
                    <Divider align="center" type="dashed">
                        <b>Dimensiones</b>
                    </Divider>
                    <Panel header="Dimensiones" toggleable collapsed>
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <p><b>Altura (cm):</b> {dimensions?.value.heightCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Ancho (cm):</b> {dimensions?.value.widthCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Longitud (cm):</b> {dimensions?.value.lengthCms}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Metros Cuadrados:</b> {dimensions?.value.squareMeters}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Metros Cúbicos:</b> {dimensions?.value.cubicMeters}</p>
                            </div>
                            <div className="p-col-12 p-md-6">
                                <p><b>Peso (kg):</b> {dimensions?.value.weightKg}</p>
                            </div>
                        </div>
                    </Panel>
                </div>
            </Card>
        </Panel>
    );
};

export default CulturalRecordPanel;
