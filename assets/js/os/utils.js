const priceRegex = /[\$\£\€](\d+(?:\.\d{1,2})?)/;
const percentRegex = /(\d+(\.\d+)?%)/;

const priceAndPercent = (id, string) => {
    const elements = [];
    const price = string.match(priceRegex);
    const percent = string.match(percentRegex);
    if (percent && percent.length) {
        elements.push(`<span>${percent[0]} OFF</span>`);
    }
    if (price && price.length) {
        elements.push(`<span>${price[0]} each</span>`);
    }
    if (elements && elements.length) {
        document.querySelector(`.priceAndPercent-${id}`).innerHTML = elements.join('');
    }
};

export default priceAndPercent;
