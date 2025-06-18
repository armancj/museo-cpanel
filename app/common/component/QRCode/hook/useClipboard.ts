import { useCallback } from 'react';

export const useClipboard = () => {
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }, []);

    return { copyToClipboard };
};
