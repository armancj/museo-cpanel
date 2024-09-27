import React, { useEffect, useState } from 'react';
import {
    addressResponse,
    CountryService, MunicipalityService,
    ProvinceService,
    UsersDatum
} from '@/app/(main)/pages/user/UserService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';

interface UserFormProps {
    user: UsersDatum;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    onImageUpload: (file: File) => void; // Nueva prop para manejar la carga de imágenes
}

export const UserForm: React.FC<UserFormProps> = ({ user, onInputChange, submitted, onImageUpload }) => {

    const [countries, setCountries] = useState<addressResponse[]>([{
        name: "Cuba",
    }]);
    const [provinces, setProvinces] = useState<addressResponse[]>([{
        name: "Las Tunas"
    }]);
    const [municipalities, setMunicipalities] = useState<addressResponse[]>([]);
    const [isProvinceDisabled, setIsProvinceDisabled] = useState(true);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);

    useEffect(() => {
        CountryService.getCountries().then(data => {
            setCountries(data);
        });
    }, []);

    const handleCountryChange = (e: any) => {
        onInputChange(e, 'nationality');
        ProvinceService.getProvinces(e.target.value).then(provincesData => setProvinces(provincesData));
        setMunicipalities([]);
        setIsProvinceDisabled(false); // Enable province dropdown
        setIsMunicipalityDisabled(true); // Disable municipality dropdown
    };

    const handleProvinceChange = (e: any) => {
        onInputChange(e, 'province');
        MunicipalityService.getMunicipalities(e.target.value).then(municipalitiesData => setMunicipalities(municipalitiesData));
        setIsMunicipalityDisabled(false); // Enable municipality dropdown

    };

    const handleImageUpload = (file: File) => {
        onImageUpload(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
    };

    const dropdownFields = ['province', 'municipal', 'nationality'];

    return (
        <div className="flex">
            <Fieldset legend="Detalles del Usuario" className="p-4 flex-grow-1">
                <div className="grid">
                    {[
                        { field: 'name', label: 'Nombre', required: true },
                        { field: 'lastName', label: 'Apellidos', required: false },
                        { field: 'mobile', label: 'Teléfono', required: true },
                        { field: 'municipal', label: 'Municipio', required: true },
                        { field: 'province', label: 'Provincia', required: true },
                        { field: 'nationality', label: 'País', required: true },
                        { field: 'email', label: 'Correo', required: true },
                        { field: 'roles', label: 'Rol', required: true }
                    ].map(({ field, label, required }) => (
                        <div className="field col-12 md:col-6" key={field}>
                            <label htmlFor={field}>{label}</label>
                            {field === 'nationality' ? (
                                <DropdownField
                                    id={field}
                                    name={field}
                                    value={user[field]}
                                    options={countries}
                                    onChange={handleCountryChange}
                                    optionLabel="name"
                                    placeholder="Seleccionar País"
                                    submitted={submitted}
                                />
                            ) : field === 'province' ? (
                                <DropdownField
                                    id={field}
                                    name={field}
                                    value={user[field]}
                                    options={provinces}
                                    onChange={handleProvinceChange}
                                    optionLabel="name"
                                    placeholder="Seleccionar Provincia"
                                    submitted={submitted}
                                    disabled={isProvinceDisabled}
                                />
                            ) : field === 'municipal' ? (
                                <DropdownField
                                    id={field}
                                    name={field}
                                    value={user[field]}
                                    options={municipalities}
                                    onChange={(e) => onInputChange(e, field)}
                                    optionLabel="name"
                                    placeholder="Seleccionar Municipio"
                                    submitted={submitted}
                                    disabled={isMunicipalityDisabled}
                                />
                            ) : (
                                <InputText
                                    id={field}
                                    name={field}
                                    value={user[field]}
                                    onChange={(e) => onInputChange(e, field)}
                                    required={required}
                                    className={classNames({ 'p-invalid': submitted && !user[field] })}
                                />
                            )}
                            {submitted && !user[field] &&
                                <small className="p-invalid">{`${label} es requerido.`}</small>}
                        </div>
                    ))}
                    <div className="field col-12">
                        <label htmlFor="address">Dirección</label>
                        <InputTextarea
                            id="address"
                            name="address"
                            value={user.address}
                            onChange={(e) => onInputChange(e, 'address')}
                            required
                            className={classNames({ 'p-invalid': submitted && !user.address })}
                        />
                        {submitted && !user.address && <small className="p-invalid">Dirección es requerida.</small>}
                    </div>
                </div>

                <div className="avatar-upload">
                    <label htmlFor="avatar">Avatar</label>
                    <FileUpload
                        id="avatar"
                        name="avatar"
                        mode="advanced"
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={(e) => handleImageUpload(e.files[0])}
                        chooseLabel="Seleccionar Imagen"
                        uploadLabel={'Subir imagen'}
                        cancelLabel={'Cancelar'}
                        multiple={false}
                    >
                    </FileUpload>
                </div>
            </Fieldset>

        </div>
    );
};
