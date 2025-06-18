// ==================== INTERFACES ====================
export interface QRCodeDialogProps {
    visible: boolean;
    onHide: () => void;
    uuid: string;
    title: string;
}

export interface QRGenerationOptions {
    size: number;
    padding: number;
    quality: number;
}

// ==================== CONSTANTS ====================
export const QR_CONFIG: QRGenerationOptions = {
    size: 800,
    padding: 80,
    quality: 1.0
};

export const QR_DISPLAY_SIZE = 240;
export const TITLE_MAX_LENGTH = 80;
export const FILENAME_MAX_LENGTH = 30;
