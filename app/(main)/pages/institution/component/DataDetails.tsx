import React, { useMemo, useState } from 'react';
import { Panel } from 'primereact/panel';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import { AddressResponse } from '@/app/service/UserService';
import { useAddress } from '@/app/(main)/pages/hooks/useAddress';
import { ContactInformationForm } from '@/app/(main)/pages/institution/component/ContactInformationForm';
import { InstitutionAddressInputForm } from '@/app/(main)/pages/institution/component/InstitutionAddressInputForm';
import { BasicInstitutionData } from '@/app/(main)/pages/institution/component/BasicInstitutionData';
import {
    InstitutionClassificationFields
} from '@/app/(main)/pages/institution/component/InstitutionClassificationFields';
import {
    useInstitutionClassificationDataHandlers
} from '@/app/(main)/pages/institution/hooks/useInstitutionClassificationDataHandlers';

interface DataDetailsProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateField = (field: string) => field.trim().length > 0;
    const {
        countries,
        provinces,
        municipalities,
        handleCountryChange,
        handleProvinceChange,
        isProvinceDisabled,
        isMunicipalityDisabled,
    } = useAddressData();

    const [selectedCountry, setSelectedCountry] = useState<AddressResponse | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<AddressResponse | null>(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState<AddressResponse | null>(null);

    const [selectedInstitutionType, setSelectedInstitutionType] = useState<any>(null);
    const [categories, setCategories] = useState<{ name: string, code: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ name: string, code: string }[] | null>();

    const [selectedClassification, setSelectedClassification] = useState<any>(null);
    const [typologies, setTypologies] = useState<{ name: string, code: string }[]>([]);
    const [loadingTypologies, setLoadingTypologies] = useState<boolean>(false);
    const [selectedTypology, setSelectedTypology] = useState<any>(null)
    const [loadingCategories, setLoadingCategories] = useState(false);

    const institutionTypes = useMemo(() => [
        { name: 'Museo', code: 'Museo' },
        { name: 'Complejo Museístico', code: 'Complejo Mus' },
        { name: 'Extensión Museística', code: 'Ext. Mus' },
        { name: 'Salas Museísticas', code: 'Salas Mus' },
        { name: 'OMSH', code: 'OMSH' },
        { name: 'RBC', code: 'RBC' },
        { name: 'Centro Cultural', code: 'CCULT' },
        { name: 'Biblioteca', code: 'Bibliot' },
        { name: 'Archivo', code: 'Archivo' },
    ], []);

    const classifications = useMemo(() => [
        { name: 'Nacional', code: 'Nacional' },
        { name: 'Provincial', code: 'Provincial' },
        { name: 'Municipal', code: 'Municipal' },
    ], []);

    const {
        onCountryChange,
        onProvincesChange,
        onMunicipalitiesChange,
    } = useAddress(countries, data, setSelectedCountry, provinces, setSelectedProvince, municipalities, setSelectedMunicipality, handleCountryChange, onInputChange, handleProvinceChange);

    const {
        handleInstitutionTypeChange,
        handleCategoryChange,
        handleTypologyChange,
        handleClassificationChange,
        isCategoryDisabled,
    } = useInstitutionClassificationDataHandlers(setLoadingTypologies, setTypologies, data, institutionTypes, setSelectedInstitutionType, typologies, selectedTypology, setSelectedTypology, classifications, selectedClassification, setSelectedClassification, selectedInstitutionType, setLoadingCategories, setCategories, setSelectedCategory, onInputChange, loadingCategories);

    return (
        <Panel header="Detalles de Institución" className="p-fluid">
            <div className="grid">
                {/* Datos básicos */}
                {BasicInstitutionData(data, onInputChange, submitted, validateField)}

                {/* Clasificación de Institución */}
                {InstitutionClassificationFields(
                    selectedInstitutionType,
                    institutionTypes,
                    handleInstitutionTypeChange,
                    submitted,
                    selectedCategory,
                    categories,
                    handleCategoryChange,
                    isCategoryDisabled,
                    loadingCategories,
                    selectedClassification,
                    classifications,
                    handleClassificationChange,
                    selectedTypology,
                    typologies,
                    handleTypologyChange,
                    loadingTypologies)
                }

                {/* Dirección de Institución */}
                {InstitutionAddressInputForm(
                    data,
                    onInputChange,
                    submitted,
                    validateField,
                    selectedCountry,
                    countries,
                    onCountryChange,
                    selectedProvince,
                    provinces,
                    onProvincesChange,
                    isProvinceDisabled,
                    selectedMunicipality,
                    municipalities,
                    onMunicipalitiesChange,
                    isMunicipalityDisabled)}

                {/* Información de Contacto */}
                {ContactInformationForm(data, onInputChange, submitted, validateField)}
            </div>
        </Panel>
    );
}
