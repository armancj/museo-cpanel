import React from 'react';
import { Button } from 'primereact/button';
import PasswordInput from './PasswordInput';

interface StepThreeRecoverProps {
    newPassword: string;
    setNewPassword: (newPassword: string) => void;
    confirmPassword: string;
    setConfirmPassword: (confirmPassword: string) => void;
    passwordError: boolean;
    confirmPasswordError: boolean;
    handleChangePassword: () => void;
}

const StepThreeRecover: React.FC<StepThreeRecoverProps> = ({
                                         newPassword,
                                         setNewPassword,
                                         confirmPassword,
                                         setConfirmPassword,
                                         passwordError,
                                         confirmPasswordError,
                                         handleChangePassword
                                     }) => (
    <>
        <h5>Cambiar Contraseña</h5>
        <p>Ingrese su nueva contraseña.</p>
            <PasswordInput newPassword={newPassword}
                           setNewPassword={setNewPassword}
                           confirmPassword={confirmPassword}
                           setConfirmPassword={setConfirmPassword}
                           passwordError={passwordError}
                           confirmPasswordError={confirmPasswordError} />
            <Button label="Cambiar Contraseña" className="w-full p-3 text-xl"
                    style={{ borderRadius: '25px', backgroundColor: '#926941', borderColor: '#926941' }}
                    onClick={handleChangePassword}></Button>
        </>
        );

        export default StepThreeRecover;

