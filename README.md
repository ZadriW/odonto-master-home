# Sistema de Banco de Dados de Produtos - Odonto Master

Este documento descreve o sistema de banco de dados de produtos implementado para garantir consistência nas imagens e informações dos produtos em todo o e-commerce Odonto Master.

## Estrutura do Banco de Dados

O banco de dados de produtos é mantido no arquivo `data/products.json` e contém as seguintes informações para cada produto:

```json
{
  "prod1": {
    "id": "prod1",
    "name": "Nome do Produto",
    "price": 18990,
    "discount": 27,
    "image": "/images/nome-da-imagem.png",
    "category": "Categoria do Produto",
    "brand": "Marca do Produto",
    "description": "Descrição do produto"
  }
}
```

**Importante:** O preço é armazenado em centavos (ex: R$ 189,90 = 18990).

## Funcionalidades Implementadas

### 1. Consistência de Imagens
- As imagens dos produtos são mantidas consistentes em todas as páginas:
  - Página inicial (carrosséis)
  - Página de checkout
  - Página de confirmação de pedido
  - Página de detalhes do produto

### 2. Integração com Páginas Existentes
- **Página Inicial (`/pages/home/index.html`)**: Produtos renderizados diretamente no HTML com imagens reais
- **Página de Checkout (`/pages/checkout/checkout.html`)**: Exibe imagens reais dos produtos no carrinho
- **Página de Confirmação (`/pages/confirmacao/index.html`)**: Mostra imagens reais dos itens do pedido
- **Página de Produto (`/pages/produto/produto.html`)**: Carrega informações e imagens reais com base no ID

### 3. Persistência de Dados
- O sistema utiliza o localStorage para manter os dados do carrinho
- As informações do produto são mantidas consistentes durante todo o fluxo de compra

## Arquivos Atualizados

### JavaScript
- `assets/js/script.js`: Sistema de banco de dados de produtos
- `pages/checkout/checkout.js`: Exibição de imagens no checkout
- `pages/confirmacao/confirmacao.js`: Exibição de imagens na confirmação
- `pages/produto/produto.js`: Carregamento de informações reais do produto

### HTML
- `pages/home/index.html`: Produtos com imagens reais renderizadas no HTML
- `pages/checkout/checkout.html`: Atualizado para incluir script principal
- `pages/confirmacao/index.html`: Exibição de imagens reais no resumo do pedido
- `pages/produto/produto.html`: Exibição de informações reais do produto

## Como Adicionar Novos Produtos

Para adicionar novos produtos ao sistema:

1. Atualize o arquivo `data/products.json` com as informações do novo produto
2. Garanta que a imagem esteja disponível na pasta `/images/`
3. Use o mesmo formato de estrutura de dados para manter a consistência

## Funcionalidades do Carrinho

O sistema mantém a integridade dos dados do carrinho:
- Adição de produtos mantém informações consistentes
- Atualização de quantidades
- Remoção de itens
- Cálculo de totais

## Considerações Técnicas

1. O sistema tenta carregar os dados do `products.json` primeiro, revertendo para dados padrão caso o arquivo não esteja disponível
2. A imagem padrão é usada como fallback em caso de erro no carregamento
3. O sistema é compatível com a estrutura de URLs existente para navegação entre páginas de produtos

## Benefícios

- **Consistência Visual**: As mesmas imagens são exibidas em todas as páginas
- **Facilidade de Manutenção**: Atualização centralizada dos dados dos produtos
- **SEO**: Produtos com informações consistentes ajudam no ranqueamento
- **Experiência do Usuário**: Imagens reais aumentam a confiança do cliente