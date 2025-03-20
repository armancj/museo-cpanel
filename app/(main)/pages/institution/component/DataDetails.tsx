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
import { TypologyService } from '@/app/service/TypologyService';

interface DataDetailsProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

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

    useEffect(() => {
        const fetchTypologies = async () => {
            setLoadingTypologies(true);
            try {
                const response = await TypologyService.getTypologies();
                const formattedTypologies = response.map(typology => ({
                    name: typology.name,
                    code: typology.uuid,
                    description: typology.description
                }));
                setTypologies(formattedTypologies);
            } catch (error) {
                setTypologies([]);
            } finally {
                setLoadingTypologies(false);
            }
        };

        fetchTypologies();
    }, []);

    useEffect(() => {
        if (data.institutionType) {
        const foundType = institutionTypes.find(type => {
            return type.code === data.institutionType;
        });
            setSelectedInstitutionType(foundType);
        }


        if (data.typology && typologies?.length > 0) {
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

    useEffect(() => {
        const loadCategories = async () => {
            if (selectedInstitutionType) {
                setLoadingCategories(true);
                try {
                    const response = await CategoryMuseumService.get(selectedInstitutionType.code);
                    const formattedCategories = response.map(category => ({
                        name: category.name,
                        code: category.uuid || category.id || '',
                    }));
                    setCategories(formattedCategories);

                    if (data.category) {
                        const foundCategory = formattedCategories.find(c => c.name === data.category);
                        if (foundCategory) {
                            setSelectedCategory(foundCategory as any);
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar categorías:', error);
                    setCategories([]);
                } finally {
                    setLoadingCategories(false);
                }
            }
        };

        loadCategories();
    }, [selectedInstitutionType, data.category]);

    const handleInstitutionTypeChange = async (e: DropdownChangeEvent) => {
        const selectedType = e.value;

        setSelectedInstitutionType(selectedType);

        onInputChange(
            {
                target: {
                    name: 'institutionType',
                    value: selectedType.code,
                    type: 'change',
                    checked: false
                }
            } as React.ChangeEvent<HTMLInputElement>,
            'institutionType'
        );

        setSelectedCategory(null);

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
            console.log({ selected })
        setSelectedClassification(selected);

        onInputChange(
            { target: { name: 'classification', value: selected.code } } as React.ChangeEvent<HTMLInputElement>,
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
