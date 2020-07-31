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

export default {
    cart: cart,
    renderCategories: renderCategories,
    renderHome: renderHome,
    renderProducts: renderProducts,
    loadSwiperCards: loadSwiperCards,
    start: () => {
        cart.renderCart();
        renderNavigation();
        renderSidebar();
        renderSwipers();
    }
};
