'use client';
import React, { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { LoginHeader } from '@/app/(full-page)/auth/login/LoginHeader';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/(full-page)/auth/login/LoginForm';

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const router = useRouter();
    const handleRecoverClick = () => {
        router.push('/auth/recover');
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center w-full md:w-1/3 h-full">
                <div className="col-12">
                    <div className="card">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <img
                                src="/demo/images/login/logoPatrimonio.jpg"
                                alt="Logo"
                                className="mt-4"
                                width="60%"
                                style={{ marginBottom: '20px' }}
                            />
                        </div>
                        <div
                            className="flex flex-column align-items-center justify-content-center w-full md:w-1/3 h-full">
                            <LoginHeader />
                            <LoginForm />
                            <div>
                                Ha olvidado su contraseña?
                                <a className="font-medium no-underline ml-2 text-center cursor-pointer"
                                   style={{ color: '#926941' }} onClick={handleRecoverClick}>
                                    Recuperar.
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden md:flex md:w-2/3 h-full">
                <img src="/demo/images/login/museo-left.jpg" alt="Login Image"
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
                        Salvando la historia "Patrimonio Las Tunas"
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
