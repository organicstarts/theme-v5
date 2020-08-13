import Swiper from 'swiper/bundle';

const swiperCards = (json, elem) => {
    const mobiles = window.matchMedia('(max-width: 769px)');
    const response = [];
    if (json.length) {
        json.filter(x => x).map(product => response.push(`<div class="swiper-slide" data-product-id="${product.id}"><div class="card--product">
                <a class="card--product-image" href="${product.url}">
                    <img class="lazyload" data-sizes="auto" src="${product.thumbnail.url_thumbnail}" alt="${product.thumbnail.description || product.name}" ${product.thumbnail.description ? `title="${product.name}" ` : ''}sizes="144px">
                </a>
                <div class="card--product-content">
                    <h6 data-test-info-type="brandName">
                        <a href="${product.brand.custom_url.url}">
                            ${product.brand.name}
                        </a>
                    </h6>
                    <h5>
                        <a href="${product.custom_url.url}">
                            ${product.name}
                        </a>
                    </h5>
                </div>
                <div class="card--product-flex">
                    <div class="card--product-rating" data-test-info-type="productRating">
                        <div class="product-rating_stars" style="--rating: ${product.reviews_rating_sum / product.reviews_count};" aria-label="Rating of this product is ${product.reviews_rating_sum / product.reviews_count} out of 5."></div>
                    </div>
                    <div class="card--product-price" data-test-info-type="price">
                        ${
            product.sale_price !== 0 && product.sale_price < product.price
                ?
                `<div class="text-danger small price-section price-section--withoutTax non-sale-price--withoutTax">
                                <span data-product-non-sale-price-without-tax="" class="price price--non-sale">
                                    $${product.price.toFixed(2)}
                                </span>
                            </div>`
                :
                ''
            }
                        <div class="price-section price-section--withoutTax">
                            <span data-product-price-without-tax="" class="price price--withoutTax">$${product.sale_price !== 0 && product.sale_price < product.price ? product.sale_price.toFixed(2) : product.price.toFixed(2)}</span>
                        </div>
                    </div>
                    ${
            ((product.inventory_level > 0) || (product.inventory_tracking === 'none')) ? (
                `<a href="/cart.php?action=add&product_id=${product.id}" class="card--product-btn atc instant-atc" data-product-id="${product.id}" onclick="window.addOneToCart(this);return false;" data-product-id="${product.id}" data-product-quantity="1">
                                ${product.inventory_tracking === 'variant' ? 'Choose Options' : 'Add to Cart'}
                            </a>`
            ) : (
                    `<a href="${product.custom_url.url}" class="card--product-btn oos">
                                Out of Stock
                            </a>`
                )
            }
                </div>
            </div></div>`));
    }
    document.querySelector(`#${elem} > .swiper-container > .swiper-wrapper`).innerHTML = response.join('');
    const swipers = (x) => {
        if (x.matches) {
            const swiper = element => new Swiper(element, {
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
            swiper(`#${elem} .swiper-container`);
        }
    };
    swipers(mobiles);
    mobiles.addListener(swipers);
};

const loadSwiperCards = (id, elem) => {
    const xmlhttp = new XMLHttpRequest();
    const url = `https://us-central1-apt-reason-149015.cloudfunctions.net/bigcommerce/products/${id}/10`;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            swiperCards(response, elem);
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

export default loadSwiperCards;
