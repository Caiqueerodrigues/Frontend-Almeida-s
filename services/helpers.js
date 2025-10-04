export function generateIdRandom(size, letters = false) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < size; i++) {
        if(letters) {
            const indice = Math.floor(Math.random() * caracteres.length);
            resultado += caracteres.charAt(indice);
        } else {
            const numero = Math.floor(Math.random() * 10);
            resultado += numero.toString();
        }
    }
    return letters ? resultado : Number(resultado);
}

export function formatteDateBrasilia (date, onlyDate) {
    const adjustedDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));

    let day = adjustedDate.getDate();
    const month = adjustedDate.getMonth() + 1;
    const year = adjustedDate.getFullYear();
    const hour = adjustedDate
        .toISOString()
        .split("T")[1]
        .split('.')[0];

    return onlyDate ?
        `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}` :
        `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year} ${hour}`;
}

export function getDadosJoin (item) {
    if(item.length > 1) return item.join(", ");
    
    return item[0];
}

export function formatDateToUTC3 (date) {
    const utc3Offset = -3 * 60; // -3 horas em minutos
    const localTime = new Date(date.getTime() + utc3Offset * 60000);
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};