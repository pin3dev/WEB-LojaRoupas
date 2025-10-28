const products = [
    {"id":"p1","name":"Basic White T-shirt","category":"man-shirt","price":19.90,"image":"assets/img/product/product-m-5.webp","desc":"Regular fit, light cotton."},
    {"id":"p2","name":"Floral Dress","category":"woman-dress","price":49.90,"image":"assets/img/product/product-f-1.webp","desc":"Regular fit, light cotton."},
    {"id":"p3","name":"Polo Blue Lagoon","category":"man-shirt","price":39.90,"image":"assets/img/product/product-m-1.webp","desc":"Urban comfort."},
    {"id":"p4","name":"Polo Caramel","category":"man-shirt","price":39.90,"image":"assets/img/product/product-m-2.webp","desc":"Urban comfort."},
    {"id":"p5","name":"Summer Coral Dress","category":"woman-dress","price":49.90,"image":"assets/img/product/product-f-3.webp","desc":"Light and flowy, delicate print."},
    {"id":"p6","name":"Pink Linen Blouse","category":"woman-blouse","price":34.50,"image":"assets/img/product/product-f-6.webp","desc":"Ideal for summer, 100% linen."},
    {"id":"p7","name":"Warm Children's Coat (Boy)","category":"children-boy","price":29.90,"image":"assets/img/product/product-b-1.webp","desc":"Soft warmth for the little ones."},
    {"id":"p8","name":"Cotton Jogger Pants (Girl)","category":"children-girl","price":24.00,"image":"assets/img/product/product-g-2.webp","desc":"Flexible and durable, adjustable waist."},
    {"id":"p9","name":"Urban Cargo Pants","category":"man-pant","price":55.00,"image":"assets/img/product/product-m-8.webp"},
    {"id":"p10","name":"Lace Strap Blouse","category":"woman-blouse","price":22.50,"image":"assets/img/product/product-f-7.webp"},
    {"id":"p11","name":"Black Slim Dress","category":"woman-dress","price":22.50,"image":"assets/img/product/product-f-4.webp","desc":"Lace detailing, light fabric."},
    {"id":"p12","name":"Pink Lady Bag","category":"woman","price":22.50,"image":"assets/img/product/product-1.png","desc":"Lace detailing, light fabric."},
    {"id":"p13","name":"Watch Dark Green","category":"man-acessorie","price":22.50,"image":"assets/img/product/product-11.png","desc":"Green round watch."},
     {"id":"p14","name":"Jeans Chic blouse","category":"woman-blouse","price":22.50,"image":"assets/img/product/product-f-8.webp","desc":"Green round watch."},
     {"id":"p15","name":"Urban Cargo Blue Pants","category":"man-pant","price":55.00,"image":"assets/img/product/product-m-7.webp"},
     {"id":"p16","name":"White Summer Shirt","category":"woman-blouse","price":55.00,"image":"assets/img/product/product-f-5.webp"},
     {"id":"p17","name":"Warm Children's Coat (Boy)","category":"children-boy","price":29.90,"image":"assets/img/product/product-b-2.webp","desc":"Soft warmth for the little ones."},
     {"id":"p18","name":"Warm Children's Coat (Girl)","category":"children-girl","price":29.90,"image":"assets/img/product/product-g-1.webp","desc":"Soft warmth for the little ones."},
     {"id":"p19","name":"Queen Gold Neckless","category":"woman","price":290.90,"image":"assets/img/product/product-3.png","desc":"Soft warmth for the little ones."},
     {"id":"p20","name":"Earing Queen Red","category":"woman","price":48.90,"image":"assets/img/product/product-5.png","desc":"Soft warmth for the little ones."},
     {"id":"p21","name":"Black Oversize Pant","category":"woman-pant","price":48.90,"image":"assets/img/product/product-f-9.webp","desc":"Soft warmth for the little ones."},
];

function getDisplayCategory(categoryKey) {
    if (categoryKey === 'man') return 'Man';
    if (categoryKey === 'woman') return 'Woman';
    if (categoryKey === 'children-boy') return 'Children (Boy)';
    if (categoryKey === 'children-girl') return 'Children (Girl)';
    
    return categoryKey;
}

