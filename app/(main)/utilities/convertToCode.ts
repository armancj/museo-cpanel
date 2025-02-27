function removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function convertToCode(provinceName: string): string {
    const words = removeAccents(provinceName).split(' ');

    if (words.length === 1) {
        return words[0].substring(0, 3).toUpperCase();
    }

    return words.map(word => word.charAt(0).toUpperCase()).join('');
}
