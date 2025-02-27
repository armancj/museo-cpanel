import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { UsersDatum } from '@/app/service/UserService';

interface UserAddressProps  {
    submitted: boolean,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    user: UsersDatum
}


const UserAddress = ({ user, onInputChange, submitted }: UserAddressProps) => (
    <div className="p-fluid grid">
        {/* Campo de Dirección */}
        <div className="field col-12">
            <label htmlFor="address">Dirección</label>
            <InputTextarea
                id="address"
                name="address"
                value={user.address}
                onChange={(e) => onInputChange(e, 'address')}
                required
                className={classNames({ 'p-invalid': submitted && !user.address })}
                rows={3}
                cols={30}
                placeholder="Ingresa tu dirección completa"
            />
            {submitted && !user.address && <small className="p-error">La dirección es requerida.</small>}
        </div>
    </div>
);

export default UserAddress;

