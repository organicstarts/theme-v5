import loadSwiperCards from './swiperCards';

const categories = ids => {
    ids.map(id => loadSwiperCards(id, `subcategory${id}`));
};

const renderCategories = () => {
    const sc = document.getElementById('subcategories');
    const c = sc && sc.getElementsByTagName('div');
    const getSubcategoryId = el => el.getAttribute('data-subcategory-id');
    const ids = c && [].filter.call(c, el => getSubcategoryId(el)).reduce((acc, cur) => [...acc, getSubcategoryId(cur)], []);
    if (c) categories(ids);
};

export default renderCategories;
