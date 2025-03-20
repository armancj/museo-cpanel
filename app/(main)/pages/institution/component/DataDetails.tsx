import React, { useEffect, useMemo, useState } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import { AddressResponse } from '@/app/service/UserService';
import { useAddress } from '@/app/(main)/pages/hooks/useAddress';
import { CategoryMuseumService } from '@/app/service/CategoryMuseumService';
import { ContactInformationForm } from '@/app/(main)/pages/institution/component/ContactInformationForm';
import { InstitutionAddressInputForm } from '@/app/(main)/pages/institution/component/InstitutionAddressInputForm';
import { BasicInstitutionData } from '@/app/(main)/pages/institution/component/BasicInstitutionData';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';

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

    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [selectedClassification, setSelectedClassification] = useState<any>(null);
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
        { name: 'Educativa', code: 'EDU' },
        { name: 'Salud', code: 'SAL' },
        { name: 'Gubernamental', code: 'GOB' },
        { name: 'ONG', code: 'ONG' },
    ], []);

    const typologies = useMemo(() => [
        { name: 'Primaria', code: 'PRI' },
        { name: 'Secundaria', code: 'SEC' },
        { name: 'Universidad', code: 'UNI' },
        { name: 'Hospital', code: 'HOS' },
        { name: 'Ministerio', code: 'MIN' },
    ], []);

    const {
        onCountryChange,
        onProvincesChange,
        onMunicipalitiesChange,
    } = useAddress(countries, data, setSelectedCountry, provinces, setSelectedProvince, municipalities, setSelectedMunicipality, handleCountryChange, onInputChange, handleProvinceChange);

    useEffect(() => {
        if (!data || !data.institutionType || institutionTypes.length === 0) {
            setSelectedInstitutionType(institutionTypes[0]); // Selecciona el primero como default
            onInputChange(
                {
                    target: { name: 'institutionType', value: institutionTypes[0]?.code }
                } as React.ChangeEvent<HTMLInputElement>,
                'institutionType'
            );
            return;
        }

        const foundType = institutionTypes.find(type => type.code
            === data.institutionType);
        console.log("Tipo de institución encontrado:", foundType);
        if (foundType) {
            setSelectedInstitutionType(foundType);
        }


        if (data.typology) {
            const found = typologies.find(t => t.name === data.typology);
            if (found && found !== selectedTypology) {
                setSelectedTypology(found);
            }
        }

        if (data.classification) {
            const found = classifications.find(c => c.name === data.classification);
            if (found && found !== selectedClassification) {
                setSelectedClassification(found);
            }
        }
    }, [data, institutionTypes, typologies, classifications, selectedInstitutionType, selectedTypology, selectedClassification]);
    const handleInstitutionTypeChange = async (e: DropdownChangeEvent) => {
        const selectedType = e.value;
        console.log("Tipo seleccionado:", selectedType);

        setSelectedInstitutionType(selectedType);
        onInputChange(
            { target: { name: 'institutionType', value: selectedType.code } } as React.ChangeEvent<HTMLInputElement>,
            'institutionType',
        );

        // Resetear las categorías
        setSelectedCategory(null);
        onInputChange(
            { target: { name: 'category', value: '' } } as React.ChangeEvent<HTMLInputElement>,
            'category',
        );

        setLoadingCategories(true);
        try {
            const response = await CategoryMuseumService.get(selectedType.code);
            setCategories(response.map(category => ({
                name: category.name,
                code: category.uuid || category.id || '',
            })));
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategoryChange = (e: DropdownChangeEvent) => {
        const category = e.value;
        setSelectedCategory(category);

        onInputChange(
            { target: { name: 'category', value: category.name } } as React.ChangeEvent<HTMLInputElement>,
            'category',
        );
    };

    const handleTypologyChange = (e: DropdownChangeEvent) => {
        const selected = e.value;
        setSelectedTypology(selected);

        onInputChange(
            { target: { name: 'typology', value: selected.name } } as React.ChangeEvent<HTMLInputElement>,
            'typology',
        );
    };


    const handleClassificationChange = (e: DropdownChangeEvent) => {
        const selected = e.value;
        setSelectedClassification(selected);

        onInputChange(
            { target: { name: 'classification', value: selected.name } } as React.ChangeEvent<HTMLInputElement>,
            'classification',
        );
    };

    const isCategoryDisabled = !selectedInstitutionType || loadingCategories;

    return (
        <Panel header="Detalles de Institución" className="p-fluid">
            <div className="grid">
                {/* Datos básicos */}
                {BasicInstitutionData(data, onInputChange, submitted, validateField)}

                {/* Clasificación de Institución */}
                <div className="field col-12">
                    <Divider align="center">
                        <b>Clasificación de Institución</b>
                    </Divider>
                </div>

                <div className="field col-12 md:col-6">
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
                        className={undefined}
                    />
                </div>

                <div className="field col-12 md:col-6">
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

                <div className="field col-12 md:col-6">
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
                        className={undefined}
                    />
                </div>

                <div className="field col-12 md:col-6">
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
                        className={undefined}
                    />
                </div>


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
