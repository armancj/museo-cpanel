import React from 'react';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { UsersDatum } from '@/app/service/UserService';

interface UserPasswordProps  {
    submitted: boolean,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    user: UsersDatum
}
const UserPassword = ({ user, onInputChange, submitted }: UserPasswordProps) => (
    <div className="field col-3">
        <label htmlFor="password">Password</label>
        <Password
            id="password"
            name="password"
            value={user.password}
            onChange={(e) => onInputChange(e, 'password')}
            required
            className={classNames({ 'p-invalid': submitted && !user.password })}
            toggleMask
        />
        {submitted && !user.password && <small className="p-invalid">Contraseña es requerida.</small>}
    </div>
);

export default UserPassword;
