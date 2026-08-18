import { Suspense } from 'react';
import PublicCulturalHeritagePropertyPag
    from './PublicCulturalHeritagePropertyPag';

export async function generateStaticParams(): Promise<Array<{ uuid: string }>> {
    return [];
}

export const revalidate = 60;

export const dynamicParams = true;

export default function Page({ params }: any) {

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PublicCulturalHeritagePropertyPag uuid={params.uuid} />
        </Suspense>
    );
}
