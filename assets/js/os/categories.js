import loadSwiperCards from './swiperCards';

const categories = (ids) => {
    const xmlhttp = new XMLHttpRequest();
    const url = 'https://us-central1-apt-reason-149015.cloudfunctions.net/inventory';
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText).filter(x => x && x !== null);
            ids.map(id => loadSwiperCards(`categories/${id}.json?v=4`, `subcategory${id}`, response));
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

const renderCategories = () => {
    const c = document?.getElementById('subcategories')?.getElementsByTagName('div');
    const getSubcategoryId = el => el?.getAttribute('data-subcategory-id');
    const ids = [].filter.call(c, el => getSubcategoryId(el)).reduce((acc, cur) => [...acc, getSubcategoryId(cur)], []);
    categories(ids);
};

export default renderCategories;