import QRCode from 'react-qr-code';
import { QR_DISPLAY_SIZE } from '@/app/common/component/QRCode/types';

export const QRContainer = ({ url, qrRef }: { url: string; qrRef: React.RefObject<HTMLDivElement> }) => (
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
            size={QR_DISPLAY_SIZE}
            level="H"
            style={{
                height: 'auto',
                maxWidth: '100%',
                width: '100%',
                display: 'block'
            }}
        />
    </div>
);
