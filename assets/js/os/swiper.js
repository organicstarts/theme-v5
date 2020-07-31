import SwiperJS from 'swiper';

const mobileQuery = window.matchMedia('(max-width: 769px)');

const Swipers = mediaQuery => {
    if (mediaQuery.matches) {
        new SwiperJS('.default.swiper-container', {
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
        new SwiperJS('.nav-carousel', {
            freeMode: true,
            freeModeMomentum: false,
            spaceBetween: 0,
        });
    }
};

const renderSwipers = () => {
    Swipers(mobileQuery);
    mobileQuery.addListener(Swipers);
};

export default renderSwipers;