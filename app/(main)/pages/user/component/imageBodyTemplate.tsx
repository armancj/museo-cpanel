import { useEffect, useState } from 'react';
import { UsersDatum } from '@/app/service/UserService';


export const ImageBodyTemplate = (rowData: UsersDatum) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const defaultImage = '/demo/images/product/bamboo-watch.jpg';
    useEffect(() => {
        if (rowData.avatar?.id) {
            const imageUrl = process.env.NEXT_PUBLIC_API_BASE_URL + `file-storage/${rowData.avatar.id}`;
            setAvatarUrl(imageUrl);
        } else {
            setAvatarUrl(defaultImage);
        }
    }, [rowData.avatar?.id]);

    return (
        <img
            src={avatarUrl || defaultImage}
    alt="Avatar"
            style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #ddd',
                padding: '2px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
            }}
    />
);
};
