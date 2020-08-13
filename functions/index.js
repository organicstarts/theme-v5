// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

admin.initializeApp();

// BugSnag
const Bugsnag = require('@bugsnag/js');

const BugsnagPluginExpress = require('@bugsnag/plugin-express');

Bugsnag.start({
  apiKey: '9fdbfc881c739822fed1ce038ded6dbf',
  plugins: [BugsnagPluginExpress]
});
const middleware = Bugsnag.getPlugin('express');

const request = require('request-promise');

const express = require('express');

const cors = require('cors');

const clientId = functions.config().bigcommerce.id;
const clientSecret = functions.config().bigcommerce.secret;
const accessToken = functions.config().bigcommerce.token;
const storeHash = functions.config().bigcommerce.store_hash;
const apiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v3`

const ROUTES = {
    BRANDS: params => `/catalog/brands?${params}`,
    PRODUCT: (id, params) => `/catalog/products/${id}?${params}`,
    PRODUCT_OPTIONS: id => `/catalog/products/${id}/options`,
    PRODUCT_VARIANTS: id => `/catalog/products/${id}/variants`,
    PRODUCT_IMAGES: (id, params) => `/catalog/products/${id}/images?${params}`,
    PRODUCTS: params => `/catalog/products?${params}`,
    CATEGORY: id => `/catalog/categories/${id}`,
    CATEGORIES: '/catalog/categories',
    CATEGORIES_TREE: '/catalog/categories/tree',
};

const parse = {
    product: data => ({
        id: data.id,
        name: data.name,
        sku: data.sku,
        price: data.price,
        cost_price: data.cost_price,
        retail_price: data.retail_price,
        sale_price: data.sale_price,
        map_price: data.map_price,
        calculated_price: data.calculated_price,
        categories: data.categories,
        inventory_level: data.inventory_level,
        inventory_warning_level: data.inventory_level,
        reviews_count: data.reviews_count,
        total_sold: data.total_sold,
        is_free_shipping: data.is_free_shipping,
        is_visible: data.is_visible,
        is_featured: data.is_featured,
        upc: data.upc,
        mpn: data.mpn,
        gtin: data.gtin,
        availability: data.availability,
        availability_description: data.availability_description,
        condition: data.condition,
        is_condition_shown: data.is_condition_shown,
        order_quantity_minimum: data.order_quantity_minimum,
        order_quantity_maximum: data.order_quantity_maximum,
        page_title: data.page_title,
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        custom_url: data.custom_url,
        base_variant_id: data.base_variant_id
    }),
    products: (data, brands) => new Promise((resolve, reject) => {
        apiGet(ROUTES.PRODUCT_IMAGES(data.id, `include_fields=id,is_thumbnail,url_thumbnail,description`))
            .then(imagesData => {
                const thumbnail = imagesData && imagesData.filter(i => i.is_thumbnail);
                return resolve({
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    sale_price: data.sale_price,
                    brand: brands[data.brand_id],
                    reviews_rating_sum: data.reviews_rating_sum,
                    reviews_count: data.reviews_count,
                    custom_url: data.custom_url,
                    inventory_level: data.inventory_level,
                    inventory_tracking: data.inventory_tracking,
                    availability: data.availability,
                    is_visible: data.is_visible,
                    thumbnail: thumbnail[0]
                });
            })
            .catch(err => reject(err));
    }),
    category: data => ({
        id: data.id,
        parent_id: data.parent_id,
        name: data.name,
        page_title: data.page_title,
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
        is_visible: data.is_visible,
        custom_url: data.custom_url
    }),
    inventory: data => ({
        id: data.id,
        sku: data.sku,
        inventory_level: data.inventory_level,
        inventory_tracking: data.inventory_tracking,
        bin_picking_number: data.bin_picking_number
    })
};

const apiGet = route => new Promise((resolve, reject) => {
    request({
        url: `${apiUrl}${route}`,
        headers: {
            'X-Auth-Client': clientId,
            'X-Auth-Token': accessToken
        }
    })
    .then(json => {
        const parseData = JSON.parse(json);
        return resolve(parseData && parseData.data || parseData);
    })
    .catch(err => reject(err));
});

function send(res, code, body) {
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Methods", "GET, POST")
    res.set("Access-Control-Allow-Headers", "Content-Type")
    res.status(code).json(body)
  }

const error = (err, res) => {
    console.error(err);
    send(res, 500, {
      message: `Internal Server Error.`,
    });
};


const app = express();

// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
app.use(middleware.requestHandler);

/* all other middleware and application routes go here */
app.use(cors({ origin: true }));

// This handles any errors that Express catches
app.use(middleware.errorHandler);

//
// CATEGORIES
//
// Get all categories
app.get('/categories', (req, res) => {
    return apiGet(ROUTES.CATEGORIES)
        .then(x => x.reduce((accu, curr) => [...accu, parse.category(curr)], []))
        .then(response => send(res, 200, response))
        .catch(err => error(err, res));
});
// Get a single category by id
app.get('/category/:id', (req, res) => {
    return apiGet(ROUTES.CATEGORY(req.params.id))
        .then(x => send(res, 200, x))
        .catch(err => error(err, res));
});
// Get the category tree
app.get('/categories/tree', (req, res) => {
    return apiGet(ROUTES.CATEGORIES_TREE)
        .then(x => send(res, 200, x))
        .catch(err => error(err, res));
});

//
// PRODUCTS
//
// Get a single product by id
app.get('/product/:id/variants', (req, res) => {
    const parseQuantity = str => str.split(" ").filter(x => !isNaN(x));
    return apiGet(ROUTES.PRODUCT_VARIANTS(req.params.id))
        .then(x => x && x.reduce((accu, master) => {
            const options = {};
            master.option_values.filter(x => {
                const qty = parseQuantity(x.label);
                options[x.id] = {
                    product_id: master.product_id,
                    price: master.price || false,
                    quantity: qty && qty.length === 1 ? qty[0] : false
                };
            });
            
            return {
                ...accu,
                ...options
            };
        }, {}))
        .then(x => send(res, 200, x))
        .catch(err => error(err, res));
});
app.get('/product/:id/options', (req, res) => {
    return apiGet(ROUTES.PRODUCT_OPTIONS(req.params.id))
        .then(x => send(res, 200, x))
        .catch(err => error(err, res));
});
app.get('/product/:id/:params?', (req, res) => {
    const params = req.params.params || '';
    return apiGet(ROUTES.PRODUCT(req.params.id, params))
        .then(x => send(res, 200, x))
        .catch(err => error(err, res));
});
// Get a group of products by category id
app.get('/products/:id/:limit?', async (req, res) => {
    const brandsData = await apiGet(ROUTES.BRANDS(`limit=250&include_fields=id,name,custom_url`)).catch(err => error(err, res));
    const brands = brandsData && brandsData.reduce((accu, curr) => curr ? {
        [curr.id]: { 
            name: curr.name, 
            custom_url: curr.custom_url 
        }, ...accu} : accu, {});
    const productsData = await apiGet(ROUTES.PRODUCTS(`is_visible=true&limit=${req.params.limit || 250}${req.params.id ? `&categories:in=${req.params.id}` : ''}`)).catch(err => error(err, res));
    const products = productsData && productsData.reduce((accu, curr) => curr ? [...accu, parse.products(curr, brands).catch(err => error(err, res))] : accu, []);
    const response = await Promise.all(products);
    return send(res, 200, response);
});

exports.bigcommerce = functions.https.onRequest(app);

const app2 = express();
app2.use(cors({ origin: true }));

app2.get('/:page?', (req, res) => {
    return apiGet(ROUTES.PRODUCTS(`availability=available&is_visible=true&limit=250&page=${req.params.page || 0}`))
        .then(x => x && x.reduce((accu, curr) => curr ? [...accu, parse.inventory(curr)] : accu, []))
        .then(response => send(res, 200, response))
        .catch(err => error(err, res));
});

app2.get('/category/:id', (req, res) => {
    return apiGet(ROUTES.PRODUCTS(`availability=available&is_visible=true&limit=250&categories:in=${req.params.id}`))
        .then(x => x && x.reduce((accu, curr) => curr ? [...accu, parse.inventory(curr)] : accu, []))
        .then(response => send(res, 200, response))
        .catch(err => error(err, res));
});

exports.inventory = functions.https.onRequest(app2);