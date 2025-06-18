import { creamBg, lightBg, primaryColor } from '@/app/(full-page)/cultural-property-heritage/util/culture-function';
import { Button } from 'primereact/button';

export function CulturalError(props: { error: string | null; onClick: () => string }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${lightBg} 0%, ${creamBg} 100%)`,
                padding: '2rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: `0 10px 40px ${primaryColor}20`,
                    maxWidth: '400px'
                }}
            >
                <div
                    style={{
                        fontSize: '3rem',
                        color: primaryColor,
                        marginBottom: '1rem'
                    }}
                >
                    <i className="pi pi-exclamation-triangle"></i>
                </div>
                <h2 style={{ color: primaryColor, marginBottom: '1rem' }}>Documento no encontrado</h2>
                <p
                    style={{
                        color: '#666',
                        marginBottom: '2rem'
                    }}
                >
                    {props.error || 'El bien patrimonial solicitado no existe o no está disponible'}
                </p>
                <Button
                    label="Volver al inicio"
                    icon="pi pi-home"
                    onClick={props.onClick}
                    style={{
                        backgroundColor: primaryColor,
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        padding: '0.75rem 1.5rem',
                        borderRadius: '25px'
                    }}
                />
            </div>
        </div>
    );
}
