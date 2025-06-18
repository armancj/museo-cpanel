import { FILENAME_MAX_LENGTH } from '@/app/common/component/QRCode/types';

export const createCleanFilename = (title: string): string => {
    return title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .substring(0, FILENAME_MAX_LENGTH);
};


export const truncateTitle = (title: string, maxLength: number = 50): string => {
    return title.length <= maxLength ? title : title.substring(0, maxLength) + '...';
};

export const buildPatrimonialUrl = (uuid: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/cultural-property-heritage/${uuid}`;
};
