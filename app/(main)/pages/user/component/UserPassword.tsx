import React from 'react';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { UsersDatum } from '@/app/service/UserService';

interface UserPasswordProps {
    submitted: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    user: UsersDatum;
    editingUser?: UsersDatum | null | undefined;
}

const UserPassword = ({ user, onInputChange, submitted, editingUser }: UserPasswordProps) => (
    <div className="field col-12">
        <label htmlFor="password">Password</label>
        <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
            </span>
            <Password
                id="password"
                name="password"
                value={user.password}
                onChange={(e) => onInputChange(e, 'password')}
                required
                className={classNames({ 'p-invalid': submitted && !user.password && !editingUser })}
                toggleMask
                feedback
                promptLabel="Introduce una contraseña"
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
            />
        </div>
        {submitted && !user.password && !editingUser &&  <small className="p-invalid p-error">Contraseña es requerida.</small>}
    </div>
);

export default UserPassword;
