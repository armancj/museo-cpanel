import { MenuItem } from 'primereact/menuitem';

export function generateWizardMenuItems(completedSteps: boolean[]) {
    const wizardItems: MenuItem[] = [
        {
            label: 'Productor / Autor',
            icon: 'pi pi-user',
            disabled: false,
        },
        {
            label: 'Condiciones de Acceso',
            icon: 'pi pi-lock',
            disabled: !completedSteps[1],
        },
        {
            label: 'Documentación Asociada',
            icon: 'pi pi-file',
            disabled: !completedSteps[2],
        },
        {
            label: 'Registro Cultural',
            icon: 'pi pi-book',
            disabled: !completedSteps[3],
        },
        {
            label: 'Ubicación y Entrada',
            icon: 'pi pi-map-marker',
            disabled: !completedSteps[4],
        },
        {
            label: 'Control de Descripción',
            icon: 'pi pi-cog',
            disabled: !completedSteps[5],
        },
        {
            label: 'Notas',
            icon: 'pi pi-pencil',
            disabled: !completedSteps[6],
        },
    ];
    return wizardItems;
}
