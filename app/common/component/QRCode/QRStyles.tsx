export const QRStyles = () => (
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
);
