import Swiper from 'swiper/bundle';

const dhm = ms => {
    // const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor((daysms) / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor((hoursms) / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const seconds = Math.floor((minutesms) / (1000));
    return `${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ',' : ''} ` : ''}${minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''} and ` : ''}${seconds} second${seconds !== 1 ? 's' : ''}`;
};

const renderProducts = id => {
    const productThumbs = new Swiper('.product-thumbs.swiper-container', {
        spaceBetween: 16,
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
    });
    const swiperImages = element => new Swiper(element, {
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: productThumbs,
        },
    });
    const moment = require('moment-business-days');
    let today = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const nyc = new Date(new Date().getTime() - 5 * 3600 * 1000);
    const currentDate = `${nyc.getMonth() + 1}-${nyc.getDate()}-${nyc.getFullYear()}`;
    const currentMoment = moment(currentDate, 'MM-DD-YYYY');
    const next = new Date(moment(currentDate, 'MM-DD-YYYY').nextBusinessDay()._d);
    const nextDate = `${next.getMonth() + 1}-${next.getDate()}-${next.getFullYear()}`;
    const cutoff = new Date(nyc.setHours(16, 30));
    const timeleft = Math.floor(cutoff - today) / (1000 * 60 * 60);
    const eta = new Date(moment(timeleft >= 0 && currentMoment.isBusinessDay() ? currentDate : nextDate, 'MM-DD-YYYY').businessAdd(3)._d);
    const arrival = Math.floor((eta - today) / (24 * 60 * 60 * 1000)) <= 4 ? `<br>Arrives on or before ${weekday[eta.getDay()]}, ${month[eta.getMonth()]} ${eta.getUTCDate()}.` : '';
    const arrivalElement = document.getElementById('arrival');
    const nextBusinessDayElement = document.getElementById('nextBusinessDay');
    if (arrivalElement || nextBusinessDayElement) {
        if (timeleft >= 0 && timeleft <= 24 && currentMoment.isBusinessDay()) {
            setInterval(() => {
                today = new Date();
                if (nextBusinessDayElement) nextBusinessDayElement.innerHTML = `${(cutoff - today) > 0 ? `today if ordered within ${dhm(cutoff - today)}.` : `on ${weekday[next.getDay()]}, ${month[next.getMonth()]} ${next.getUTCDate()}.`}`;
                if (arrivalElement) (arrivalElement.innerHTML = (cutoff - today) > 0 ? arrival : '');
            }, 1000);
        } else {
            if (Math.floor((next - today) / (24 * 60 * 60 * 1000)) < 2) {
                if (nextBusinessDayElement) nextBusinessDayElement.innerHTML = `on ${weekday[next.getDay()]}, ${month[next.getMonth()]} ${next.getUTCDate()}.`;
                if (arrivalElement) arrivalElement.innerHTML = arrival;
            } else {
                if (nextBusinessDayElement) nextBusinessDayElement.innerHTML = 'securely from our Nevada fulfillment center.';
            }
        }
    }
    moment.updateLocale('us', {
        workingWeekdays: [1, 2, 3, 4, 5, 6],
        holidays: [
            '12-20-2019',
            '12-21-2019',
            '12-23-2019',
            '12-24-2019',
            '12-25-2019',
            '12-26-2019',
            '12-31-2019',
            '01-01-2020',
            '01-18-2020',
            '01-20-2020',
            '02-15-2020',
            '02-17-2020',
            '05-23-2020',
            '05-25-2020',
            '07-03-2020',
            '07-04-2020',
            '09-05-2020',
            '09-07-2020',
            '10-10-2020',
            '10-12-2020',
            '11-11-2020',
            '11-26-2020',
            '11-27-2020',
            '11-28-2020',
            '12-24-2020',
            '12-25-2020',
            '12-26-2020',
            '12-31-2020',
            '01-01-2021',
            '01-02-2021',
            '01-16-2021',
            '01-18-2021',
            '02-13-2021',
            '02-15-2021',
            '05-29-2021',
            '05-31-2021',
            '07-03-2021',
            '07-04-2021',
            '07-05-2021',
            '09-05-2021',
            '09-06-2021',
            '09-07-2021',
            '10-09-2021',
            '10-11-2021',
            '11-11-2021',
            '11-25-2021',
            '11-26-2021',
            '11-27-2021',
            '12-24-2021',
            '12-25-2021',
            '12-31-2021',
            '01-01-2022',
        ],
        holidayFormat: 'MM-DD-YYYY',
    });

    // const round = val => ((Math.round(val * 100) / 100) * 10);

    // const xmlhttp = new XMLHttpRequest();
    // const url = `https://us-central1-apt-reason-149015.cloudfunctions.net/bigcommerce/product/${id}/include_fields=price`;
    // xmlhttp.onreadystatechange = function () {
    //     if (this.readyState === 4 && this.status === 200) {
    //         const response = JSON.parse(this.responseText);
    //         let first = 0;
    //         Object.keys(response).map((id, i) => {
    //             const elements = [];
    //             const variant = response[id];
    //             const quantity = parseInt(variant.quantity);
    //             if(variant.price && quantity) {
    //                 const percent = (first * quantity)/variant.price;
    //                 console.log(percent);
    //                 if(i !== 0 && percent > 0) elements.push(`<span>${percent.toFixed(0)}% OFF</span>`);
    //                 elements.push(`<span>$${(variant.price / quantity).toFixed(2)} each</span>`);
    //             }
    //             if(i === 0) first = variant.price;
    //             if(elements && elements.length) {
    //                 document.querySelector(`.priceAndPercent-${id}`).innerHTML = elements.join('');
    //             }
    //         });
    //         console.log(response);
    //         //swiperCards(response, elem);
    //     }
    // };
    // xmlhttp.open('GET', url, true);
    // xmlhttp.send();

    swiperImages('.productView--swiper-container');

    const xmlhttp = new XMLHttpRequest();
    const url = `https://us-central1-apt-reason-149015.cloudfunctions.net/bigcommerce/product/${id}/variants`;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            let first = 0;
            Object.keys(response).map((variantId, i) => {
                const elements = [];
                const variant = response[variantId];
                const price = (variant.price).toFixed(2);
                const quantity = parseInt(variant.quantity, 10);
                if (price && quantity) {
                    const each = (price / quantity).toFixed(2);
                    const percent = (((first - each) / first) * 100).toFixed(0);
                    if (i !== 0 && percent > 0) elements.push(`<span>${percent}% OFF</span>`);
                    elements.push(`<span>$${each} each</span>`);
                }
                if (i === 0) first = price;
                if (elements && elements.length) {
                    document.querySelector(`.priceAndPercent-${variantId}`).innerHTML = elements.join('');
                }
                return true;
            });
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

export default renderProducts;
