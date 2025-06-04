import { get } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

// Interfaces for dashboard statistics
export interface DashboardStats {
    totalObjects: number;
    recentEntries: number;
    objectsByHeritageType: Record<string, number>;
    objectsByGenericClassification: Record<string, number>;
    objectsByConservationStatus: Record<string, number>;
    objectsByConservationStatusWithColors: { state: string; count: number; color: string }[];
    entriesByMonth: Record<string, number>;
    latestEntries: CulturalPropertyModel[];
}

export interface HeritageTypeCount {
    name: string;
    count: number;
}

export interface MonthlyEntryData {
    month: string;
    count: number;
}

function generateRandomColor(existingColors: Set<string>): string {
    let color: string;
    do {
        color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    } while (existingColors.has(color)); // Aseguramos que sea un color único
    existingColors.add(color);
    return color;
}


export const DashboardService = {
    // Get all statistics for the dashboard
    getDashboardStats: async (): Promise<DashboardStats> => {
        const culturalProperties = await get<CulturalPropertyModel[]>(WebEnvConst.culturalProperty.getAll);

        // Calculate total objects
        const totalObjects = culturalProperties.length;

        // Calculate recent entries (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEntries = culturalProperties.filter(item => {
            const entryDate = new Date(item.createdAt);
            return entryDate >= thirtyDaysAgo;
        }).length;

        // Group objects by heritage type
        const objectsByHeritageType = culturalProperties.reduce((acc, item) => {
            const heritageType = item.entryAndLocation?.heritageType?.value || 'No especificado';
            acc[heritageType] = (acc[heritageType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Group objects by generic classification
        const objectsByGenericClassification = culturalProperties.reduce((acc, item) => {
            const classification = item.entryAndLocation?.genericClassification?.value || 'No especificado';
            acc[classification] = (acc[classification] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Group objects by conservation status
        const objectsByConservationStatus = culturalProperties.reduce((acc, item) => {
            const conservationStates = item.culturalRecord?.conservationState?.value || [];
            const uniqueCategories = new Set<string>();

            conservationStates.forEach(state => {
                if (state.includes('Bueno')) {
                    uniqueCategories.add('Bueno');
                } else if (state.includes('Regular')) {
                    uniqueCategories.add('Regular');
                } else if (state.includes('Malo')) {
                    uniqueCategories.add('Malo');
                } else {
                    // Agregar el estado tal como viene de la BD
                    uniqueCategories.add(state.trim());
                }
            });

            uniqueCategories.forEach(category => {
                acc[category] = (acc[category] || 0) + 1;
            });

            return acc;
        }, {} as Record<string, number>);


        const objectsByConservationStatusWithColors = Object.entries(objectsByConservationStatus).map(
            ([state, count]) => {
                let color = '#6c757d';
                const uniqueColors = new Set<string>();

                if (state.includes('Bueno')) {
                    color = '#28a745'; // Verde
                } else if (state.includes('Regular')) {
                    color = '#ffc107'; // Amarillo
                } else if (state.includes('Malo')) {
                    color = '#dc3545';
                } else {
                    color = generateRandomColor(uniqueColors);
                }
                return { state, count, color };
            }
        );

        // Group entries by month
        const entriesByMonth = culturalProperties.reduce((acc, item) => {
            if (item.createdAt) {
                const date = new Date(item.createdAt);
                const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                acc[monthYear] = (acc[monthYear] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // Get latest entries (sorted by entry date)
        const latestEntries = [...culturalProperties]
            .filter(item => item?.culturalRecord)
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5);

        console.log(latestEntries)

        return {
            totalObjects,
            recentEntries,
            objectsByHeritageType,
            objectsByGenericClassification,
            objectsByConservationStatus,
            objectsByConservationStatusWithColors,
            entriesByMonth,
            latestEntries
        };
    },

    // Get heritage type distribution for charts
    getHeritageTypeDistribution: async (): Promise<HeritageTypeCount[]> => {
        const stats = await DashboardService.getDashboardStats();
        return Object.entries(stats.objectsByHeritageType).map(([name, count]) => ({
            name,
            count
        }));
    },

    // Get monthly entry data for charts
    getMonthlyEntryData: async (): Promise<MonthlyEntryData[]> => {
        const stats = await DashboardService.getDashboardStats();

        // Convert to array and sort by date
        return Object.entries(stats.entriesByMonth)
            .map(([month, count]) => ({
                month,
                count
            }))
            .sort((a, b) => {
                const [monthA, yearA] = a.month.split('/').map(Number);
                const [monthB, yearB] = b.month.split('/').map(Number);

                if (yearA !== yearB) {
                    return yearA - yearB;
                }
                return monthA - monthB;
            });
    },

    // Get latest entries for the dashboard
    getLatestEntries: async (): Promise<CulturalPropertyModel[]> => {
        const stats = await DashboardService.getDashboardStats();
        return stats.latestEntries;
    }
};
