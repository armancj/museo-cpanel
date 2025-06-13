import { useState, useEffect } from 'react';
import { ValueGradeService } from '@/app/service/ValueGradeService';
import { DescriptionInstrumentsService } from '@/app/service/DescriptionInstrumentsService';
import { ConservationStatusService } from '@/app/service/ConservationStatusService';
import { HeritageTypeService } from '@/app/service/HeritageTypeService';

// Define dropdown option type
export type DropdownOption = { label: string; value: string };

// Define the return type for the hook
export interface AllDropdownData {
    valueGradeOptions: DropdownOption[];
    descriptionInstrumentOptions: DropdownOption[];
    conservationStateOptions: DropdownOption[];
    heritageTypeOptions: DropdownOption[];
    isLoading: boolean;
    error: Error | null;
}

/**
 * Custom hook to fetch all dropdown data from multiple services
 * @returns Object containing dropdown options and loading state
 */
export const useAllDropdownData = (): AllDropdownData => {
    // State for dropdown options
    const [valueGradeOptions, setValueGradeOptions] = useState<DropdownOption[]>([]);
    const [descriptionInstrumentOptions, setDescriptionInstrumentOptions] = useState<DropdownOption[]>([]);
    const [conservationStateOptions, setConservationStateOptions] = useState<DropdownOption[]>([]);
    const [heritageTypeOptions, setHeritageTypeOptions] = useState<DropdownOption[]>([]);

    // Loading and error states
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Create an array of promises for all services
                const promises = [
                    ValueGradeService.getValueGrades().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))),
                    DescriptionInstrumentsService.get().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))),
                    ConservationStatusService.getConservationStatuses().then(data =>
                        data.map(item => ({ label: item.name, value: item.name }))),
                    HeritageTypeService.getHeritageTypes().then(data =>
                        data.map(item => ({ label: item.name, value: item.name })))
                ];

                // Execute all promises in parallel
                const [valueGrades, descriptionInstruments, conservationStatuses, heritageTypes] =
                    await Promise.all(promises);

                // Update state with results
                setValueGradeOptions(valueGrades);
                setDescriptionInstrumentOptions(descriptionInstruments);
                setConservationStateOptions(conservationStatuses);
                setHeritageTypeOptions(heritageTypes);

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching dropdown data:', err);
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
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
        isLoading,
        error
    };
};
