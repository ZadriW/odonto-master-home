# Refatoração de Templates - Wake Commerce

## Estrutura Atual do Projeto

```
code/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── pages/
│   ├── home/
│   │   └── index.html
│   ├── cirurgia/
│   │   ├── cirurgia.html
│   │   ├── cirurgia.css
│   │   └── cirurgia.js
│   ├── dentistica/
│   │   ├── dentistica.html
│   │   ├── dentistica.css
│   │   └── dentistica.js
│   └── odontoverse/
│       └── odontoverse.html
```

## Componentes Essenciais Identificados

### 1. Header Principal
- Logo
- Barra de busca
- Menu de navegação
- Carrinho de compras
- Área de login

### 2. Sistema de Filtros
- Filtros por categoria
- Filtros por marca
- Filtros por preço

### 3. Grid de Produtos
- Cards de produtos
- Sistema de paginação/carrossel

### 4. Footer
- Links institucionais
- Informações de contato
- Redes sociais
- Formas de pagamento

## Estratégia de Refatoração

### 1. Consolidar CSS
- Manter variáveis CSS globais no style.css
- Criar componentes reutilizáveis
- Remover duplicações

### 2. Modularizar JavaScript
- Criar módulos para cada funcionalidade
- Implementar sistema de eventos
- Padronizar componentes

### 3. Otimizar HTML
- Criar templates reutilizáveis
- Implementar boas práticas de semântica
- Garantir acessibilidade

## Próximos Passos

1. Analisar templates da Wake Commerce
2. Identificar componentes que devem ser mantidos
3. Mapear diferenças entre os sistemas
4. Criar plano de migração
5. Implementar fusão incremental