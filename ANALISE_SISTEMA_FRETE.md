# 📦 Análise Completa: Sistema de Cotação Multi-Frete (Wake Commerce)

## 1. Visão Geral do Sistema

O sistema de **Multi-Frete** do Wake Commerce permite que diferentes **Centros de Distribuição (CDs)** sejam responsáveis pelo envio de produtos diferentes no mesmo pedido. Cada CD pode ter suas próprias opções de frete, e o cliente deve selecionar uma opção para cada CD.

### Quando usar:
- ✅ Lojas com **Multi-frete ativo** no admin
- ✅ Produtos de diferentes CDs no mesmo carrinho
- ✅ Necessidade de mostrar opções de frete separadas por CD

### Quando NÃO usar:
- ❌ Lojas com apenas um CD
- ❌ Todos os produtos vêm do mesmo CD
- ❌ Multi-frete desativado no admin

---

## 2. Query: `shippingQuoteGroups`

### 2.1. Estrutura da Query

```graphql
query ShippingQuoteGroups($checkoutId: Uuid!, $useSelectedAddress: Boolean) {
  shippingQuoteGroups(
    checkoutId: $checkoutId
    useSelectedAddress: $useSelectedAddress
  ) {
    distributionCenter {
      id              # ID codificado do CD (String)
      sellerName      # Nome do seller (String | null)
      name            # Nome do Centro de Distribuição (String)
    }
    shippingQuotes {
      name            # Nome da transportadora (String)
      shippingQuoteId # ID único da cotação (UUID)
      type            # Tipo: "Retirada" ou entrega normal (String)
      value           # Valor do frete (Float)
    }
  }
}
```

### 2.2. Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `checkoutId` | `Uuid!` | ✅ Sim | ID do checkout que será usado para calcular as cotações |
| `useSelectedAddress` | `Boolean` | ❌ Não | Se `true`, usa o endereço já selecionado no checkout |

### 2.3. Campos de Retorno

#### `distributionCenter` (objeto)
Identifica o CD responsável pela cotação daquele grupo de produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `String` | ID codificado do centro de distribuição |
| `sellerName` | `String \| null` | Nome do seller, caso o CD esteja vinculado a um seller formal. Pode ser `null` |
| `name` | `String` | **Nome do Centro de Distribuição (CD)**. Preenchido mesmo que não haja seller cadastrado |

> 💡 **Importante**: O campo `name` foi adicionado para permitir identificar o CD mesmo quando não há seller formal vinculado. Ele é útil em operações onde cada CD atua como seller internamente, mas não está registrado como tal no sistema.

#### `shippingQuotes` (array)
Array de cotações disponíveis para aquele CD. Retorno igual ao da query `shippingQuotes`.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | `String` | Nome da transportadora/opção de entrega |
| `shippingQuoteId` | `UUID` | ID único da cotação (usado na mutation) |
| `type` | `String` | Tipo: `"Retirada"` para retirada na loja, ou nome da transportadora |
| `value` | `Float` | Valor do frete em reais |

### 2.4. Exemplo de Resposta

```json
{
  "data": {
    "shippingQuoteGroups": [
      {
        "distributionCenter": {
          "id": "eyJFbnRpdHkiOiJEaXN0cmlidXRpb25DZW50ZXIiLCJJZCI6MjV9",
          "sellerName": null,
          "name": "CD Padrão"
        },
        "shippingQuotes": [
          {
            "name": "Awake",
            "shippingQuoteId": "35baf232-9a7c-43b5-95ec-452ac4df78bd",
            "type": "Retirada",
            "value": 0
          },
          {
            "name": "Correios PAC",
            "shippingQuoteId": "12b445c1-c854-4450-910b-2981ec5843a4",
            "type": "Correios",
            "value": 25.90
          }
        ]
      },
      {
        "distributionCenter": {
          "id": "eyJFbnRpdHkiOiJEaXN0cmlidXRpb25DZW50ZXIiLCJJZCI6MjZ9",
          "sellerName": "Seller ABC",
          "name": "CD São Paulo"
        },
        "shippingQuotes": [
          {
            "name": "Transportadora XYZ",
            "shippingQuoteId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "type": "Transportadora",
            "value": 15.00
          }
        ]
      }
    ]
  }
}
```

---

## 3. Mutation: `checkoutSelectShippingQuote`

### 3.1. Estrutura da Mutation (CD Único)

```graphql
mutation CheckoutSelectShippingQuote(
  $checkoutId: Uuid!, 
  $shippingQuoteId: Uuid!
) {
  checkoutSelectShippingQuote(
    checkoutId: $checkoutId
    shippingQuoteId: $shippingQuoteId
  ) {
    cep
    checkoutId
    shippingFee
    selectedShipping {
      deadline
      name
      shippingQuoteId
      type
      value
    }
  }
}
```

### 3.2. Estrutura da Mutation (Multi-CD)

