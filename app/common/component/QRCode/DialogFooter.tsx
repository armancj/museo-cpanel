import { Button } from 'primereact/button';

export const DialogFooter = ({
                          url,
                          copyToClipboard,
                          shareQR,
                          downloadQR,
                          isSharing,
                          isDownloading,
                          onHide
                      }: {
    url: string;
    copyToClipboard: (text: string) => void;
    shareQR: () => void;
    downloadQR: () => void;
    isSharing: boolean;
    isDownloading: boolean;
    onHide: () => void;
}) => {
    const openInNewTab = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex justify-content-between align-items-center gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
                <Button
                    label="Copiar enlace"
                    icon="pi pi-copy"
                    onClick={() => copyToClipboard(url)}
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
            <div className="flex gap-2 flex-wrap">
                <Button
                    label={isSharing ? "Compartiendo..." : "Compartir"}
                    icon={isSharing ? "pi pi-spin pi-spinner" : "pi pi-share-alt"}
                    onClick={shareQR}
                    className="p-button-success p-button-sm"
                    disabled={isSharing}
                    tooltip="Compartir imagen del código QR"
                />
                <Button
                    label={isDownloading ? "Descargando..." : "Descargar"}
                    icon={isDownloading ? "pi pi-spin pi-spinner" : "pi pi-download"}
                    onClick={downloadQR}
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
};
