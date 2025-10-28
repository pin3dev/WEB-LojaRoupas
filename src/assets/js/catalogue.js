// PRODUTOS DO CATALOGO
const products = [
    {"id":"p1","name":"Basic White T-shirt","category":"man-shirt","price":19.90,"image":"assets/img/product/product-m-5.webp","desc":"Regular fit and light cotton"},
    {"id":"p2","name":"Floral Dress","category":"woman-dress","price":49.90,"image":"assets/img/product/product-f-1.webp","desc":"Fluid and soft"},
    {"id":"p3","name":"Polo Blue Lagoon","category":"man-shirt","price":39.90,"image":"assets/img/product/product-m-1.webp","desc":"Urban comfort"},
    {"id":"p4","name":"Polo Caramel","category":"man-shirt","price":39.90,"image":"assets/img/product/product-m-2.webp","desc":"Elegant and comfortable"},
    {"id":"p5","name":"Summer Coral Dress","category":"woman-dress","price":49.90,"image":"assets/img/product/product-f-3.webp","desc":"Light and flowy delicate print"},
    {"id":"p6","name":"Pink Linen Blouse","category":"woman-blouse","price":34.50,"image":"assets/img/product/product-f-6.webp","desc":"Ideal for summer, 100% linen"},
    {"id":"p7","name":"Warm Children's Coat (Boy)","category":"children-boy","price":29.90,"image":"assets/img/product/product-b-1.webp","desc":"Soft warmth for the little ones"},
    {"id":"p8","name":"Cotton Jogger Pants (Girl)","category":"children-girl","price":24.00,"image":"assets/img/product/product-g-2.webp","desc":"Flexible and durable with adjustable waist"},
    {"id":"p9","name":"Urban Cargo Pants","category":"man-pant","price":55.00,"image":"assets/img/product/product-m-8.webp", "desc":"Oversized model"},
    {"id":"p10","name":"Lace Strap Blouse","category":"woman-blouse","price":22.50,"image":"assets/img/product/product-f-7.webp", "desc":"100% cotton"},
    {"id":"p11","name":"Black Slim Dress","category":"woman-dress","price":22.50,"image":"assets/img/product/product-f-4.webp","desc":"Lace detailing light fabric"},
    {"id":"p12","name":"Pink Lady Bag","category":"woman","price":22.50,"image":"assets/img/product/product-1.png","desc":"Casual chic"},
    {"id":"p13","name":"Watch Dark Green","category":"man-acessorie","price":22.50,"image":"assets/img/product/product-11.png","desc":"Ajustable with snake skin "},
    {"id":"p14","name":"Jeans Chic blouse","category":"woman-blouse","price":22.50,"image":"assets/img/product/product-f-8.webp","desc":"Warm and soft"},
    {"id":"p15","name":"Urban Cargo Blue Pants","category":"man-pant","price":55.00,"image":"assets/img/product/product-m-7.webp", "desc":"Elastic adjustable"},
    {"id":"p16","name":"White Summer Shirt","category":"woman-blouse","price":55.00,"image":"assets/img/product/product-f-5.webp", "desc":"Fresh and comfy"},
    {"id":"p17","name":"Warm Children's Coat (Boy)","category":"children-boy","price":29.90,"image":"assets/img/product/product-b-2.webp","desc":"Soft warmth for the little ones"},
    {"id":"p18","name":"Warm Children's Coat (Girl)","category":"children-girl","price":29.90,"image":"assets/img/product/product-g-1.webp","desc":"Soft warmth for the little ones"},
    {"id":"p19","name":"Queen Gold Neckless","category":"woman","price":290.90,"image":"assets/img/product/product-3.png","desc":"Gold 24k"},
    {"id":"p20","name":"Earing Queen Red","category":"woman","price":48.90,"image":"assets/img/product/product-5.png","desc":"Rubi and gold plated"},
    {"id":"p21","name":"Black Oversize Pant","category":"woman-pant","price":48.90,"image":"assets/img/product/product-f-9.webp","desc":"Flexible and durable with adjustable waist"},
];