```graphql
mutation CheckoutSelectShippingQuote(
  $checkoutId: Uuid!, 
  $shippingQuoteId: Uuid!,
  $distributionCenterId: String
) {
  checkoutSelectShippingQuote(
    checkoutId: $checkoutId
    shippingQuoteId: $shippingQuoteId
    distributionCenterId: $distributionCenterId
  ) {
    cep
    checkoutId
    shippingFee
    selectedShipping {
      deadline
      name
      shippingQuoteId
      type
      value
    }
    selectedShippingGroups {
      distributionCenter {
        id
        sellerName
      }
      selectedShipping {
        deadline
        name
        shippingQuoteId
        type
        value
      }
      products {
        productVariantId
      }
    }
  }
}
```

### 3.3. Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `checkoutId` | `Uuid!` | ✅ Sim | ID do checkout |
| `shippingQuoteId` | `Uuid!` | ✅ Sim | ID da cotação de frete selecionada |
| `distributionCenterId` | `String` | ⚠️ **Obrigatório para Multi-CD** | ID do centro de distribuição (mesmo valor de `distributionCenter.id` da query) |

### 3.4. Campos de Retorno

#### Campos principais:
- `cep`: CEP do endereço de entrega
- `checkoutId`: ID do checkout
- `shippingFee`: **Valor total do frete** (soma de todos os CDs em Multi-CD)

#### `selectedShipping` (objeto)
Frete selecionado para o CD atual (quando usado com `distributionCenterId`).

#### `selectedShippingGroups` (array) - **Apenas em Multi-CD**
Array com todos os grupos de frete selecionados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `distributionCenter` | Objeto | CD do grupo |
| `selectedShipping` | Objeto | Frete selecionado para aquele CD |
| `products` | Array | Produtos que serão enviados por aquele CD |

### 3.5. Comportamento Importante

⚠️ **Para Multi-CD, é necessário chamar a mutation para CADA CD separadamente!**

```javascript
// ❌ ERRADO: Chamar uma vez com múltiplos IDs
checkoutSelectShippingQuote(checkoutId, [quoteId1, quoteId2], [cdId1, cdId2])

// ✅ CORRETO: Chamar uma vez para cada CD
checkoutSelectShippingQuote(checkoutId, quoteId1, cdId1)
checkoutSelectShippingQuote(checkoutId, quoteId2, cdId2)
```

---

## 4. Fluxo de Implementação

### 4.1. Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PÁGINA DE CHECKOUT CARREGA                               │
│    └─ Container vazio com data-checkout-id                  │
├─────────────────────────────────────────────────────────────┤
│ 2. SCRIPT INICIALIZA AUTOMATICAMENTE                         │
│    └─ loadShippingQuoteGroups(checkoutId, true)            │
├─────────────────────────────────────────────────────────────┤
│ 3. QUERY shippingQuoteGroups                                 │
│    └─ Retorna grupos de frete agrupados por CD              │
├─────────────────────────────────────────────────────────────┤
│ 4. RENDERIZAÇÃO DO SNIPPET                                  │
│    └─ shipping_quote_groups_snippet.html                    │
│       └─ Cria um <select> para cada CD                      │
├─────────────────────────────────────────────────────────────┤
│ 5. USUÁRIO SELECIONA FRETE EM CADA CD                       │
│    └─ onShippingQuoteGroupSelect()                          │
│       └─ Armazena no Map: selectedShippingQuotes            │
├─────────────────────────────────────────────────────────────┤
│ 6. RESUMO É ATUALIZADO                                       │
│    └─ updateShippingSummary()                               │
│       └─ Mostra total e habilita botão quando todos          │
│          os CDs têm seleção                                 │
├─────────────────────────────────────────────────────────────┤
│ 7. USUÁRIO CLICA EM "CONFIRMAR FRETE"                       │
│    └─ confirmShippingQuoteGroups()                          │
├─────────────────────────────────────────────────────────────┤
│ 8. MUTATION PARA CADA CD (sequencialmente)                  │
│    └─ selectShippingQuotesViaGraphQL()                       │
│       └─ Loop: mutation para cada CD                        │
├─────────────────────────────────────────────────────────────┤
│ 9. ATUALIZAÇÃO DO CHECKOUT                                  │
│    └─ Recarrega página ou atualiza seções                   │
│       └─ Seção de pagamento é habilitada                     │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Estrutura de Dados Interna

```javascript
// Map que armazena seleções por CD
const selectedShippingQuotes = new Map();

// Estrutura de cada entrada:
{
  cdId: "eyJFbnRpdHkiOiJEaXN0cmlidXRpb25DZW50ZXIiLCJJZCI6MjV9",
  distributionCenterId: "eyJFbnRpdHkiOiJEaXN0cmlidXRpb25DZW50ZXIiLCJJZCI6MjV9",
  shippingQuoteId: "35baf232-9a7c-43b5-95ec-452ac4df78bd",
  name: "Correios PAC",
  value: 25.90,
  deadline: 8,
  type: "Correios"
}
```

---

## 5. Diferenças: CD Único vs Multi-CD

