
'use client';
import { QRCodeDialogProps } from '@/app/common/component/QRCode/types';
import { useEffect, useState } from 'react';
import { useClipboard } from './QRCode/hook/useClipboard';
import { buildPatrimonialUrl } from './QRCode/util/createCleanFilename';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { DialogHeader } from './QRCode/DialogHeader';
import { DialogFooter } from './QRCode/DialogFooter';
import { Card } from 'primereact/card';
import { TitleSection } from '@/app/common/component/QRCode/TitleSection';
import { Divider } from 'primereact/divider';
import { QRContainer } from '@/app/common/component/QRCode/QRContainer';
import { HiddenQRContainer } from '@/app/common/component/QRCode/HiddenQRContainer';
import { InfoSection } from '@/app/common/component/QRCode/InfoSection';
import { QRStyles } from '@/app/common/component/QRCode/QRStyles';
import { useQRActions } from '@/app/common/component/QRCode/hook/useQRActions';

export const QRCodeDialog = ({ visible, onHide, uuid, title }: QRCodeDialogProps) => {
    const [url, setUrl] = useState<string>('');
    const { copyToClipboard } = useClipboard();
    const { downloadQR, shareQR, isDownloading, isSharing, qrRef, downloadRef } = useQRActions(title);

    useEffect(() => {
        setUrl(buildPatrimonialUrl(uuid));
    }, [uuid]);

    if (!url) return null;

    return (
        <>
            <Tooltip target=".tooltip-trigger" />
            <Dialog
                header={<DialogHeader />}
                visible={visible}
                style={{ width: '90%', maxWidth: '450px' }}
                onHide={onHide}
                footer={
                    <DialogFooter
                        url={url}
                        copyToClipboard={copyToClipboard}
                        shareQR={shareQR}
                        downloadQR={downloadQR}
                        isSharing={isSharing}
                        isDownloading={isDownloading}
                        onHide={onHide}
                    />
                }
                dismissableMask
                className="qr-dialog"
                contentClassName="p-0"
            >
                <div className="p-4">
                    <Card className="shadow-none border-none">
                        <div className="flex flex-column align-items-center text-center">
                            <TitleSection title={title} />
                            <Divider className="my-3" />
                            <QRContainer url={url} qrRef={qrRef} />
                            <HiddenQRContainer url={url} downloadRef={downloadRef} />
                            <Divider className="my-4" />
                            <InfoSection />
                        </div>
                    </Card>
                </div>
            </Dialog>
            <QRStyles />
        </>
    );
};

