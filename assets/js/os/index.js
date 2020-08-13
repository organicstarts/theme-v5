import 'lazysizes';
import 'imgix.js';

import cart from './cart';
import renderCategories from './categories';
import renderHome from './home';
import renderNavigation from './navigation';
import renderProducts from './products';
import renderSidebar from './sidebar';
import renderSwipers from './swiper';
import loadSwiperCards from './swiperCards';
import priceAndPercent from './utils';

export default {
    cart,
    renderCategories,
    renderHome,
    renderProducts,
    loadSwiperCards,
    priceAndPercent,
    start: () => {
        cart.renderCart();
        renderNavigation();
        renderSidebar();
        renderSwipers();
    },
};
