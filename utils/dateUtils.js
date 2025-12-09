export function myAge(dateBirth) {
    if (!dateBirth) return null;

    let date;

    const brHyphen = /^(\d{2})-(\d{2})-(\d{4})$/;
    const brSlash = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (brHyphen.test(dateBirth)) {
        const [_, d, m, y] = dateBirth.match(brHyphen);
        date = new Date(`${y}-${m}-${d}`);

    } else if (brSlash.test(dateBirth)) {
        const [_, d, m, y] = dateBirth.match(brSlash);
        date = new Date(`${y}-${m}-${d}`);

    } else {
        date = new Date(dateBirth);
    }

    if (isNaN(date.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();

    const month = today.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < date.getDate())) {
        age--;
    }

    return age;
}
