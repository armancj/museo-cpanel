'use client';
import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tooltip } from 'primereact/tooltip';
import QRCode from 'react-qr-code';

interface QRCodeDialogProps {
    visible: boolean;
    onHide: () => void;
    uuid: string;
    title: string;
}

export const QRCodeDialog = ({ visible, onHide, uuid, title }: QRCodeDialogProps) => {
    const [url, setUrl] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [showUrl, setShowUrl] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    const downloadRef = useRef<HTMLDivElement>(null);

    const truncateTitle = (title: string, maxLength: number = 50) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    const formatUrlForDisplay = (url: string) => {
        try {
            const urlObj = new URL(url);
            return `${urlObj.hostname}${urlObj.pathname}`;
        } catch {
            return url;
        }
    };

    useEffect(() => {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/cultural-property-heritage/${uuid}`;
        setUrl(fullUrl);
    }, [uuid]);

    const downloadQRCode = async () => {
        if (downloadRef.current) {
            setIsDownloading(true);
            try {
                // Encontrar el SVG dentro del contenedor de descarga
                const svgElement = downloadRef.current.querySelector('svg');
                if (!svgElement) {
                    throw new Error('SVG no encontrado');
                }

                // Crear un canvas directamente desde el SVG
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    throw new Error('No se pudo obtener el contexto del canvas');
                }

                // Configurar el tamaño del canvas (alta resolución)
                const size = 800;
                canvas.width = size;
                canvas.height = size;

                // Fondo blanco
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, size, size);

                // Convertir SVG a imagen
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const svgUrl = URL.createObjectURL(svgBlob);

                const img = new Image();

                await new Promise<void>((resolve, reject) => {
                    img.onload = () => {
                        try {
                            // Centrar el QR en el canvas con padding
                            const padding = 80;
                            const qrSize = size - (padding * 2);

                            ctx.drawImage(img, padding, padding, qrSize, qrSize);

                            // Limpiar la URL temporal
                            URL.revokeObjectURL(svgUrl);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    };

                    img.onerror = () => {
                        URL.revokeObjectURL(svgUrl);
                        reject(new Error('Error al cargar la imagen SVG'));
                    };

                    img.src = svgUrl;
                });

                // Convertir a PNG y descargar
                const pngUrl = canvas.toDataURL('image/png', 1.0);
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;

                const cleanTitle = title
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase()
                    .substring(0, 30);

                downloadLink.download = `qr-${cleanTitle || 'patrimonio'}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

            } catch (error) {
                console.error('Error downloading QR code:', error);
                // Fallback: intentar con html2canvas
                await downloadWithHtml2Canvas();
            } finally {
                setIsDownloading(false);
            }
        }
    };

    // Método de respaldo con html2canvas
    const downloadWithHtml2Canvas = async () => {
        if (qrRef.current) {
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

                const pngUrl = canvas.toDataURL('image/png', 1.0);
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;

                const cleanTitle = title
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase()
                    .substring(0, 30);

                downloadLink.download = `qr-${cleanTitle || 'patrimonio'}-fallback.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (error) {
                console.error('Error en método de respaldo:', error);
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const openInNewTab = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const header = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-qrcode text-2xl text-primary"></i>
            <span className="font-semibold">Código QR del Patrimonio</span>
        </div>
    );

    const footer = (
        <div className="flex justify-content-between align-items-center gap-2">
            <div className="flex gap-2">
                <Button
                    label="Copiar enlace"
                    icon="pi pi-copy"
                    onClick={copyToClipboard}
                    className="p-button-text p-button-sm"
                    tooltip="Copiar URL al portapapeles"
                />
                <Button
                    label="Abrir"
                    icon="pi pi-external-link"
                    onClick={openInNewTab}
                    className="p-button-text p-button-sm"
                    tooltip="Abrir en nueva pestaña"
                />
            </div>
            <div className="flex gap-2">
                <Button
                    label={isDownloading ? "Descargando..." : "Descargar"}
                    icon={isDownloading ? "pi pi-spin pi-spinner" : "pi pi-download"}
                    onClick={downloadQRCode}
                    className="p-button-outlined p-button-sm"
                    disabled={isDownloading}
                    tooltip="Descargar código QR como imagen PNG"
                />
                <Button
                    label="Cerrar"
                    icon="pi pi-times"
                    onClick={onHide}
                    className="p-button-text p-button-sm"
                />
            </div>
        </div>
    );

    return (
        <>
            <Tooltip target=".tooltip-trigger" />
            <Dialog
                header={header}
                visible={visible}
                style={{ width: '90%', maxWidth: '450px' }}
                onHide={onHide}
                footer={footer}
                dismissableMask
                className="qr-dialog"
                contentClassName="p-0"
            >
                <div className="p-4">
                    <Card className="shadow-none border-none">
                        <div className="flex flex-column align-items-center text-center">
                            <div className="mb-4 w-full">
                                <h4
                                    className="m-0 text-900 font-medium line-height-3"
                                    style={{
                                        wordBreak: 'break-word',
                                        hyphens: 'auto'
                                    }}
                                    title={title}
                                >
                                    {truncateTitle(title, 80)}
                                </h4>
                                {title.length > 80 && (
                                    <small className="text-500 mt-1 block">
                                        Título completo disponible al pasar el cursor
                                    </small>
                                )}
                            </div>

                            <Divider className="my-3" />

                            {/* Contenedor visual con todos los efectos bonitos */}
                            <div
                                ref={qrRef}
                                className="qr-container"
                                style={{
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Efecto decorativo sutil */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
                                    }}
                                />

                                <QRCode
                                    value={url}
                                    size={240}
                                    level="H"
                                    style={{
                                        height: 'auto',
                                        maxWidth: '100%',
                                        width: '100%',
                                        display: 'block'
                                    }}
                                />
                            </div>

                            {/* Contenedor oculto para descarga (sin efectos visuales) */}
                            <div
                                ref={downloadRef}
                                style={{
                                    position: 'absolute',
                                    left: '-9999px',
                                    top: '-9999px',
                                    background: '#ffffff',
                                    padding: '20px'
                                }}
                            >
                                <QRCode
                                    value={url}
                                    size={240}
                                    level="H"
                                />
                            </div>

                            <Divider className="my-4" />

                            <div className="text-center mb-3">
                                <div className="flex align-items-center justify-content-center gap-2 mb-2">
                                    <i className="pi pi-mobile text-primary"></i>
                                    <span className="text-sm font-medium text-700">
                                        Escanea para acceder
                                    </span>
                                </div>
                                <p className="text-xs text-500 line-height-3 m-0 max-w-20rem">
                                    Utiliza la cámara de tu dispositivo móvil para escanear
                                    el código QR y acceder directamente a los detalles del bien patrimonial
                                </p>
                            </div>

                            {/*<div className="w-full">*/}
                            {/*    <Button*/}
                            {/*        label={showUrl ? "Ocultar enlace" : "Mostrar enlace"}*/}
                            {/*        icon={showUrl ? "pi pi-chevron-up" : "pi pi-chevron-down"}*/}
                            {/*        className="p-button-text p-button-sm w-full"*/}
                            {/*        onClick={() => setShowUrl(!showUrl)}*/}
                            {/*    />*/}

                            {/*    {showUrl && (*/}
                            {/*        <div className="mt-2 p-2 bg-gray-50 border-round">*/}
                            {/*            <div className="flex align-items-center gap-2">*/}
                            {/*                <i className="pi pi-link text-xs text-500"></i>*/}
                            {/*                <code className="text-xs text-600 flex-1" style={{ wordBreak: 'break-all' }}>*/}
                            {/*                    {formatUrlForDisplay(url)}*/}
                            {/*                </code>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div>
                    </Card>
                </div>
            </Dialog>

            <style jsx>{`
                .qr-dialog .p-dialog-content {
                    padding: 0;
                }

                .qr-container {
                    transition: all 0.3s ease;
                }

                .qr-container:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6);
                }
            `}</style>
        </>
    );
};
