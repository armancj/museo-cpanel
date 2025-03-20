'use client';
import React, { useState, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';
import StepOneRecover from '@/app/(full-page)/auth/recover/components/StepOneRecover';
import StepTwoRecover from '@/app/(full-page)/auth/recover/components/StepTwoRecover';
import StepThreeRecover from '@/app/(full-page)/auth/recover/components/StepThreeRecover';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { handleRecover, handleVerifyCode, handleChangePassword, showToast, resetForm } from './util/recoverHandlers';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const RecoverPage: React.FC = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<boolean>(false);
    const [invalidEmailError, setInvalidEmailError] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [codeError, setCodeError] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const handleBackToLogin = () => {
        router.push('/auth/login');
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center w-full md:w-1/3 h-full">
                <Toast ref={toast} />
                <div className="col-12">
                    <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                            <div className="flex justify-content-center mb-4">
                                <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo" className="mt-4" width="80%" style={{ cursor: 'pointer' }}
                                     onClick={handleBackToLogin} />
                            </div>
                            {step === 1 && (
                                <StepOneRecover
                                    email={email}
                                    setEmail={setEmail}
                                    emailError={emailError}
                                    invalidEmailError={invalidEmailError}
                                    handleRecover={() => handleRecover(email, setEmailError, setInvalidEmailError, setStep, showToast, toast)}
                                />
                            )}
                            {step === 2 && (
                                <StepTwoRecover
                                    code={code}
                                    setCode={setCode}
                                    codeError={codeError}
                                    handleVerifyCode={() => handleVerifyCode(email, code, setCodeError, setStep, showToast, toast)}
                                />
                            )}
                            {step === 3 && (
                                <StepThreeRecover
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    passwordError={passwordError}
                                    confirmPasswordError={confirmPasswordError}
                                    handleChangePassword={() => handleChangePassword(email, code, newPassword, confirmPassword, setPasswordError, setConfirmPasswordError, () => resetForm(setStep, setEmail, setCode, setNewPassword, setConfirmPassword), showToast, toast, router)}
                                />
                            )}
                        </div>
                        </div>

                </div>
                <div className="relative hidden md:flex md:w-2/3 h-full">
                    <img src="/demo/images/login/museo-left.jpg" alt="Recover Image"
                         className="w-full h-full object-cover object-center" style={{ borderRadius: '25px', backgroundColor: '#926941', borderColor: '#926941' }} />
                    <div className="absolute" style={{
                        top: '40%',
                        right: '58%',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>
                        Panel de administración
                        <div style={{ fontSize: '1.0rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Salvando la historia "Patrimonio Las Tunas"
                        </div>
                    </div>
                </div>
            </div>
            );
            };

            export default RecoverPage;
