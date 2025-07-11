import { useState, useEffect } from 'react';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { TypologyService } from '@/app/service/TypologyService';
import { CategoryMuseumService } from '@/app/service/CategoryMuseumService';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useAddressData } from '@/app/(main)/pages/user/hooks/useAddressData';
import { AddressResponse } from '@/app/service/UserService';

interface DropdownItem {
    name: string;
    code: string;
    description?: string;
}

interface UseInstitutionDetailsFormProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

export const useInstitutionDetailsForm = ({ data, onInputChange }: UseInstitutionDetailsFormProps) => {
    // Address data from the existing hook
    const {
        countries,
        provinces,
        municipalities,
        handleCountryChange,
        handleProvinceChange,
        isProvinceDisabled,
        isMunicipalityDisabled,
    } = useAddressData();

    // Selected address values
    const [selectedCountry, setSelectedCountry] = useState<AddressResponse | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<AddressResponse | null>(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState<AddressResponse | null>(null);

    // 🔧 NUEVO: Estado para controlar la inicialización
    const [isInitializing, setIsInitializing] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Institution classification data
    const [institutionTypes] = useState<DropdownItem[]>([
        { name: 'Museo', code: 'Museo' },
        { name: 'Complejo Museístico', code: 'Complejo Mus' },
        { name: 'Extensión Museística', code: 'Ext. Mus' },
        { name: 'Salas Museísticas', code: 'Salas Mus' },
        { name: 'OMSH', code: 'OMSH' },
        { name: 'RBC', code: 'RBC' },
        { name: 'Centro Cultural', code: 'CCULT' },
        { name: 'Biblioteca', code: 'Bibliot' },
        { name: 'Archivo', code: 'Archivo' },
    ]);

    const [classifications] = useState<DropdownItem[]>([
        { name: 'Nacional', code: 'Nacional' },
        { name: 'Provincial', code: 'Provincial' },
        { name: 'Municipal', code: 'Municipal' },
    ]);

    // Selected classification values
    const [selectedInstitutionType, setSelectedInstitutionType] = useState<DropdownItem | null>(null);
    const [selectedClassification, setSelectedClassification] = useState<DropdownItem | null>(null);
    const [selectedTypology, setSelectedTypology] = useState<DropdownItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(null);

    // Loading states
    const [loadingTypologies, setLoadingTypologies] = useState<boolean>(false);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

    // Data lists
    const [typologies, setTypologies] = useState<DropdownItem[]>([]);
    const [categories, setCategories] = useState<DropdownItem[]>([]);

    // Load typologies on component mount
    useEffect(() => {
        const fetchTypologies = async () => {
            setLoadingTypologies(true);
            try {
                const response = await TypologyService.getTypologies(true);
                const formattedTypologies = response.map(typology => ({
                    name: typology.name,
                    code: typology.uuid,
                    description: typology.description,
                }));
                setTypologies(formattedTypologies);
            } catch (error) {
                console.error('Error loading typologies:', error);
                setTypologies([]);
            } finally {
                setLoadingTypologies(false);
            }
        };

        fetchTypologies();
    }, []);

    // 🔧 NUEVA LÓGICA: Reset cuando cambia la data (nuevo registro vs edición)
    useEffect(() => {

        if (!data?.uuid) {
            // Es un nuevo registro, resetear todo
            setSelectedCountry(null);
            setSelectedProvince(null);
            setSelectedMunicipality(null);
            setHasInitialized(false);
        } else if (!hasInitialized) {
            // Es edición y no se ha inicializado
            setHasInitialized(false);
        }
    }, [data?.uuid]);

    // 🔧 NUEVA LÓGICA: Inicialización paso a paso con async/await
    useEffect(() => {
        const initializeAddressFields = async () => {
            if (isInitializing || hasInitialized || !data?.uuid || !data?.country || countries.length === 0) {
                return;
            }

            setIsInitializing(true);
            try {
                // 1. Inicializar país
                const foundCountry = countries.find(c => c.name === data.country);
                if (!foundCountry) {
                    setIsInitializing(false);
                    return;
                }

                console.log('✅ País encontrado:', foundCountry);
                setSelectedCountry(foundCountry);

                // 2. Cargar provincias y esperar
                await handleCountryChange(foundCountry);
                console.log('✅ Provincias cargadas para país:', foundCountry.name);

                setHasInitialized(true);
            } catch (error) {
                console.error('❌ Error inicializando campos de dirección:', error);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAddressFields();
    }, [data?.uuid, data?.country, countries, isInitializing, hasInitialized]);

    // 🔧 NUEVA LÓGICA: Inicializar provincia cuando se cargan las provincias
    useEffect(() => {
        const initializeProvince = async () => {
            if (!hasInitialized || !data?.province || provinces.length === 0 || selectedProvince) {
                return;
            }

            console.log('🔍 Buscando provincia:', data.province, 'en:', provinces.map(p => p.name));

            const foundProvince = provinces.find(p => p.name === data.province);
            if (!foundProvince) {
                console.log('❌ Provincia no encontrada:', data.province);
                return;
            }

            console.log('✅ Provincia encontrada:', foundProvince);
            setSelectedProvince(foundProvince);

            // Cargar municipios
            try {
                await handleProvinceChange(foundProvince);
                console.log('✅ Municipios cargados para provincia:', foundProvince.name);
            } catch (error) {
                console.error('❌ Error cargando municipios:', error);
            }
        };

        initializeProvince();
    }, [provinces, data?.province, hasInitialized, selectedProvince]);

    // 🔧 NUEVA LÓGICA: Inicializar municipio cuando se cargan los municipios
    useEffect(() => {
        if (!hasInitialized || !data?.municipality || municipalities.length === 0 || selectedMunicipality) {
            return;
        }

        console.log('🔍 Buscando municipio:', data.municipality, 'en:', municipalities.map(m => m.name));

        const foundMunicipality = municipalities.find(m => m.name === data.municipality);
        if (!foundMunicipality) {
            console.log('❌ Municipio no encontrado:', data.municipality);
            return;
        }

        console.log('✅ Municipio encontrado:', foundMunicipality);
        setSelectedMunicipality(foundMunicipality);
    }, [municipalities, data?.municipality, hasInitialized, selectedMunicipality]);

    // Initialize selected values from data for classification
    useEffect(() => {
        // Institution type
        if (data.institutionType) {
            const foundType = institutionTypes.find(type => type.code === data.institutionType);
            if (foundType) {
                setSelectedInstitutionType(foundType);
            }
        }

        // Classification
        if (data.classification) {
            const foundClassification = classifications.find(c => c.name === data.classification);
            if (foundClassification) {
                setSelectedClassification(foundClassification);
            }
        }

        // Typology (depends on typologies being loaded)
        if (data.typology && typologies.length > 0) {
            const foundTypology = typologies.find(t => t.name === data.typology);
            if (foundTypology) {
                setSelectedTypology(foundTypology);
            }
        }
    }, [data, institutionTypes, classifications, typologies]);

    // Load categories when institution type changes
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

                    // Set selected category if it exists in the data
                    if (data.category) {
                        const foundCategory = formattedCategories.find(c => c.name === data.category);
                        if (foundCategory) {
                            setSelectedCategory(foundCategory);
                        }
                    }
                } catch (error) {
                    console.error('Error loading categories:', error);
                    setCategories([]);
                } finally {
                    setLoadingCategories(false);
                }
            }
        };

        loadCategories();
    }, [selectedInstitutionType, data.category]);

    // Handle institution type change
    const handleInstitutionTypeChange = async (e: DropdownChangeEvent) => {
        const selectedType = e.value;
        setSelectedInstitutionType(selectedType);

        // Update form data
        onInputChange(
            { target: { value: selectedType.code } } as any,
            'institutionType'
        );

        // Reset dependent fields
        setSelectedCategory(null);
        onInputChange({ target: { value: '' } } as any, 'category');
    };

    // Handle category change
    const handleCategoryChange = (e: DropdownChangeEvent) => {
        const category = e.value;
        setSelectedCategory(category);
        onInputChange({ target: { value: category.name } } as any, 'category');
    };

    // Handle typology change
    const handleTypologyChange = (e: DropdownChangeEvent) => {
        const typology = e.value;
        setSelectedTypology(typology);
        onInputChange({ target: { value: typology.name } } as any, 'typology');
    };

    // Handle classification change
    const handleClassificationChange = (e: DropdownChangeEvent) => {
        const classification = e.value;
        setSelectedClassification(classification);
        onInputChange({ target: { value: classification.name } } as any, 'classification');
    };

    // Handle address changes
    const onCountryChange = async (e: DropdownChangeEvent) => {
        const country = e.value;
        setSelectedCountry(country);
        setSelectedProvince(null);
        setSelectedMunicipality(null);
        setHasInitialized(false); // 🔧 Reset initialization flag

        onInputChange({ target: { value: country.name } } as any, 'country');
        onInputChange({ target: { value: '' } } as any, 'province');
        onInputChange({ target: { value: '' } } as any, 'municipality');

        await handleCountryChange(country);
    };

    const onProvinceChange = async (e: DropdownChangeEvent) => {
        const province = e.value;
        setSelectedProvince(province);
        setSelectedMunicipality(null);

        onInputChange({ target: { value: province.name } } as any, 'province');
        onInputChange({ target: { value: '' } } as any, 'municipality');

        await handleProvinceChange(province);
    };

    const onMunicipalityChange = (e: DropdownChangeEvent) => {
        const municipality = e.value;
        setSelectedMunicipality(municipality);
        onInputChange({ target: { value: municipality.name } } as any, 'municipality');
    };

    // Computed properties
    const isCategoryDisabled = !selectedInstitutionType || loadingCategories;

    return {
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
    };
};
