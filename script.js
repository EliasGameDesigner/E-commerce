document.addEventListener('DOMContentLoaded', function () {

    // --- Funções Globais do Carrinho ---
    const getCartItems = () => {
        const cartItemsJSON = localStorage.getItem('cartItems');
        return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
    };

    const saveCartItems = (items) => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    };

    // --- Lógica comum a todas as páginas (Navegação) ---
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.addEventListener('click', function () {
            window.location.href = 'carrinho.html';
        });
    }

    const btnInicial = document.getElementById("time");
        if (btnInicial) {
            btnInicial.addEventListener('click', function () {
                window.location.href = 'index.html';
            });
    }

    // --- LÓGICA DA PÁGINA INICIAL ---

    // --- Slideshow de Promoções ---
    const promoContainer = document.getElementById('promoConteiner');
    if (promoContainer) {
        let slideIndex = 1;
        let slideInterval; 

        const showSlides = (n) => {
            let i;
            const slides = document.getElementsByClassName("mySlides");
            const dots = document.getElementsByClassName("dot");

            if (n > slides.length) { slideIndex = 1; }
            if (n < 1) { slideIndex = slides.length; }

            for (i = 0; i < slides.length; i++) {
                if(slides[i]) slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                if(dots[i]) dots[i].className = dots[i].className.replace(" active", "");
            }

            if (slides[slideIndex - 1]) {
                slides[slideIndex - 1].style.display = "block";
            }
            if (dots[slideIndex - 1]) {
                dots[slideIndex - 1].className += " active";
            }
        };

        const startSlideInterval = () => {
            slideInterval = setInterval(() => {
                plusSlides(1);
            }, 4000);
        };
        
        window.plusSlides = (n) => {
            clearInterval(slideInterval);
            showSlides(slideIndex += n);
            startSlideInterval();
        };

        window.currentSlide = (n) => {
            clearInterval(slideInterval);
            showSlides(slideIndex = n);
            startSlideInterval();
        };

        showSlides(slideIndex);
        startSlideInterval();
    }
    
    // --- Carrossel de Categorias ---
    const categoriasLista = document.getElementById('categorias-lista');
    if (categoriasLista) {
        const btnEsquerda = document.getElementById('botaoEsquerda');
        const btnDireita = document.getElementById('botaoDireita');

        btnEsquerda.addEventListener('click', () => {
            // A quantidade de scroll pode ser ajustada
            categoriasLista.scrollLeft -= 200; 
        });

        btnDireita.addEventListener('click', () => {
            // A quantidade de scroll pode ser ajustada
            categoriasLista.scrollLeft += 200;
        });
    }

    // --- Lógica de Histórico de Pesquisa ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const ultimasPesquisasContainer = document.getElementById('ultimas-pesquisas-lista');

    const getSearchHistory = () => {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    };

    const saveSearchHistory = (term) => {
        if (!term.trim()) return; // Não salva termos vazios
        let history = getSearchHistory();
        // Remove o termo se já existir para adicioná-lo no topo
        history = history.filter(item => item !== term);
        // Adiciona o novo termo no início
        history.unshift(term);
        // Limita o histórico a, por exemplo, 5 itens
        history = history.slice(0, 5); 
        localStorage.setItem('searchHistory', JSON.stringify(history));
    };

    const renderSearchHistory = () => {
        if (!ultimasPesquisasContainer) return;
        
        const history = getSearchHistory();
        ultimasPesquisasContainer.innerHTML = ''; // Limpa o container

        if (history.length === 0) {
            ultimasPesquisasContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhuma pesquisa recente.</p>';
            return;
        }

        history.forEach(term => {
            const productElement = document.createElement('li');
            productElement.className = 'produtoItemPai';
            productElement.innerHTML = `
                <a href="#" class="produtoItem">
                    <img src="https://placehold.co/100x100/EEE/333?text=${encodeURIComponent(term)}" alt="Pesquisa por ${term}" />
                    <div>
                        <h3>${term}</h3>
                        <p>Ver resultados</p>
                    </div>
                </a>
            `;
            ultimasPesquisasContainer.appendChild(productElement);
        });
    };

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            saveSearchHistory(searchInput.value);
            renderSearchHistory();
            // Opcional: limpar o input após a pesquisa
            // searchInput.value = ''; 
        });
    }

    // Renderiza o histórico ao carregar a página
    renderSearchHistory();


    // --- LÓGICA ESPECÍFICA PARA OUTRAS PÁGINAS ---

    // (O restante do seu código para as páginas de produto, carrinho e checkout permanece aqui)
    // --- PÁGINA DE PRODUTO ---
    if (document.body.classList.contains('produto-page')) {
        const thumbnails = document.querySelectorAll('.itemFoto img');
        const mainImage = document.querySelector('#fotoAtual img');

        if (mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function () {
                    mainImage.src = this.src;
                });
            });

            const zoomModal = document.createElement('div');
            zoomModal.id = 'zoomModal'; 
            zoomModal.innerHTML = `<img style="max-width: 90%; max-height: 90%; box-shadow: 0 0 20px white; background-color: white;">`;
            Object.assign(zoomModal.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.8)', display: 'none', justifyContent: 'center',
                alignItems: 'center', zIndex: '9999'
            });
            document.body.appendChild(zoomModal);
            const zoomImg = zoomModal.querySelector('img');

            mainImage.addEventListener('click', function () {
                zoomImg.src = this.src;
                zoomModal.style.display = 'flex';
            });

            zoomModal.addEventListener('click', function () {
                zoomModal.style.display = 'none';
            });
        }

        const addToCartButton = document.getElementById('addToCartButton');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', (event) => {
                event.preventDefault();

                const productName = document.getElementById('productName').textContent;
                const productPrice = parseFloat(document.getElementById('preco').textContent.replace('R$', '').replace(',', '.'));
                const productDescription = document.getElementById('textoDesc').textContent;
                const productImageSrc = document.getElementById('mainProductImage').src;

                let cartItems = getCartItems();
                const existingItemIndex = cartItems.findIndex(item => item.name === productName);

                if (existingItemIndex > -1) {
                    cartItems[existingItemIndex].quantity += 1;
                } else {
                    cartItems.push({
                        id: `item${Date.now()}`, name: productName, description: productDescription,
                        price: productPrice, quantity: 1, imageSrc: productImageSrc
                    });
                }

                saveCartItems(cartItems);
                alert('Item adicionado ao carrinho!'); 
            });
        }
    }

    // --- PÁGINA DO CARRINHO ---
    if (document.body.classList.contains('carrinho-page')) {
        const itemsList = document.getElementById('items');
        const totalDisplay = document.querySelector('#revisao #precos h1');

        const updateCartPage = () => {
            const cartItems = getCartItems();
            let total = 0;
            itemsList.innerHTML = '';

            if (cartItems.length === 0) {
                itemsList.innerHTML = '<p style="text-align: center; margin-top: 20px;">Seu carrinho está vazio.</p>';
                totalDisplay.textContent = `Total: R$${total.toFixed(2).replace('.', ',')}`;
            } else {
                cartItems.forEach(item => {
                    total += item.price * item.quantity;
                    const itemElement = document.createElement('li');
                    itemElement.classList.add('item');
                    itemElement.dataset.id = item.id;
                    
                    itemElement.innerHTML = `
                        <img class="item-image" src="${item.imageSrc}" alt="Imagem do ${item.name}" />
                        <div class="item-conteudo">
                            <div class="titulo-item">
                                <h1 class="item-name">${item.name}</h1>
                                <p class="item-description">${item.description}</p>
                            </div>
                            <div class="botoes-carrinho">
                                <div>
                                    <label for="quantidade-${item.id}">Quantidade:</label>
                                    <input type="number" id="quantidade-${item.id}" class="quantidade-input" value="${item.quantity}" min="1">
                                </div>
                                <p class="item-display-price">Preço: R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                <button class="remove-item">Remover</button>
                            </div>
                        </div>`;
                    itemsList.appendChild(itemElement);
                });
            }
            if(totalDisplay) {
                totalDisplay.textContent = `Total: R$${total.toFixed(2).replace('.', ',')}`;
            }
        };

        itemsList.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item')) {
                const itemIdToRemove = event.target.closest('.item').dataset.id;
                let cartItems = getCartItems().filter(item => item.id !== itemIdToRemove);
                saveCartItems(cartItems);
                updateCartPage();
            }
        });

        itemsList.addEventListener('change', (event) => {
            if (event.target.classList.contains('quantidade-input')) {
                const itemIdToUpdate = event.target.closest('.item').dataset.id;
                const newQuantity = parseInt(event.target.value);
                if (newQuantity < 1) { event.target.value = 1; return; }

                let cartItems = getCartItems();
                const itemIndex = cartItems.findIndex(item => item.id === itemIdToUpdate);
                if (itemIndex > -1) {
                    cartItems[itemIndex].quantity = newQuantity;
                    saveCartItems(cartItems);
                    updateCartPage();
                }
            }
        });

        const btnComprar = document.getElementById('btn-comprar');
        if (btnComprar) {
            btnComprar.addEventListener('click', () => window.location.href = 'checkout.html');
        }

        updateCartPage();
    }

    // --- PÁGINA DE CHECKOUT ---
    if (document.body.classList.contains('checkout-page')) {
        const checkoutItemsList = document.querySelector('#carrinho-revisao #items');
        const checkoutTotalDisplay = document.querySelector('#carrinho-revisao #precos strong');

        const loadCheckout = () => {
            const cartItems = getCartItems();
            let subtotal = 0;
            checkoutItemsList.innerHTML = '';

            if (cartItems.length > 0) {
                cartItems.forEach(item => {
                    subtotal += item.price * item.quantity;
                    const itemElement = document.createElement('li');
                    itemElement.classList.add('item');
                    itemElement.innerHTML = `
                        <img class="item-image" src="${item.imageSrc}" alt="${item.name}" />
                        <div class="item-conteudo">
                            <h1 class="item-name">${item.name}</h1>
                            <p>Qtd: ${item.quantity}</p>
                            <p class="item-display-price">R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        </div>`;
                    checkoutItemsList.appendChild(itemElement);
                });
            } else {
                checkoutItemsList.innerHTML = '<p>Seu carrinho está vazio.</p>';
            }

            const imposto = 100.00;
            const frete = 90.00;
            const totalFinal = subtotal + imposto + frete;
            
            document.querySelector('#carrinho-revisao #precos p:nth-of-type(1)').textContent = `Imposto: R$${imposto.toFixed(2).replace('.', ',')}`;
            document.querySelector('#carrinho-revisao #precos p:nth-of-type(2)').textContent = `Frete: R$${frete.toFixed(2).replace('.', ',')}`;
            checkoutTotalDisplay.textContent = `Total: R$${totalFinal.toFixed(2).replace('.', ',')}`;
        };
        
        loadCheckout();

        window.prosseguirParaPagamento = function() {
            document.getElementById('carrinho-revisao').style.display = 'none';
            document.getElementById('metodos-pagamento').style.display = 'block';
        };

        window.confirmarPagamento = function() {
            if (document.querySelector('input[name="metodoPagamento"]:checked')) {
                document.getElementById('metodos-pagamento').style.display = 'none';
                document.getElementById('confirmacao').style.display = 'block';
                localStorage.removeItem('cartItems');
            } else {
                alert('Por favor, selecione um método de pagamento.');
            }
        };
    }
});

