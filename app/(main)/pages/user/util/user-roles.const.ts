import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';

const labelSuperAdmin: SelectItem = { label: 'Super Administrador', value: 'Super Administrador' }
const labelAdmin: SelectItem =  { label: 'Administrador', value: 'Administrador' }
const labelEsp: SelectItem =  { label: 'Especialista', value: 'Especialista' }
const labelTen: SelectItem = { label: 'Técnico', value: 'Técnico' }

export const USER_ROLES: SelectItemOptionsType = [
    labelSuperAdmin,
    labelAdmin,
    labelEsp,
    labelTen
];


export const ROLES_REQUIRING_INSTITUTION = ['Especialista', 'Técnico'];
