import { useCallback, useRef } from 'react';
import { QR_CONFIG } from '@/app/common/component/QRCode/types';

export const useQRGeneration = () => {
    const downloadRef = useRef<HTMLDivElement>(null);

    const generateQRBlob = useCallback(async (): Promise<Blob> => {
        if (!downloadRef.current) {
            throw new Error('Referencia QR no encontrada');
        }

        const svgElement = downloadRef.current.querySelector('svg');
        if (!svgElement) {
            throw new Error('SVG no encontrado');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No se pudo obtener el contexto del canvas');
        }

        // Configurar canvas
        canvas.width = QR_CONFIG.size;
        canvas.height = QR_CONFIG.size;

        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, QR_CONFIG.size, QR_CONFIG.size);

        // Convertir SVG a imagen
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        try {
            const img = await loadImage(svgUrl);
            const qrSize = QR_CONFIG.size - (QR_CONFIG.padding * 2);
            ctx.drawImage(img, QR_CONFIG.padding, QR_CONFIG.padding, qrSize, qrSize);

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Error al generar blob'));
                    }
                }, 'image/png', QR_CONFIG.quality);
            });
        } finally {
            URL.revokeObjectURL(svgUrl);
        }
    }, []);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Error al cargar la imagen SVG'));
            img.src = src;
        });
    };

    return { generateQRBlob, downloadRef };
};
