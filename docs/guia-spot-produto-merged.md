# Guia de Implementação - Spot Produto Merged

## Visão Geral

Este documento descreve como implementar o spot produto merged que combina os elementos da Wake Commerce com nosso sistema de cards e carrosséis de produtos.

## Estrutura do Componente

### Estrutura HTML Principal

```html
<li class="item nth-child-2n spot fbits-spot-conteudo" id="produto-spot-item-@id">
    <div class="item-area">
        <div class="product-image-area">
            <a href="@link" class="product-image">
                <img src="@imagem" alt="@titulo">
            </a>
            <div class="etiquetas-spot">
                <div class="product-badge product-badge--discount">@desconto% OFF</div>
            </div>
        </div>
        
        <div class="details-area fbits-spot-conteudo">
            <h2 class="product-name"><a href="@link" title="@titulo">@titulo</a></h2>
            <div class="info">@informacoes</div>
            <div class="price-box">
                <div class="product-price--current">@preco</div>
            </div>
            <div class="actions">
                <a class="addtowishlist" href="#">
                    <i class="fas fa-heart"></i>
                </a>
                <a class="addtocart" href="#">
                    <i class="fas fa-shopping-cart"></i>
                </a>
                <a class="comparelink" href="#">
                    <i class="fas fa-sync"></i>
                </a>
            </div>
        </div>
    </div>
</li>
```

### Para Produtos Indisponíveis

```html
<li class="item nth-child-2n spot fbits-spot-conteudo fbits-spot-indisponivel" id="produto-spot-item-@id">
    <div class="item-area">
        <div class="product-image-area">
            <a href="@link" class="product-image">
                <img src="@imagem" alt="@titulo">
            </a>
            <div class="etiquetas-spot">
                <div class="product-badge product-badge--discount">Esgotado</div>
            </div>
        </div>
        
        <div class="details-area fbits-spot-conteudo">
            <h2 class="product-name"><a href="@link" title="@titulo">@titulo</a></h2>
            <div class="actions">
                <div class="spotIndisponivel">
                    Produto Indisponível
                    <br />
                    <a href="#" class="btn btn-secondary">Avise-me quando estiver disponível</a>
                </div>
            </div>
        </div>
    </div>
</li>
```

## Classes CSS Disponíveis

### Classes Principais

| Classe | Descrição |
|--------|-----------|
| `.spot` | Classe principal do spot produto |
| `.item-area` | Container principal do item |
| `.product-image-area` | Área da imagem do produto |
| `.etiquetas-spot` | Container para etiquetas/promoções |
| `.details-area` | Área de detalhes do produto |
| `.product-name` | Nome do produto |
| `.info` | Informações adicionais |
| `.price-box` | Container de preços |
| `.actions` | Área de ações (wishlist, carrinho, comparar) |

### Classes de Estado

| Classe | Descrição |
|--------|-----------|
| `.fbits-spot-indisponivel` | Indica produto indisponível |
| `.added` | Estado quando item é adicionado ao carrinho |

## Integração com Carrossel

### Estrutura do Carrossel

```html
<div class="products-carousel-container js-product-carousel" aria-roledescription="carousel" aria-label="Nome do Carrossel">
    <button class="carousel-nav carousel-nav--prev" aria-label="Anterior">
        <i class="fas fa-chevron-left"></i>
    </button>
    
    <div class="products-carousel-wrapper">
        <div class="products-carousel-track" id="productsTrack">
            <!-- Spots de produtos aqui -->
        </div>
    </div>
    
    <button class="carousel-nav carousel-nav--next" aria-label="Próximo">
        <i class="fas fa-chevron-right"></i>
    </button>
    
    <div class="carousel-dots" id="carouselDots"></div>
</div>
```

### Itens do Carrossel

```html
<div class="product-slide">
    <!-- Spot produto aqui -->
</div>
```

## Variáveis CSS Disponíveis

### Cores Principais

```css
:root {
    --cor-primaria: #002945;
    --cor-primaria-escura: #134a6b;
    --cor-secundaria: #CA69F5;
    --cor-destaque: #4CAF50;
    --cor-erro: #dc3545;
    
    --cor-texto-primaria: #333;
    --cor-texto-secundaria: #666;
    
    --cor-borda-clara: #e9ecef;
    --cor-borda-media: #ddd;
}
```

### Espaçamentos

```css
:root {
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
}
```

### Bordas e Sombras

