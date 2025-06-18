import QRCode from 'react-qr-code';
import { QR_DISPLAY_SIZE } from '@/app/common/component/QRCode/types';

export const HiddenQRContainer = ({ url, downloadRef }: { url: string; downloadRef: React.RefObject<HTMLDivElement> }) => (
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
            size={QR_DISPLAY_SIZE}
            level="H"
        />
    </div>
);
