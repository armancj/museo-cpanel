import React from 'react';
import Link from 'next/link';

export class LogoLanding extends React.Component {
    render() {
        return (
            <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                <Link href="/landing" className="flex align-items-center">
                    <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo Patrimonio" height="60" className="mr-0 lg:mr-2" />
                </Link>
            </div>
        );
    }
}
