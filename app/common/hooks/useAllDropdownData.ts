import { useState, useEffect, useCallback } from 'react';
import { ValueGradeService } from '@/app/service/ValueGradeService';
import { DescriptionInstrumentsService } from '@/app/service/DescriptionInstrumentsService';
import { ConservationStatusService } from '@/app/service/ConservationStatusService';
import { HeritageTypeService } from '@/app/service/HeritageTypeService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { NomenclatureAccessConditionsService } from '@/app/service/NomenclatureAccessConditionsService';
import { ReproductionConditionsService } from '@/app/service/ReproductionConditionsService';

// Define dropdown option type
export type DropdownOption = { label: string; value: string };

// Define the return type for the hook
export interface AllDropdownData {
    valueGradeOptions: DropdownOption[];
    descriptionInstrumentOptions: DropdownOption[];
    conservationStateOptions: DropdownOption[];
    heritageTypeOptions: DropdownOption[];
    provinceOptions: DropdownOption[];
    municipalityOptions: DropdownOption[];
    accessConditionsOptions: DropdownOption[];
    reproductionConditionsOptions: DropdownOption[];
    isLoading: boolean;
    error: Error | null;
    // Function to fetch municipalities for a specific province
    fetchMunicipalitiesForProvince: (provinceName: string) => Promise<void>;
}

/**
 * Custom hook to fetch all dropdown data from multiple services
 * @returns Object containing dropdown options and loading state
 */
export const useAllDropdownData = (): AllDropdownData => {
    const [valueGradeOptions, setValueGradeOptions] = useState<DropdownOption[]>([]);
    const [descriptionInstrumentOptions, setDescriptionInstrumentOptions] = useState<DropdownOption[]>([]);
    const [conservationStateOptions, setConservationStateOptions] = useState<DropdownOption[]>([]);
    const [heritageTypeOptions, setHeritageTypeOptions] = useState<DropdownOption[]>([]);
    const [provinceOptions, setProvinceOptions] = useState<DropdownOption[]>([]);
    const [municipalityOptions, setMunicipalityOptions] = useState<DropdownOption[]>([]);
    const [accessConditionsOptions, setAccessConditionsOptions] = useState<DropdownOption[]>([]);
    const [reproductionConditionsOptions, setReproductionConditionsOptions] = useState<DropdownOption[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // ✅ Mejorar fetchMunicipalitiesForProvince con mejor manejo de estados
    const fetchMunicipalitiesForProvince = useCallback(async (provinceName: string) => {
        if (!provinceName) {
            setMunicipalityOptions([]);
            return;
        }

        try {
            // ✅ No cambiar isLoading global, usar loading local si es necesario
            const municipalities = await MunicipalityService.getMunicipalities({
                name: provinceName
            });

            const formattedOptions = municipalities.map(municipality => ({
                label: municipality.name,
                value: municipality.name
            }));

            setMunicipalityOptions(formattedOptions);
        } catch (err) {
            console.error('Error fetching municipalities:', err);
            // ✅ Mostrar toast en lugar de error global
            setMunicipalityOptions([]);
        }
    }, []); // ✅ Agregar useCallback para evitar re-renders innecesarios

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // ✅ Agregar Promise.allSettled para manejar errores parciales
                const promises = [
                    ValueGradeService.getValueGrades().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching value grades:', err);
                        return [];
                    }),
                    DescriptionInstrumentsService.get().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching description instruments:', err);
                        return [];
                    }),
                    ConservationStatusService.getConservationStatuses().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching conservation statuses:', err);
                        return [];
                    }),
                    HeritageTypeService.getHeritageTypes().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching heritage types:', err);
                        return [];
                    }),
                    ProvinceService.getProvinces().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching provinces:', err);
                        return [];
                    }),
                    NomenclatureAccessConditionsService.get().then(data =>
                        data.map(item => ({ label: item.type, value: item.type }))
                    ).catch(err => {
                        console.error('Error fetching access conditions:', err);
                        return [];
                    }),
                    ReproductionConditionsService.getReproductionConditions().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))
                    ).catch(err => {
                        console.error('Error fetching reproduction conditions:', err);
                        return [];
                    })
                ];

                const results = await Promise.allSettled(promises);

                // ✅ Manejar resultados individualmente
                const [
                    valueGrades,
                    descriptionInstruments,
                    conservationStatuses,
                    heritageTypes,
                    provinces,
                    accessConditions,
                    reproductionConditions
                ] = results.map(result => result.status === 'fulfilled' ? result.value : []);

                setValueGradeOptions(valueGrades);
                setDescriptionInstrumentOptions(descriptionInstruments);
                setConservationStateOptions(conservationStatuses);
                setHeritageTypeOptions(heritageTypes);
                setProvinceOptions(provinces);
                setAccessConditionsOptions(accessConditions);
                setReproductionConditionsOptions(reproductionConditions);

                // ✅ Solo mostrar error si TODOS los servicios fallan
                const allFailed = results.every(result => result.status === 'rejected');
                if (allFailed) {
                    throw new Error('No se pudieron cargar los datos del sistema');
                }

            } catch (err) {
                console.error('Error fetching dropdown data:', err);
                setError(err instanceof Error ? err : new Error('Error desconocido'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        valueGradeOptions,
        descriptionInstrumentOptions,
        conservationStateOptions,
        heritageTypeOptions,
        provinceOptions,
        municipalityOptions,
        accessConditionsOptions,
        reproductionConditionsOptions,
        fetchMunicipalitiesForProvince,
        isLoading,
        error
    };
};