function renderProducts(list){
    const cont = document.getElementById('product-list');
    const resultsCount = document.getElementById('results-count');
    
    cont.innerHTML = '';
    
    // Update results count
    resultsCount.textContent = `Listing ${list.length} of ${products.length} products.`;

    if (list.length === 0) {
        cont.innerHTML = '<div class="col-12"><div class="alert alert-warning">No products found matching the selected filters.</div></div>';
        // Mesmo que não haja produtos, precisamos de tentar ligar os botões (caso venham de 'cart.js')
        if (typeof attachAddButtons === 'function') {
            attachAddButtons();
        }
        return;
    }
    
    list.forEach(p=>{
        // Get the translated display category
        const displayCategory = getDisplayCategory(p.category);

        cont.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-4 mb-4">
                <div class="product-item card h-100 border-0 shadow-sm">
                    <div class="product-image-wrapper">
                        <img src="${p.image}" class="card-img-top product-image" alt="${p.name}">
                    </div>
                    
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-medium">${p.name}</h6>
                        <p class="small text-muted flex-grow-1 mb-3">${p.desc || ''}</p>
                        
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                            <div class="fs-4 fw-bold text-dark">€ ${p.price.toFixed(2)}</div>
                            <div>
                                <button class="btn btn-dark btn-sm add-to-cart" 
                                        data-id="${p.id}" 
                                        data-name="${p.name}" 
                                        data-price="${p.price}" 
                                        data-image="${p.image}">
                                    <i class="bi bi-cart-plus me-1"></i> Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Re-attach listeners after rendering (assumindo que attachAddButtons está em cart.js)
    // Adicionamos uma verificação para evitar erros se o ficheiro/função não existir
    if (typeof attachAddButtons === 'function') {
        attachAddButtons();
    }
}

/* Centralized function to apply all filters and sorting */
function performFilter(){
    let filteredList = [...products];

    // 1. CATEGORY FILTER (Handles main categories AND 'children' parent filter)
    const activeCategoryEl = document.querySelector('#category-filters .active');
    
    if (activeCategoryEl) { // Verifica se algum filtro está ativo
        const activeCategory = activeCategoryEl.dataset.cat;
        
        if (activeCategory !== 'all') {
            if (activeCategory === 'children') {
                // Special case: Filter products whose category STARTS with 'children-'
                filteredList = filteredList.filter(p => p.category.startsWith('children-'));
            } else if (activeCategory === 'man') {
                 // Special case: Filter products whose category STARTS with 'man-'
                filteredList = filteredList.filter(p => p.category.startsWith('man-'));
            } else if (activeCategory === 'woman') {
                 // Special case: Filter products whose category STARTS with 'woman-'
                filteredList = filteredList.filter(p => p.category.startsWith('woman-'));
            }
            else {
                // Standard filtering for specific sub-categories
                filteredList = filteredList.filter(p => p.category === activeCategory);
            }
        }
    }
    
    // 2. PRICE FILTER
    const activePriceRange = document.querySelector('input[name="price_range"]:checked').value;
    if (activePriceRange !== 'all') {
        const [minStr, maxStr] = activePriceRange.split('-');
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        
        filteredList = filteredList.filter(p => p.price >= min && p.price <= max);
    }

    // 3. NAME SEARCH FILTER
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm) {
        // Verifica nome E descrição
        filteredList = filteredList.filter(p => 
            (p.name && p.name.toLowerCase().includes(searchTerm)) || 
            (p.desc && p.desc.toLowerCase().includes(searchTerm))
        );
    }

    // 4. SORTING
    const sortValue = document.getElementById('sort').value;
    if (sortValue === 'price-asc') {
        filteredList.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filteredList.sort((a, b) => b.price - b.price);
    } else if (sortValue === 'name-asc') {
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filteredList);
}

/**
 * FIX 2 (JS): Nova Função
 * Lê a URL à procura de '?cat=...' e ativa o filtro correspondente
 * na barra lateral antes da primeira renderização.
 */
function applyCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('cat');
    
    if (categoryFromURL) {
        // Tenta encontrar o link correspondente na barra lateral
        const sidebarLink = document.querySelector(`#category-filters a[data-cat="${categoryFromURL}"]`);
        
        if (sidebarLink) {
            // Remove 'active' do link "All Products" (que é o default)
            document.querySelector('#category-filters a.active').classList.remove('active');
            // Adiciona 'active' ao link da URL
            sidebarLink.classList.add('active');
        }
    }
}

/* Event Listeners */
document.getElementById('category-filters').addEventListener('click', e=>{
    if(e.target && e.target.dataset.cat !== undefined){
        e.preventDefault();
        // Remove 'active' from all category filters
        document.querySelectorAll('#category-filters a').forEach(el=>el.classList.remove('active'));
        // Add 'active' to the clicked element
        e.target.classList.add('active');
        performFilter(); // Call filter function
    }
});

document.getElementById('sort').addEventListener('change', performFilter); // Call filter function on sort change

document.getElementById('price-filters').addEventListener('change', performFilter); // Call filter function on price change

/**
 * FIX 1 (JS):
 * Adiciona o listener ao campo de busca para filtrar ENQUANTO digita.
 */
document.getElementById('search-input').addEventListener('input', performFilter);


/* Initial render */
applyCategoryFromURL(); // PRIMEIRO, aplica o filtro da URL
performFilter();      // DEPOIS, renderiza a lista com todos os filtros (incluindo o da URL)

document.getElementById('year2').textContent = new Date().getFullYear();