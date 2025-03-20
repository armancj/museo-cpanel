import { DropdownChangeEvent } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';
import React from 'react';

export function InstitutionClassificationFields(selectedInstitutionType: any, institutionTypes: ({ name: string; code: string })[], handleInstitutionTypeChange: (e: DropdownChangeEvent) => Promise<void>, submitted: boolean, selectedCategory: {
    name: string;
    code: string
}[] | null | undefined, categories: {
    name: string;
    code: string
}[], handleCategoryChange: (e: DropdownChangeEvent) => void, isCategoryDisabled: boolean, loadingCategories: boolean, selectedClassification: any, classifications: ({
    name: string;
    code: string
})[], handleClassificationChange: (e: DropdownChangeEvent) => void, selectedTypology: any, typologies: {
    name: string;
    code: string
}[], handleTypologyChange: (e: DropdownChangeEvent) => void, loadingTypologies: boolean) {
    return <>
        <div className="field col-12">
            <Divider align="center">
                <b>Clasificación de Institución</b>
            </Divider>
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="institutionType">Tipo de Institución</label>
            <DropdownField
                id="institutionType"
                name="institutionType"
                value={selectedInstitutionType}
                options={institutionTypes}
                onChange={handleInstitutionTypeChange}
                optionLabel="name"
                placeholder="Selecciona un tipo de institución"
                submitted={submitted}
                required={true}
            />
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="category">Categoría</label>
            <DropdownField
                id="category"
                name="category"
                value={selectedCategory}
                options={categories}
                onChange={handleCategoryChange}
                optionLabel="name"
                placeholder={isCategoryDisabled ? 'Primero seleccione un tipo de institución' : 'Seleccione una categoría'}
                submitted={submitted}
                required={!isCategoryDisabled}
                disabled={isCategoryDisabled}
                className={undefined}
            />
            {loadingCategories && <small className="p-text-secondary">Cargando categorías...</small>}
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="classification">Clasificación</label>
            <DropdownField
                id="classification"
                name="classification"
                value={selectedClassification}
                options={classifications}
                onChange={handleClassificationChange}
                optionLabel="name"
                placeholder="Seleccione la clasificación"
                submitted={submitted}
                required={true}
            />
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="typology">Tipología</label>
            <DropdownField
                id="typology"
                name="typology"
                value={selectedTypology}
                options={typologies}
                onChange={handleTypologyChange}
                optionLabel="name"
                placeholder="Seleccione la tipología"
                submitted={submitted}
                required={true}
                disabled={loadingTypologies}
            />
        </div>
    </>;
}
