'use client';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { useState } from 'react';
import { AppProvider } from '@/app/context/AppContext';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const [ripple, setRipple] = useState(true);
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
                <title>Museo</title>
            </head>
            <body>
                <PrimeReactProvider value={{ ripple, setRipple }}>
                    <AppProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </AppProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
