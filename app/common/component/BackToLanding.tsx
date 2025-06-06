import React from 'react';
import Link from 'next/link';

export class BackToLanding extends React.Component {
    render() {
        return (
            <div className="flex justify-content-center mt-6">
                <Link href="/landing#about" className="p-button font-bold px-5 py-3 p-button-rounded p-button-lg" style={{ backgroundColor: '#926941', color: 'white', textDecoration: 'none' }}>
                    Volver a Inicio
                </Link>
            </div>
        );
    }
}
