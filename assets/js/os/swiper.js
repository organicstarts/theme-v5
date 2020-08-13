import Swiper from 'swiper/bundle';

const mobileQuery = window.matchMedia('(max-width: 769px)');

const swipers = mediaQuery => {
    if (mediaQuery.matches) {
        const defaultSwipers = element => new Swiper(element, {
            slidesPerView: 1,
            spaceBetween: 16,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                },
                480: {
                    slidesPerView: 3,
                },
                640: {
                    slidesPerView: 4,
                },
                800: {
                    slidesPerView: 5,
                },
            },
            watchSlidesVisibility: true,
        });
        const navSwiper = element => new Swiper(element, {
            freeMode: true,
            freeModeMomentum: false,
            spaceBetween: 0,
        });
        defaultSwipers('.default.swiper-container');
        navSwiper('.nav-carousel');
    }
};

const renderSwipers = () => {
    swipers(mobileQuery);
    mobileQuery.addListener(swipers);
};

export default renderSwipers;