### 5.1. Query

| Aspecto | CD Único | Multi-CD |
|---------|----------|----------|
| Query usada | `shippingQuotes` | `shippingQuoteGroups` |
| Retorno | Array de cotações | Array de grupos (cada grupo = 1 CD) |
| Estrutura | `[{quote1}, {quote2}]` | `[{cd1, quotes: [...]}, {cd2, quotes: [...]}]` |

### 5.2. Mutation

| Aspecto | CD Único | Multi-CD |
|---------|----------|----------|
| Parâmetros | `checkoutId`, `shippingQuoteId` | `checkoutId`, `shippingQuoteId`, **`distributionCenterId`** |
| Quantidade de chamadas | 1 vez | **1 vez para cada CD** |
| Retorno | `selectedShipping` | `selectedShipping` + `selectedShippingGroups` |

---

## 6. Campos Disponíveis vs Utilizados

### 6.1. Campos Disponíveis na API

#### Query `shippingQuoteGroups`:
- ✅ `distributionCenter.id` - **Usado**
- ✅ `distributionCenter.name` - **Usado**
- ✅ `distributionCenter.sellerName` - **Usado**
- ✅ `shippingQuotes.name` - **Usado**
- ✅ `shippingQuotes.shippingQuoteId` - **Usado**
- ✅ `shippingQuotes.type` - **Usado**
- ✅ `shippingQuotes.value` - **Usado**
- ❌ `shippingQuotes.deadline` - **NÃO está na query atual** (mas é usado no snippet)

#### Mutation `checkoutSelectShippingQuote`:
- ✅ `selectedShipping.deadline` - **Disponível no retorno**
- ✅ `selectedShipping.name` - **Disponível**
- ✅ `selectedShipping.shippingQuoteId` - **Disponível**
- ✅ `selectedShipping.type` - **Disponível**
- ✅ `selectedShipping.value` - **Disponível**
- ✅ `selectedShippingGroups` - **Disponível apenas em Multi-CD**

### 6.2. Campos que PODERIAM ser adicionados

Baseado na documentação da mutation, estes campos estão disponíveis mas não estão sendo requisitados:

- `deliverySchedule` - Agendamento de entrega (com `date`, `startTime`, `endTime`)
- `deadline` - Na query `shippingQuoteGroups` (pode não estar disponível)

---

## 7. Tratamento de Erros e Fallback

### 7.1. Estratégia de Fallback

O sistema implementa um fallback automático:

1. **Tenta `shippingQuoteGroups`** (Multi-CD)
2. **Se falhar**, tenta `shippingQuotes` (CD único)
3. **Se ambos falharem**, mostra mensagem de erro

### 7.2. Cenários de Erro

| Erro | Causa Provável | Ação |
|------|----------------|------|
| `shippingQuoteGroups` retorna vazio | Multi-frete não ativo ou todos produtos do mesmo CD | Usar fallback `shippingQuotes` |
| Query retorna erro 500 | Problema na API ou query inválida | Tentar fallback |
| Mutation falha | `distributionCenterId` incorreto ou cotação inválida | Mostrar erro ao usuário |
| Nenhuma cotação disponível | CEP sem cobertura ou produtos sem estoque | Mostrar mensagem informativa |

---

## 8. Boas Práticas

### 8.1. Validação

✅ **Sempre validar**:
- Checkout ID existe
- Endereço está selecionado
- Pelo menos uma cotação disponível
- Todos os CDs têm seleção antes de confirmar

### 8.2. UX

✅ **Melhorar experiência**:
- Mostrar loading durante carregamento
- Exibir resumo com total do frete
- Validar seleção antes de habilitar botão
- Mostrar mensagens claras de erro/sucesso
- Recarregar página após seleção bem-sucedida

### 8.3. Performance

✅ **Otimizações**:
- Cache de cotações (se permitido)
- Chamadas sequenciais na mutation (não paralelas)
- Debounce em mudanças de endereço

---

## 9. Pontos de Atenção

⚠️ **Importante**:

1. **`distributionCenterId` é obrigatório para Multi-CD** - Sem ele, a mutation não associa o frete ao CD correto
2. **Mutations devem ser sequenciais** - Não fazer chamadas paralelas, pode causar race conditions
3. **Campo `deadline` pode não estar disponível** - O snippet trata isso com `{{~ if quote.deadline ~}}`
4. **`selectedShippingGroups` só aparece em Multi-CD** - Não usar em CD único
5. **`shippingFee` é o total** - Em Multi-CD, já vem somado de todos os CDs

---

## 10. Próximos Passos

Aguardando segunda documentação para:
- Entender funcionalidades adicionais
- Verificar campos que podem ser adicionados
- Implementar melhorias baseadas na documentação completa

---

**Documentação baseada em:**
- https://wakecommerce.readme.io/docs/shippingquotegroups
- https://wakecommerce.readme.io/docs/storefront-api-checkoutselectshippingquote
- Código atual do projeto Storefront

