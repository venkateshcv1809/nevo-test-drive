import React, { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
    data: string;
    size?: number;
    className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ data, size = 192, className = '' }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrDataUrl = await QRCodeLib.toDataURL(data, {
                    width: size,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                    errorCorrectionLevel: 'M',
                });
                setQrCodeUrl(qrDataUrl);
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        };

        generateQRCode();
    }, [data, size]);

    if (!qrCodeUrl) {
        return (
            <div
                className={`bg-white rounded-lg flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <img
            src={qrCodeUrl}
            alt="QR Code"
            className={className}
            style={{ width: size, height: size }}
        />
    );
};
