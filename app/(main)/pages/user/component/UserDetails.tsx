import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { InstitutionService } from '@/app/service/InstitutionService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { CountryService } from '@/app/service/CountryService';


interface UserDetailsProps {
    visible: boolean;
    onHide: () => void;
    user: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    onSave: () => void;
    editingUser?: any;
    submitted: boolean;
}

interface AddressOption {
    uuid: string;
    name: string;
    municipality?: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({
                                                     visible,
                                                     onHide,
                                                     user,
                                                     onInputChange,
                                                     onSave,
                                                     editingUser,
                                                     submitted
                                                 }) => {
    // ===== ESTADOS =====
    const [countries, setCountries] = useState<AddressOption[]>([]);
    const [provinces, setProvinces] = useState<AddressOption[]>([]);
    const [municipalities, setMunicipalities] = useState<AddressOption[]>([]);
    const [institutions, setInstitutions] = useState<AddressOption[]>([]);

    // Estados para habilitar/deshabilitar dropdowns
    const [isProvinceDisabled, setIsProvinceDisabled] = useState(true);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);
    const [isInstitutionDisabled, setIsInstitutionDisabled] = useState(true);

    // ===== CARGAR PAÍSES AL INICIO =====
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await CountryService.getCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error loading countries:', error);
            }
        };
        loadCountries();
    }, []);

    // ===== INICIALIZAR PARA EDICIÓN =====
    useEffect(() => {
        if (editingUser && countries.length > 0) {
            console.log('🔄 Inicializando para edición:', editingUser.name);
            initializeForEdit();
        } else if (!editingUser) {
            // Reset si no hay usuario editando
            setProvinces([]);
            setMunicipalities([]);
            setInstitutions([]);
            setIsProvinceDisabled(true);
            setIsMunicipalityDisabled(true);
            setIsInstitutionDisabled(true);
        }
    }, [editingUser, countries]);

    // ===== FUNCIÓN PARA INICIALIZAR EDICIÓN =====
    const initializeForEdit = async () => {
        try {
            // 1. Buscar país
            const country = countries.find(c => c.name === editingUser.nationality);
            if (!country) return;

            // 2. Cargar provincias
            const provincesData = await ProvinceService.getProvinces(country);
            setProvinces(provincesData);
            setIsProvinceDisabled(false);

            if (editingUser.province) {
                // 3. Buscar provincia y cargar municipios
                const province = provincesData.find(p => p.name === editingUser.province);
                if (province) {
                    const municipalitiesData = await MunicipalityService.getMunicipalities(province);
                    setMunicipalities(municipalitiesData);
                    setIsMunicipalityDisabled(false);

                    if (editingUser.municipal) {
                        // 4. Buscar municipio y cargar instituciones
                        const municipality = municipalitiesData.find(m => m.name === editingUser.municipal);
                        if (municipality) {
                            const institutionsData = await InstitutionService.getInstitutions(municipality);
                            const filteredInstitutions = institutionsData.filter(
                                institution => institution.municipality === municipality.name
                            );
                            setInstitutions(filteredInstitutions);
                            setIsInstitutionDisabled(false);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing edit data:', error);
        }
    };

    // ===== HANDLERS PARA CAMBIOS EN DROPDOWNS =====
    const handleCountryChange = async (selectedCountry: AddressOption) => {
        console.log('🌍 País seleccionado:', selectedCountry.name);

        // Actualizar el usuario
        onInputChange({ target: { value: selectedCountry.name } } as any, 'nationality');

        try {
            // Cargar provincias
            const provincesData = await ProvinceService.getProvinces(selectedCountry);
            setProvinces(provincesData);

            // Reset estados dependientes
            setMunicipalities([]);
            setInstitutions([]);

            // Habilitar provincia, deshabilitar municipio e institución
            setIsProvinceDisabled(false);
            setIsMunicipalityDisabled(true);
            setIsInstitutionDisabled(true);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const handleProvinceChange = async (selectedProvince: AddressOption) => {
        console.log('🏘️ Provincia seleccionada:', selectedProvince.name);

        // Actualizar el usuario
        onInputChange({ target: { value: selectedProvince.name } } as any, 'province');

        try {
            // Cargar municipios
            const municipalitiesData = await MunicipalityService.getMunicipalities(selectedProvince);
            setMunicipalities(municipalitiesData);

            // Reset estados dependientes
            setInstitutions([]);

            // Habilitar municipio, deshabilitar institución
            setIsMunicipalityDisabled(false);
            setIsInstitutionDisabled(true);
        } catch (error) {
            console.error('Error fetching municipalities:', error);
        }
    };

    const handleMunicipalityChange = async (selectedMunicipality: AddressOption) => {
        console.log('🏘️ Municipio seleccionado:', selectedMunicipality.name);

        // Actualizar el usuario
        onInputChange({ target: { value: selectedMunicipality.name } } as any, 'municipal');

        try {
            // Cargar instituciones
            const institutionsData = await InstitutionService.getInstitutions(selectedMunicipality);
            const filteredInstitutions = institutionsData.filter(
                institution => institution.municipality === selectedMunicipality.name
            );
            setInstitutions(filteredInstitutions);

            // Habilitar institución
            setIsInstitutionDisabled(false);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        }
    };

    const handleInstitutionChange = (selectedInstitution: AddressOption) => {
        console.log('🏛️ Institución seleccionada:', selectedInstitution.name, 'UUID:', selectedInstitution.uuid);

        // Actualizar el institutionId (UUID)
        onInputChange({ target: { value: selectedInstitution.uuid } } as any, 'institutionId');
    };

    // ===== FUNCIÓN PARA ENCONTRAR OPCIÓN POR VALOR =====
    const findOptionByValue = (options: AddressOption[], value: string, field: string = 'name') => {
        if (!value || !options?.length) return null;
        return options.find(option => option[field as keyof AddressOption] === value) || null;
    };

    // ===== RENDER =====
    return (
        <Dialog
            visible={visible}
            style={{ width: '90vw', maxWidth: '900px' }}
            header="Detalles del Usuario"
            modal
            className="p-fluid"
            onHide={onHide}
            footer={
                <div>
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        outlined
                        onClick={onHide}
                    />
                    <Button
                        label="Guardar"
                        icon="pi pi-check"
                        onClick={onSave}
                    />
                </div>
            }
        >
            <div className="formgrid grid">
                {/* Nombre */}
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre*</label>
                    <InputText
                        id="name"
                        value={user.name || ''}
                        onChange={(e) => onInputChange(e, 'name')}
                        className={classNames({ 'p-invalid': submitted && !user.name })}
                    />
                    {submitted && !user.name && (
                        <small className="p-error">Nombre es requerido.</small>
                    )}
                </div>

                {/* Apellidos */}
                <div className="field col-12 md:col-6">
                    <label htmlFor="surname">Apellidos*</label>
                    <InputText
                        id="surname"
                        value={user.surname || ''}
                        onChange={(e) => onInputChange(e, 'surname')}
                        className={classNames({ 'p-invalid': submitted && !user.surname })}
                    />
                    {submitted && !user.surname && (
                        <small className="p-error">Apellidos son requeridos.</small>
                    )}
                </div>

                {/* Email */}
                <div className="field col-12 md:col-6">
                    <label htmlFor="email">Email*</label>
                    <InputText
                        id="email"
                        value={user.email || ''}
                        onChange={(e) => onInputChange(e, 'email')}
                        className={classNames({ 'p-invalid': submitted && !user.email })}
                    />
                    {submitted && !user.email && (
                        <small className="p-error">Email es requerido.</small>
                    )}
                </div>

                {/* Teléfono */}
                <div className="field col-12 md:col-6">
                    <label htmlFor="phone">Teléfono*</label>
                    <InputText
                        id="phone"
                        value={user.phone || ''}
                        onChange={(e) => onInputChange(e, 'phone')}
                        className={classNames({ 'p-invalid': submitted && !user.phone })}
                    />
                    {submitted && !user.phone && (
                        <small className="p-error">Teléfono es requerido.</small>
                    )}
                </div>

                {/* Rol */}
                <div className="field col-12 md:col-4">
                    <label htmlFor="roles">Rol*</label>
                    <Dropdown
                        id="roles"
                        value={user.roles}
                        options={[
                            { label: 'Director', value: 'Director' },
                            { label: 'Especialista', value: 'Especialista' },
                            { label: 'Técnico', value: 'Técnico' }
                        ]}
                        onChange={(e) => onInputChange({ target: { value: e.value } } as any, 'roles')}
                        placeholder="Seleccionar Rol"
                        className={classNames({ 'p-invalid': submitted && !user.roles })}
                    />
                    {submitted && !user.roles && (
                        <small className="p-error">Rol es requerido.</small>
                    )}
                </div>

                {/* País */}
                <div className="field col-12 md:col-3">
                    <label htmlFor="nationality">País*</label>
                    <Dropdown
                        id="nationality"
                        value={findOptionByValue(countries, user.nationality)}
                        options={countries}
                        optionLabel="name"
                        onChange={(e) => handleCountryChange(e.value)}
                        placeholder="Seleccionar País"
                        className={classNames({ 'p-invalid': submitted && !user.nationality })}
                        filter
                    />
                    {submitted && !user.nationality && (
                        <small className="p-error">País es requerido.</small>
                    )}
                </div>

                {/* Provincia */}
                <div className="field col-12 md:col-3">
                    <label htmlFor="province">Provincia*</label>
                    <Dropdown
                        id="province"
                        value={findOptionByValue(provinces, user.province)}
                        options={provinces}
                        optionLabel="name"
                        onChange={(e) => handleProvinceChange(e.value)}
                        placeholder="Seleccionar Provincia"
                        disabled={isProvinceDisabled}
                        className={classNames({ 'p-invalid': submitted && !user.province })}
                        filter
                    />
                    {submitted && !user.province && (
                        <small className="p-error">Provincia es requerida.</small>
                    )}
                </div>

                {/* Municipio */}
                <div className="field col-12 md:col-2">
                    <label htmlFor="municipal">Municipio*</label>
                    <Dropdown
                        id="municipal"
                        value={findOptionByValue(municipalities, user.municipal)}
                        options={municipalities}
                        optionLabel="name"
                        onChange={(e) => handleMunicipalityChange(e.value)}
                        placeholder="Seleccionar Municipio"
                        disabled={isMunicipalityDisabled}
                        className={classNames({ 'p-invalid': submitted && !user.municipal })}
                        filter
                    />
                    {submitted && !user.municipal && (
                        <small className="p-error">Municipio es requerido.</small>
                    )}
                </div>

                {/* Institución - Solo para Especialista y Técnico */}
                {(user.roles === 'Especialista' || user.roles === 'Técnico') && (
                    <div className="field col-12 md:col-4">
                        <label htmlFor="institutionId">Institución*</label>
                        <Dropdown
                            id="institutionId"
                            value={(() => {
                                // Para edición: buscar por UUID
                                const institutionId = user.institution?.uuid || user.institutionId;
                                return institutions.find(inst => inst.uuid === institutionId) || null;
                            })()}
                            options={institutions}
                            optionLabel="name"
                            onChange={(e) => handleInstitutionChange(e.value)}
                            placeholder="Seleccionar Institución"
                            disabled={isInstitutionDisabled}
                            className={classNames({
                                'p-invalid': submitted && !user.institutionId && !user.institution?.uuid
                            })}
                            filter
                        />
                        {submitted && !user.institutionId && !user.institution?.uuid && (
                            <small className="p-error">Institución es requerida.</small>
                        )}
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default UserDetails;
