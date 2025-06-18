import { createCleanFilename } from '@/app/common/component/QRCode/util/createCleanFilename';
import { useCallback, useRef, useState } from 'react';
import { useQRGeneration } from '@/app/common/component/QRCode/hook/useQRGeneration';

export const useQRActions = (title: string) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    const { generateQRBlob, downloadRef } = useQRGeneration();

    const downloadQR = useCallback(async () => {
        setIsDownloading(true);
        try {
            const blob = await generateQRBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `qr-${createCleanFilename(title) || 'patrimonio'}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading QR:', error);
            await downloadWithFallback();
        } finally {
            setIsDownloading(false);
        }
    }, [generateQRBlob, title]);

    const downloadWithFallback = useCallback(async () => {
        if (!qrRef.current) return;

        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(qrRef.current, {
                backgroundColor: '#ffffff',
                scale: 4,
                useCORS: true,
                allowTaint: false,
                foreignObjectRendering: true,
                imageTimeout: 15000,
                removeContainer: true
            });

            const url = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');

            link.href = url;
            link.download = `qr-${createCleanFilename(title) || 'patrimonio'}-fallback.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error en método de respaldo:', error);
        }
    }, [title]);

    const shareQR = useCallback(async () => {
        setIsSharing(true);
        try {
            const blob = await generateQRBlob();
            const cleanTitle = createCleanFilename(title);
            const file = new File([blob], `qr-${cleanTitle || 'patrimonio'}.png`, {
                type: 'image/png'
            });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Código QR - ${title}`,
                    text: `📱 Código QR del patrimonio cultural: ${title}`,
                    files: [file]
                });
            } else {
                // Fallback: descargar archivo
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = `qr-${cleanTitle || 'patrimonio'}.png`;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
                alert('El archivo se ha descargado. Ahora puedes compartirlo manualmente desde tu galería/descargas.');
            }
        } catch (error) {
            console.error('Error sharing QR:', error);
            await downloadQR();
            alert('No se pudo compartir directamente. El archivo se ha descargado para que puedas compartirlo manualmente.');
        } finally {
            setIsSharing(false);
        }
    }, [generateQRBlob, title, downloadQR]);

    return {
        downloadQR,
        shareQR,
        isDownloading,
        isSharing,
        qrRef,
        downloadRef
    };
};
