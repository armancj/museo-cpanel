import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import { InstitutionService } from '@/app/service/InstitutionService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { CountryService } from '@/app/service/CountryService';

interface UserDetailsFormProps {
    user: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    submitted: boolean;
    editingUser?: any | null;
}

interface AddressOption {
    uuid: string;
    name: string;
    municipality?: string;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
                                                             user,
                                                             onInputChange,
                                                             submitted,
                                                             editingUser
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

    // ===== DEBUG: MOSTRAR ESTADO ACTUAL =====
    console.log('🔍 ESTADO ACTUAL:', {
        userMobile: user.mobile,
        userPhone: user.phone,
        userInstitutionId: user.institutionId,
        userInstitution: user.institution,
        submitted,
        institutionsLength: institutions.length
    });

    // ===== CARGAR PAÍSES AL INICIO =====
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await CountryService.getCountries();
                setCountries(countriesData);
                console.log('✅ Países cargados:', countriesData.length);
            } catch (error) {
                console.error('❌ Error loading countries:', error);
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
            resetDependentStates();
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

    // ===== RESET STATES =====
    const resetDependentStates = () => {
        setProvinces([]);
        setMunicipalities([]);
        setInstitutions([]);
        setIsProvinceDisabled(true);
        setIsMunicipalityDisabled(true);
        setIsInstitutionDisabled(true);
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

            // Reset valores dependientes en el usuario
            onInputChange({ target: { value: '' } } as any, 'province');
            onInputChange({ target: { value: '' } } as any, 'municipal');
            onInputChange({ target: { value: '' } } as any, 'institutionId');

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

            // Reset valores dependientes en el usuario
            onInputChange({ target: { value: '' } } as any, 'municipal');
            onInputChange({ target: { value: '' } } as any, 'institutionId');

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

            // Reset valor dependiente en el usuario
            onInputChange({ target: { value: '' } } as any, 'institutionId');

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

    // ===== VALIDACIONES MEJORADAS =====
    const validateEmail = (email: string) => {
        if (!email) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateMobile = (mobile: string): boolean => {
        if (!mobile) return false;
        // Remover espacios y caracteres especiales para validar
        const cleanMobile = mobile.replace(/[\s\(\)\+\-]/g, '');
        return cleanMobile.length >= 8; // Al menos 8 dígitos
    };

    // ===== RENDER =====
    return (
        <div className="grid">
            {/* Nombre */}
            <div className="col-12 md:col-5">
                <label htmlFor="name">Nombre*</label>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi pi-user"></i>
                    </span>
                    <InputText
                        id="name"
                        value={user.name || ''}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        className={classNames({ 'p-invalid': submitted && !user.name })}
                    />
                </div>
                {submitted && !user.name && <small className="p-error">Nombre es requerido.</small>}
            </div>

            {/* Apellidos */}
            <div className="col-12 md:col-7">
                <label htmlFor="lastName">Apellidos</label>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card"></i>
                    </span>
                    <InputText
                        id="lastName"
                        value={user.lastName || user.surname || ''}
                        onChange={(e) => onInputChange(e, 'lastName')}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="col-12 md:col-7 mt-2">
                <label htmlFor="email">Correo*</label>
                <div className="p-inputgroup">
                     <span className="p-inputgroup-addon">
                        <i className="pi pi-envelope"></i>
                     </span>
                    <InputText
                        id="email"
                        value={user.email || ''}
                        onChange={(e) => onInputChange(e, 'email')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateEmail(user.email || '') })}
                    />
                </div>
                {submitted && !validateEmail(user.email || '') && (
                    <small className="p-error">Correo no válido.</small>
                )}
            </div>

            {/* Teléfono - MEJORADO */}
            <div className="col-12 md:col-5 mt-2">
                <label htmlFor="mobile">Teléfono*</label>
                <div className="p-inputgroup">
                     <span className="p-inputgroup-addon">
                        <i className="pi pi-phone"></i>
                     </span>
                    <InputMask
                        id="mobile"
                        value={user.mobile || user.phone || ''}
                        onChange={(e) => {
                            console.log('📱 Teléfono cambiado:', e.target.value);
                            onInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>, 'mobile');
                        }}
                        mask="(+53) 99-99-99-99"
                        placeholder="(+53) 99-99-99-99"
                        required
                        className={classNames({ 'p-invalid': submitted && !validateMobile(user.mobile || user.phone || '') })}
                    />
                </div>
                {submitted && !validateMobile(user.mobile || user.phone || '') && (
                    <small className="p-error">Teléfono no válido.</small>
                )}
            </div>

            {/* Rol */}
            <div className="field col-12 md:col-3 mt-2">
                <label htmlFor="roles">Rol*</label>
                <Dropdown
                    id="roles"
                    value={user.roles}
                    options={[
                        { label: 'Super Administrador', value: 'Super Administrador' },
                        { label: 'Administrador', value: 'Administrador' },
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
            <div className="field col-12 md:col-3 mt-2">
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
            <div className="field col-12 md:col-4 mt-2">
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
            <div className="field col-12 md:col-4">
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

            {/* Institución */}
            {(user.roles === 'Especialista' || user.roles === 'Técnico') && (
                <div className="field col-12 md:col-4">
                    <label htmlFor="institutionId">Institución*</label>
                    <Dropdown
                        id="institutionId"
                        value={(() => {
                            const institutionId = user.institutionId || user.institution?.uuid;
                            const found = institutions.find(inst => inst.uuid === institutionId);
                            console.log('🔍 Buscando institución:', { institutionId, found, institutionsCount: institutions.length });
                            return found || null;
                        })()}
                        options={institutions}
                        optionLabel="name"
                        onChange={(e) => handleInstitutionChange(e.value)}
                        placeholder="Seleccionar Institución"
                        disabled={isInstitutionDisabled}
                        className={classNames({
                            'p-invalid': submitted && !user.institutionId
                        })}
                        filter
                    />
                    {submitted && !user.institutionId && (
                        <small className="p-error">Institución es requerida.</small>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDetailsForm;
