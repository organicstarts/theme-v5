import Swiper from 'swiper/bundle';
import loadSwiperCards from './swiperCards';

const renderHome = () => {
    const swiperCategories = element => new Swiper(element, {
        slidesPerView: 'auto',
        loop: true,
        watchSlidesVisibility: true,
        centeredSlides: true,
    });
    const swiperBrands = element => new Swiper(element, {
        navigation: {
            nextEl: '#swiper-next',
            prevEl: '#swiper-prev',
        },
        pagination: {
            el: '#swiper-dots',
            type: 'bullets',
            dynamicBullets: true,
            dynamicMainBullets: 1,
        },
        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 16,
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
            640: {
                slidesPerView: 4,
                spaceBetween: 48,
            },
            800: {
                slidesPerView: 5,
                spaceBetween: 64,
            },
        },
        watchSlidesVisibility: true,
    });
    let i = 0;
    const colors = [
        'green', 'pink', 'blue',
    ];
    setInterval(() => {
        document.getElementById('powder-nest').classList = colors[i];
        i = (i === 2 ? 0 : i + 1);
    }, 3000);
    swiperCategories('#categories .swiper-container');
    swiperBrands('#brands .swiper-container');
    loadSwiperCards(142, 'diapers');
    loadSwiperCards(34, 'puree');
};

export default renderHome;
