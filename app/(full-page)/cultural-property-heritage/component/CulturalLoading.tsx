import { creamBg, lightBg, primaryColor } from '@/app/(full-page)/cultural-property-heritage/util/culture-function';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

export function CulturalLoading(props: { callbackfn: (i: any) => React.JSX.Element }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${lightBg} 0%, #F5F5DC 50%, ${creamBg} 100%)`,
                padding: '2rem 1rem',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: `0 10px 40px ${primaryColor}20`,
                    overflow: 'hidden',
                    border: `1px solid ${primaryColor}15`
                }}
            >
                <div
                    style={{
                        padding: '3rem',
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                        color: 'white'
                    }}
                >
                    <Skeleton width="300px" height="2rem" className="mb-2" />
                    <Skeleton width="100%" height="3rem" className="mb-3" />
                    <Skeleton width="70%" height="1.5rem" className="mb-4" />
                </div>
                <div style={{ padding: '2rem' }}>{[1, 2, 3].map(props.callbackfn)}</div>
            </div>
        </div>
    );
}