// FUNCAO PARA APARECEREM OS PRODUTOS QUE REMETEM A SUAS CATEGORIAS E SUBCATEGORIAS
function getDisplayCategory(categoryKey) {
    if (categoryKey === 'man') return 'Man';
    if (categoryKey === 'woman') return 'Woman';
    if (categoryKey === 'children-boy') return 'Children (Boy)';
    if (categoryKey === 'children-girl') return 'Children (Girl)';
    
    return categoryKey;
}

// GERA E INSERE NO HTML OS PRODUTOS NA PAGINA
function renderProducts(list){
    const cont = document.getElementById('product-list');
    const resultsCount = document.getElementById('results-count');
    
    cont.innerHTML = '';
    
    // ATUALIZAÇAO DA CONTAGEM DOS PRODUTOS EXIBIDOS
    resultsCount.textContent = `Listing ${list.length} of ${products.length} products`;
    
    // ITERA SOBRE LISTA DE PRODUTOS E GERA CADA CARD DE PRODUTO
    list.forEach(p=>{
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
    
    // FUNCIONALIDADE DO BOTAO DE ADC AO CARRINHO
    if (typeof attachAddButtons === 'function') {
        attachAddButtons();
    }
}

// FUNCAO PARA APLICAR FILTROS
function performFilter(){
    let filteredList = [...products];

//    FILTRO DE CATEGORIA
    const activeCategoryEl = document.querySelector('#category-filters .active');
    
    if (activeCategoryEl) { // VERFICA FILTROS ATIVOS
        const activeCategory = activeCategoryEl.dataset.cat;
        
        if (activeCategory !== 'all') {
            if (activeCategory === 'children') {   
                filteredList = filteredList.filter(p => p.category.startsWith('children-'));
            } else if (activeCategory === 'man') {  
                filteredList = filteredList.filter(p => p.category.startsWith('man-'));
            } else if (activeCategory === 'woman') {  
                filteredList = filteredList.filter(p => p.category.startsWith('woman-'));
            }
            else {
                filteredList = filteredList.filter(p => p.category === activeCategory);
            }
        }
    }
    
    // FILTRO PARA PREÇO
    const activePriceRange = document.querySelector('input[name="price_range"]:checked').value;
    if (activePriceRange !== 'all') {
        const [minStr, maxStr] = activePriceRange.split('-');
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        filteredList = filteredList.filter(p => p.price >= min && p.price <= max);
    }

    // FILTRAGEM POR NOME E DESCRIÇAO DO PRODUTO
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm) {
    
        filteredList = filteredList.filter(p => 
            (p.name && p.name.toLowerCase().includes(searchTerm)) || 
            (p.desc && p.desc.toLowerCase().includes(searchTerm))
        );
    }

    // ORDEM DA LISTAGEM DE PRODUTOS
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

// FUNCAO PARA A NAVBAR FILTRAR A CATEGORIA ATRAVES DA URL
function applyCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('cat');
    
    if (categoryFromURL) {
       
        const sidebarLink = document.querySelector(`#category-filters a[data-cat="${categoryFromURL}"]`);
        
        if (sidebarLink) {
            
            document.querySelector('#category-filters a.active').classList.remove('active');
          
            sidebarLink.classList.add('active');
        }
    }
}

// TORNA ATIVO OS LINKS DE CATEGORIAS PARA FILTRAGEM DOS PRODUTOS
document.getElementById('category-filters').addEventListener('click', e=>{
    if(e.target && e.target.dataset.cat !== undefined){
        e.preventDefault();
        document.querySelectorAll('#category-filters a').forEach(el=>el.classList.remove('active'));
        e.target.classList.add('active');
        performFilter();
    }
});

document.getElementById('sort').addEventListener('change', performFilter); 

document.getElementById('price-filters').addEventListener('change', performFilter);

// FILTRAGEM DO PRODUTO ENQUANTO DIGITA NA BARRA DE BUSCA
document.getElementById('search-input').addEventListener('input', performFilter);


// VERIFICA URL E APLICA UM FILTRO
applyCategoryFromURL(); 
performFilter();   
document.getElementById('year2').textContent = new Date().getFullYear();