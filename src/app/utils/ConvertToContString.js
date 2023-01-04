export const ConvertToContString = (str, length) => {
    if (str) {
        if (str.toString().length > length) {
            return str.substring(0, length) + '...';
        } else {
            return str;
        }
    } else {
        return '';
    }
};