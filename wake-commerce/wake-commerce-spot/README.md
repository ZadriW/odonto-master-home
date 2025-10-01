# Wake Commerce Spot - Fusão com Projeto Base

## Descrição

Este diretório contém a fusão do código do **Spot do produto da Wake Commerce** com os elementos fundamentais do **projeto base Odonto Master**. A fusão mantém a estrutura e funcionalidades do spot original da Wake Commerce, adaptando-as para funcionar com o sistema e design do projeto base.

## Arquivos Fusionados

### 1. `produto-spot.html`
**Fusão do template HTML**
- **Origem Wake Commerce**: Template de spot de produto com componentes FBITS
- **Origem Projeto Base**: Estrutura completa da página produto.html
- **Resultado**: Página híbrida que mantém a estrutura do spot da Wake Commerce integrada à estrutura completa do projeto base

**Principais adaptações:**
- Componentes FBITS convertidos para HTML padrão
- Manutenção da estrutura de `<li class="item spot">` do Wake Commerce
- Integração com header, footer e navegação do projeto base
- Adição de seção expandida com galeria e funcionalidades avançadas
- Preservação da lógica de disponibilidade de produtos

### 2. `produto-spot.css`
**Fusão dos estilos CSS**
- **Origem Wake Commerce**: Classes específicas do spot (.item, .spot, .fbits-spot-conteudo, etc.)
- **Origem Projeto Base**: Sistema de design e variáveis CSS
- **Resultado**: Estilos que combinam o visual do spot da Wake Commerce com o design system do projeto base

**Principais adaptações:**
- Importação do style.css base do projeto
- Preservação das classes originais do Wake Commerce
- Integração com variáveis CSS do projeto base (--cor-primaria, --cor-destaque, etc.)
- Adição de estilos para funcionalidades expandidas
- Sistema responsivo mantido
- Hover effects e animações preservados

### 3. `produto-spot.js`
**Fusão das funcionalidades JavaScript**
- **Origem Wake Commerce**: Lógica de spot de produto e interações
- **Origem Projeto Base**: Sistema de carrinho, banco de dados de produtos e funcionalidades avançadas
- **Resultado**: JavaScript que combina a interatividade do spot com as funcionalidades robustas do projeto base

**Principais adaptações:**
- Inicialização compatível com sistema do projeto base
- Integração com `window.app.productDB` para dados de produtos
- Funcionalidades de carrinho preservadas
- Botões do spot funcionais (adicionar ao carrinho, comprar agora, wishlist, comparar)
- Sistema de notificações adaptado
- Funcionalidades expandidas (galeria, abas, calculadora de frete, avaliações)

## Estrutura da Fusão

### Seção Principal - Spot Wake Commerce
```html
<div class="fbits-spot-container">
    <li class="item spot spot-hover spot-destaque spot-disponivel">
        <!-- Área da imagem com etiquetas -->
        <div class="product-image-area">
            <!-- Imagem principal -->
            <!-- Etiquetas de desconto e destaque -->
        </div>

        <!-- Área de detalhes -->
        <div class="details-area fbits-spot-conteudo">
            <!-- Nome do produto -->
            <!-- Informações -->
            <!-- Preços (original, atual, parcelamento, boleto) -->
            <!-- Botões de ação -->
        </div>
    </li>
</div>
```

### Seção Expandida - Projeto Base
```html
<div class="product-spot-expanded">
    <!-- Galeria expandida -->
    <section class="product-gallery-expanded">
        <!-- Imagem principal grande -->
        <!-- Thumbnails navegáveis -->
    </section>

    <!-- Informações expandidas -->
    <section class="product-info-expanded">
        <!-- Disponibilidade -->
        <!-- Variações -->
        <!-- Controles de quantidade -->
        <!-- Calculadora de frete -->
    </section>
</div>
```

## Funcionalidades Implementadas

### Do Wake Commerce:
- ✅ Estrutura de spot de produto
- ✅ Sistema de etiquetas (desconto, destaque)
- ✅ Lógica de produto disponível/indisponível
- ✅ Preços com parcelamento e desconto boleto/PIX
- ✅ Botões de ação (carrinho, compra, wishlist, comparar)
- ✅ Hover effects e animações
- ✅ Classes CSS originais preservadas

### Do Projeto Base:
- ✅ Integração com banco de dados de produtos
- ✅ Sistema de carrinho completo
- ✅ Galeria de imagens expandida
- ✅ Sistema de variações de produto
- ✅ Calculadora de frete
- ✅ Sistema de abas (descrição, especificações, avaliações)
- ✅ Formulário de avaliação
- ✅ Design responsivo
- ✅ Integração com header/footer/navegação

### Novas Funcionalidades da Fusão:
- ✅ Spot responsivo e adaptável
- ✅ Transição suave entre visualização compact e expandida
- ✅ Notificações personalizadas do spot
- ✅ Sistema híbrido de precificação
- ✅ Integração com sistema de estoque
- ✅ Funcionalidade "Avise-me quando disponível"

## Como Usar

1. **Incluir os arquivos na página:**
```html
<link rel="stylesheet" href="/wake-commerce-spot/produto-spot.css">
<script src="/wake-commerce-spot/produto-spot.js"></script>
```

2. **Navegar para a página:**
```
/wake-commerce-spot/produto-spot.html?id=PRODUCT_ID&category=CATEGORY&brand=BRAND
```

3. **Dependências:**
- Sistema base do projeto (style.css, script.js)
- Font Awesome para ícones
- Sistema de banco de dados de produtos (`window.app.productDB`)

## Compatibilidade

- ✅ Mantém compatibilidade com sistemas Wake Commerce
- ✅ Funciona com banco de dados do projeto base
- ✅ Design responsivo para todos os dispositivos
- ✅ Acessibilidade preservada
- ✅ SEO-friendly

## Observações Técnicas

- **Componentes FBITS**: Convertidos para HTML padrão mantendo funcionalidade
- **Classes CSS**: Preservadas para compatibilidade com temas Wake Commerce
- **JavaScript**: Modular e não-destrutivo, integra com sistema existente
- **Dados**: Funciona com dados reais do banco ou fallback para dados fictícios
- **Performance**: Otimizado para carregamento rápido

## Estrutura de Pastas
```
wake-commerce-spot/
├── produto-spot.html    # Página principal fusionada
├── produto-spot.css     # Estilos fusionados
├── produto-spot.js      # JavaScript fusionado
└── README.md           # Esta documentação
```

---

**Desenvolvido como fusão dos sistemas Wake Commerce e Projeto Base Odonto Master**