```css
:root {
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## Funcionalidades JavaScript

### Adição ao Carrinho

```javascript
// Adicionar evento de clique aos botões de adicionar ao carrinho
const addToCartButtons = document.querySelectorAll('.addtocart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Animação de feedback
        this.classList.add('added');
        this.innerHTML = '<i class="fas fa-check"></i>';
        
        // Reset após animação
        setTimeout(() => {
            this.classList.remove('added');
            this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }, 2000);
        
        // Lógica de adição ao carrinho
        // adicionarAoCarrinho(produtoId);
    });
});
```

### Navegação do Carrossel

```javascript
// Função para inicializar carrossel
function initCarousel(carousel) {
    const track = carousel.querySelector('.products-carousel-track');
    const slides = carousel.querySelectorAll('.product-slide');
    const prevBtn = carousel.querySelector('.carousel-nav--prev');
    const nextBtn = carousel.querySelector('.carousel-nav--next');
    
    let currentIndex = 0;
    const itemsPerView = getItemsPerView();
    
    function next() {
        if (currentIndex < slides.length - itemsPerView) {
            currentIndex += itemsPerView;
            updateCarousel();
        }
    }
    
    function prev() {
        if (currentIndex > 0) {
            currentIndex -= itemsPerView;
            updateCarousel();
        }
    }
    
    function updateCarousel() {
        const slideWidth = 100 / itemsPerView;
        const offset = -(currentIndex * slideWidth);
        track.style.transform = `translateX(${offset}%)`;
    }
}
```

## Integração com Wake Commerce

### Elementos da Wake que Devem Ser Mantidos

```html
<!-- Manter para compatibilidade com Wake -->
<FBITS:ImagemProduto />
<FBITS:Titulo />
<FBITS:Preco />
<FBITS:ParcelamentoFormaPagamento />
<FBITS:BotoesComprar />
<FBITS:Etiquetas />
<FBITS:LinkProdutoIndisponivel />
```

### Mapeamento de Classes

| Classe Wake | Classe Merged |
|-------------|---------------|
| `fbits-spot-conteudo` | Mantida |
| `fbits-spot-indisponivel` | Mantida |
| `product-image` | Mantida |
| `product-name` | Mantida |
| `price-box` | Mantida |
| `actions` | Mantida |

## Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
    .product-slide {
        flex: 0 0 100%;
    }
    
    .actions {
        flex-direction: column;
    }
}

/* Tablet */
@media (max-width: 768px) {
    .product-slide {
        flex: 0 0 calc(100% / 2);
    }
}

/* Desktop pequeno */
@media (max-width: 1200px) {
    .product-slide {
        flex: 0 0 calc(100% / 3);
    }
}

/* Desktop grande */
@media (min-width: 1201px) {
    .product-slide {
        flex: 0 0 calc(100% / 4);
    }
}
```

## Performance

### Otimizações

1. **Lazy Loading de Imagens**
```html
<img src="@imagem" alt="@titulo" loading="lazy">
```

2. **Minimização de CSS/JS**
3. **Otimização de imagens**
4. **Uso de CDN para assets**

## Acessibilidade

### Atributos ARIA

```html
<div class="products-carousel-container js-product-carousel" 
     aria-roledescription="carousel" 
     aria-label="Produtos em Destaque">
     
    <button class="carousel-nav carousel-nav--prev" 
            aria-label="Anterior">
        <i class="fas fa-chevron-left" aria-hidden="true"></i>
    </button>
    
    <!-- ... -->
    
    <div class="carousel-dots" role="tablist" aria-label="Seletores de slide">
        <button class="carousel-dot" 
                role="tab" 
                aria-selected="true" 
                aria-label="Slide 1"></button>
    </div>
</div>
```

### Navegação por Teclado

```javascript
// Suporte a teclado
carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
});
```

## Testes Necessários

### Funcionalidade

- [ ] Adição de produtos ao carrinho
- [ ] Navegação do carrossel
- [ ] Links de wishlist e comparar
- [ ] Exibição de produtos indisponíveis
- [ ] Funcionalidade de "Avise-me quando disponível"

### Responsividade

- [ ] Layout mobile
- [ ] Layout tablet
- [ ] Layout desktop
- [ ] Comportamento do carrossel em diferentes tamanhos

### Compatibilidade

- [ ] Integração com elementos da Wake
- [ ] Preservação de funcionalidades existentes
- [ ] Compatibilidade cross-browser

## Troubleshooting

### Problemas Comuns

1. **Carrossel não funciona**
   - Verificar se o JavaScript está carregado
   - Confirmar estrutura HTML correta
   - Validar IDs únicos

2. **Estilos não aplicados**
   - Verificar carregamento do CSS
   - Confirmar especificidade dos seletores
   - Validar sintaxe CSS

3. **Integração com Wake falhando**
   - Verificar manutenção de elementos da Wake
   - Confirmar mapeamento correto de classes
   - Validar compatibilidade de funcionalidades

## Próximos Passos

1. **Implementar em ambiente de testes**
2. **Validar funcionalidades com equipe**
3. **Realizar testes cross-browser**
4. **Documentar feedback e ajustes**
5. **Preparar para deploy em produção**