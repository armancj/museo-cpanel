import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';

interface UserAddressProps  {
    submitted: boolean,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    user: UsersDatum
}
const UserAddress = ({ user, onInputChange, submitted }: UserAddressProps) => (
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
);

export default UserAddress;
