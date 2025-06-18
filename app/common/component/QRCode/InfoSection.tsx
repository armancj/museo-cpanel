
export const InfoSection = () => (
    <>
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

        <div className="flex align-items-center justify-content-center gap-2 mt-2">
            <i className="pi pi-share-alt text-green-500"></i>
            <span className="text-xs text-500">
                Usa "Compartir" para enviar la imagen del QR por WhatsApp, Telegram, etc.
            </span>
        </div>
    </>
);
