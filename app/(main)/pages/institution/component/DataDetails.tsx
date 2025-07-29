import React from 'react';
import { Panel } from 'primereact/panel';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { ContactInformationForm } from '@/app/(main)/pages/institution/component/ContactInformationForm';
import { InstitutionAddressInputForm } from '@/app/(main)/pages/institution/component/InstitutionAddressInputForm';
import { BasicInstitutionData } from '@/app/(main)/pages/institution/component/BasicInstitutionData';
import { InstitutionClassificationFields } from '@/app/(main)/pages/institution/component/InstitutionClassificationFields';
import { useInstitutionDetailsForm } from '@/app/(main)/pages/institution/hooks/useInstitutionDetailsForm';

interface DataDetailsProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateField = (field: string | undefined | null) => field && field.trim().length > 0;

    const {
        // Address data
        countries,
        provinces,
        municipalities,
        selectedCountry,
        selectedProvince,
        selectedMunicipality,
        isProvinceDisabled,
        isMunicipalityDisabled,
        onCountryChange,
        onProvinceChange,
        onMunicipalityChange,

        // Institution classification data
        institutionTypes,
        classifications,
        typologies,
        categories,
        selectedInstitutionType,
        selectedClassification,
        selectedTypology,
        selectedCategory,
        loadingTypologies,
        loadingCategories,
        isCategoryDisabled,
        handleInstitutionTypeChange,
        handleCategoryChange,
        handleTypologyChange,
        handleClassificationChange,
    } = useInstitutionDetailsForm({ data, onInputChange });

    return (
        <Panel header="Detalles de Institución" className="p-fluid">
            <div className="grid">
                {/* Datos básicos */}
                <BasicInstitutionData data={data} onInputChange={onInputChange} submitted={submitted} validateField={validateField} />

                {/* Clasificación de Institución */}
                <InstitutionClassificationFields
                    selectedInstitutionType={selectedInstitutionType}
                    institutionTypes={institutionTypes}
                    handleInstitutionTypeChange={handleInstitutionTypeChange}
                    submitted={submitted}
                    selectedCategory={selectedCategory as unknown as {
                        name: string;
                        code: string;
                    }[]}
                    categories={categories}
                    handleCategoryChange={handleCategoryChange}
                    isCategoryDisabled={isCategoryDisabled}
                    loadingCategories={loadingCategories}
                    selectedClassification={selectedClassification}
                    classifications={classifications}
                    handleClassificationChange={handleClassificationChange}
                    selectedTypology={selectedTypology}
                    typologies={typologies}
                    handleTypologyChange={handleTypologyChange}
                    loadingTypologies={loadingTypologies}
                />

                {/* Dirección de Institución */}
                <InstitutionAddressInputForm
                    data={data}
                    onInputChange={onInputChange}
                    submitted={submitted}
                    validateField={validateField}
                    selectedCountry={selectedCountry}
                    countries={countries}
                    onCountryChange={onCountryChange}
                    selectedProvince={selectedProvince}
                    provinces={provinces}
                    onProvincesChange={onProvinceChange}
                    isProvinceDisabled={isProvinceDisabled}
                    selectedMunicipality={selectedMunicipality}
                    municipalities={municipalities}
                    onMunicipalitiesChange={onMunicipalityChange}
                    isMunicipalityDisabled={isMunicipalityDisabled}
                />

                {/* Información de Contacto */}
                <ContactInformationForm data={data} onInputChange={onInputChange} submitted={submitted} validateField={validateField} />
            </div>
        </Panel>
    );
}
