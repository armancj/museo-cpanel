import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { UsersDatum } from '@/app/service/UserService';

interface UserModalProps {
    user: UsersDatum;
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserModal = ({ user, visible, onHide, onSave, onChange }: UserModalProps) => {
    return (
        <Dialog header="Detalles del Usuario" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-md-6">
                    <label htmlFor="name">Nombre</label>
                    <InputText id="name" value={user.name} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="lastName">Apellidos</label>
                    <InputText id="lastName" value={user.lastName} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="email">Correo</label>
                    <InputText id="email" value={user.email} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="mobile">Teléfono</label>
                    <InputText id="mobile" value={user.mobile} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="address">Dirección</label>
                    <InputText id="address" value={user.address} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="province">Provincia</label>
                    <InputText id="province" value={user.province} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="municipal">Municipio</label>
                    <InputText id="municipal" value={user.municipal} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="nationality">País</label>
                    <InputText id="nationality" value={user.nationality} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="roles">Rol</label>
                    <InputText id="roles" value={user.roles} onChange={onChange} />
                </div>
                <div className="p-col-12 p-md-6">
                    <label htmlFor="avatar">Avatar</label>
                    <Avatar image={user.avatar?.nameFile} size="large" shape="circle" />
                </div>
            </div>
            <div className="p-d-flex p-jc-end">
                <Button label="Guardar" icon="pi pi-check" onClick={onSave} />
            </div>
        </Dialog>
    );
};
