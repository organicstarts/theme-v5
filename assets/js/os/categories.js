import loadSwiperCards from './swiperCards';

const categories = (ids) => {
    const xmlhttp = new XMLHttpRequest();
    const url = 'https://us-central1-apt-reason-149015.cloudfunctions.net/inventory';
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            ids.map(id => loadSwiperCards(`categories/${id}.json?v=4`, `subcategory${id}`, response));
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

const renderCategories = () => {
    const ids = [];
    const c = document.getElementById('subcategories') && document.getElementById('subcategories').getElementsByTagName('div');
    let i = 0;
    let x = 0;
    for (i = 0; i < c && c.length; i++) {
        if (c[i].getAttribute('id')) {
            let id = c[i].getAttribute('id');
            id = id.replace('subcategory', '');
            ids[x] = id;
            x++;
        }
    }
    categories(ids);
};

export default renderCategories;