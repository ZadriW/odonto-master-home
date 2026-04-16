/**
 * Shipping Quote Groups Manager
 * Handles multi-CD shipping selection in the checkout close page.
 * Each distribution center can have its own shipping option selected.
 */

// Store for selected shipping quotes per CD
const selectedShippingQuotes = new Map();

/**
 * Indica se a cotação é retirada na loja (tipo vindo da API / data-type do option).
 * @param {string} [type]
 * @returns {boolean}
 */
function isPickupShippingType(type) {
    if (!type || typeof type !== 'string') return false;
    const t = type.trim().toLowerCase();
    return t === 'retirada' || t.includes('retirada');
}

/**
 * Format a number as Brazilian currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/** Texto do botão de confirmação enquanto ainda faltam CDs com frete escolhido. */
function getShippingConfirmWaitingLabel(totalGroups) {
    const n = parseInt(totalGroups, 10) || 0;
    if (n <= 0) return 'Selecione o frete';
    if (n === 1) return 'Selecione o frete para o centro de distribuição';
    return `Selecione o frete para todos os ${n} centros de distribuição`;
}

/**
 * Render shipping quotes HTML directly (for single CD)
 * @param {HTMLElement} container - The container element
 * @param {Array} quotes - Array of shipping quotes
 * @param {string} checkoutId - The checkout ID
 */
function renderShippingQuotesHTML(container, quotes, checkoutId) {
    let optionsHTML = quotes.map(quote => `
        <option value="${quote.shippingQuoteId}" 
                data-value="${quote.value}"
                data-deadline="${quote.deadline || 0}"
                data-type="${quote.type || ''}"
                data-name="${quote.name}"
                data-shipping-quote-id="${quote.shippingQuoteId}">
            ${quote.name} - ${formatCurrency(quote.value)}
            ${quote.deadline ? `(${quote.deadline} ${quote.deadline === 1 ? 'dia útil' : 'dias úteis'})` : ''}
            ${quote.type === 'Retirada' ? '- Retirada' : ''}
        </option>
    `).join('');

    container.innerHTML = `
        <div class="shipping-quote-groups-container">
            <h2 class="shipping-quote-groups-title">
                <svg class="shipping-quote-groups-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Opções de Entrega
            </h2>
            
            <div class="shipping-quote-group">
                <div class="shipping-quote-group-options">
                    <label class="shipping-quote-group-label">Selecione o frete:</label>
                    <select class="shipping-quote-group-select" 
                            data-cd-id="default"
                            data-distribution-center-id=""
                            onchange="onShippingQuoteGroupSelect(this)">
                        <option value="" disabled selected>Escolha uma opção de entrega</option>
                        ${optionsHTML}
                    </select>
                </div>
                
                <div class="shipping-quote-group-selected-details" style="display: none;">
                    <div class="shipping-quote-selected-info">
                        <span class="shipping-quote-selected-name"></span>
                        <span class="shipping-quote-selected-value"></span>
                        <span class="shipping-quote-selected-deadline"></span>
                    </div>
                </div>
            </div>
            
            <div class="shipping-quote-groups-summary" style="display: none;">
                <div class="shipping-quote-groups-summary-header">
                    <span class="shipping-quote-groups-summary-title">Resumo do Frete</span>
                </div>
                <div class="shipping-quote-groups-summary-list"></div>
                <div class="shipping-quote-groups-summary-total">
                    <span>Total do Frete:</span>
                    <span class="shipping-quote-groups-total-value">R$ 0,00</span>
                </div>
                <div id="shipping-quote-pickup-info" class="shipping-quote-pickup-info" style="display: none;" hidden>
                    <p class="shipping-quote-pickup-info-title">Dados para retirada na loja</p>
                    <p class="shipping-quote-pickup-info-hint">Preencha com o nome e documento de quem irá retirar o pedido.</p>
                    <div class="shipping-quote-pickup-info-fields">
                        <label class="shipping-quote-pickup-label">
                            <span>Nome completo</span>
                            <input type="text" id="shipping_pickup_name" class="shipping-quote-pickup-input" autocomplete="name" maxlength="200" />
                        </label>
                        <label class="shipping-quote-pickup-label">
                            <span>Documento (RG, CPF ou outro)</span>
                            <input type="text" id="shipping_pickup_document" class="shipping-quote-pickup-input" autocomplete="off" maxlength="30" />
                        </label>
                    </div>
                </div>
                <button type="button" class="shipping-quote-groups-confirm-btn" onclick="confirmShippingQuoteGroups()" disabled>
                    ${getShippingConfirmWaitingLabel(1)}
                </button>
            </div>
        </div>
    `;
    
    initShippingQuoteGroupsListeners();
}

/**
 * Render shipping quote groups HTML (for multi-CD)
 * @param {HTMLElement} container - The container element
 * @param {Array} groups - Array of shipping quote groups
 * @param {string} checkoutId - The checkout ID
 */
function renderShippingQuoteGroupsHTML(container, groups, checkoutId) {
    let groupsHTML = groups.map(group => {
        const cdName = group.distributionCenter?.name || 'Centro de Distribuição';
        const cdId = group.distributionCenter?.id || '';
        const sellerName = group.distributionCenter?.sellerName;
        
        let optionsHTML = '';
        if (group.shippingQuotes && group.shippingQuotes.length > 0) {
            optionsHTML = group.shippingQuotes.map(quote => `
                <option value="${quote.shippingQuoteId}" 
                        data-value="${quote.value}"
                        data-deadline="${quote.deadline || 0}"
                        data-type="${quote.type || ''}"
                        data-name="${quote.name}"
                        data-shipping-quote-id="${quote.shippingQuoteId}">
                    ${quote.name} - ${formatCurrency(quote.value)}
                    ${quote.deadline ? `(${quote.deadline} ${quote.deadline === 1 ? 'dia útil' : 'dias úteis'})` : ''}
                    ${quote.type === 'Retirada' ? '- Retirada' : ''}
                </option>
            `).join('');
        }
        
        return `
            <div class="shipping-quote-group" data-cd-id="${cdId}">
                <div class="shipping-quote-group-header">
                    <div class="shipping-quote-group-cd-info">
                        <span class="shipping-quote-group-cd-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </span>
                        <div class="shipping-quote-group-cd-details">
                            <span class="shipping-quote-group-cd-name">${cdName}</span>
                            ${sellerName ? `<span class="shipping-quote-group-seller-name">Vendido por: ${sellerName}</span>` : ''}
                        </div>
                    </div>
                </div>
                
                ${optionsHTML ? `
                    <div class="shipping-quote-group-options">
                        <label class="shipping-quote-group-label">Selecione o frete:</label>
                        <select class="shipping-quote-group-select" 
                                data-cd-id="${cdId}"
                                data-distribution-center-id="${cdId}"
                                onchange="onShippingQuoteGroupSelect(this)">
                            <option value="" disabled selected>Escolha uma opção de entrega</option>
                            ${optionsHTML}
                        </select>
                    </div>
                    
                    <div class="shipping-quote-group-selected-details" style="display: none;">
                        <div class="shipping-quote-selected-info">
                            <span class="shipping-quote-selected-name"></span>
                            <span class="shipping-quote-selected-value"></span>
                            <span class="shipping-quote-selected-deadline"></span>
                        </div>
                    </div>
                ` : `
                    <div class="shipping-quote-group-no-options">
                        <span>Nenhuma opção de entrega disponível para este centro de distribuição.</span>
                    </div>
                `}
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="shipping-quote-groups-container">
            <h2 class="shipping-quote-groups-title">
                <svg class="shipping-quote-groups-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Opções de Entrega
            </h2>
            
            ${groupsHTML}
            
            <div class="shipping-quote-groups-summary" style="display: none;">
                <div class="shipping-quote-groups-summary-header">
                    <span class="shipping-quote-groups-summary-title">Resumo do Frete</span>
                </div>
                <div class="shipping-quote-groups-summary-list"></div>
                <div class="shipping-quote-groups-summary-total">
                    <span>Total do Frete:</span>
                    <span class="shipping-quote-groups-total-value">R$ 0,00</span>
                </div>
                <div id="shipping-quote-pickup-info" class="shipping-quote-pickup-info" style="display: none;" hidden>
                    <p class="shipping-quote-pickup-info-title">Dados para retirada na loja</p>
                    <p class="shipping-quote-pickup-info-hint">Preencha com o nome e documento de quem irá retirar o pedido.</p>
                    <div class="shipping-quote-pickup-info-fields">
                        <label class="shipping-quote-pickup-label">
                            <span>Nome completo</span>
                            <input type="text" id="shipping_pickup_name" class="shipping-quote-pickup-input" autocomplete="name" maxlength="200" />
                        </label>
                        <label class="shipping-quote-pickup-label">
                            <span>Documento (RG, CPF ou outro)</span>
                            <input type="text" id="shipping_pickup_document" class="shipping-quote-pickup-input" autocomplete="off" maxlength="30" />
                        </label>
                    </div>
                </div>
                <button type="button" class="shipping-quote-groups-confirm-btn" onclick="confirmShippingQuoteGroups()" disabled>
                    ${getShippingConfirmWaitingLabel(groups.length)}
                </button>
            </div>
        </div>
    `;
    
    initShippingQuoteGroupsListeners();
}

/**
 * Loads and renders shipping quote groups for the checkout.
 * Uses shippingQuoteGroups query (requires Multi-frete active in store admin).
 * 
 * IMPORTANT: According to Wake documentation:
 * - shippingQuoteGroups only works with Multi-frete enabled
 * - If Multi-frete is not enabled, API returns 500 error
 * 
 * @see https://wakecommerce.readme.io/docs/shippingquotegroups
 * @param {string} checkoutId - The checkout ID.
 * @param {boolean} useSelectedAddress - Whether to use the selected address for quoting.
 */
async function loadShippingQuoteGroups(checkoutId, useSelectedAddress = true) {
    console.log('=== LOADING SHIPPING QUOTES ===');
    console.log('Checkout ID:', checkoutId);
    console.log('Use Selected Address:', useSelectedAddress);
    
    const container = document.querySelector('[data-shipping-groups-container]') || 
                      document.getElementById('shipping-quote-groups-container');
    
    if (!container) {
        console.error('Shipping groups container not found');
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="shipping-quote-groups-loading">
            <div class="shipping-quote-groups-spinner"></div>
            <span>Carregando opções de entrega...</span>
        </div>
    `;

    // Variables for the query
    const variables = {
        checkoutId: checkoutId,
        useSelectedAddress: useSelectedAddress === true
    };
    
    console.log('Query variables:', JSON.stringify(variables));

    // Helper function to check if response has valid shipping options
    const hasValidShippingOptions = (response) => {
        if (!response || typeof response !== 'string') return false;
        // Check for the select element that contains shipping options
        return response.includes('shipping-quote-group-select') && 
               !response.includes('shipping-quote-groups-empty');
    };

    let response = null;

    // Try shippingQuoteGroups query
    // Note: This query only works if Multi-frete is enabled in the store admin
    console.log('Fetching shippingQuoteGroups...');
    try {
        response = await client.snippet.render(
            "shipping_quote_groups_snippet.html",
            "SnippetQueries/shipping_quote_groups.graphql",
            variables
        );
        console.log('Response received, type:', typeof response);
        
        if (typeof response === 'string') {
            console.log('Response preview:', response.substring(0, 500));
        } else {
            console.log('Response (non-string):', response);
        }
    } catch (error) {
        console.error('shippingQuoteGroups query failed:', error);
        response = null;
    }

    // Check if we got valid shipping options
    if (response && hasValidShippingOptions(response)) {
        console.log('SUCCESS: Shipping options loaded');
        container.innerHTML = response;
        initShippingQuoteGroupsListeners();
        return;
    }

    // Check if we got a valid response but with empty options (no quotes available for address)
    if (response && typeof response === 'string' && response.includes('shipping-quote-groups-empty')) {
        console.log('No shipping options available for this address');
        container.innerHTML = response;
        return;
    }

    // If shippingQuoteGroups failed, it might be because Multi-frete is not enabled
    // In this case, show a message asking user to go back and select shipping on checkout page
    console.warn('shippingQuoteGroups not available. Multi-frete may not be enabled.');
    
    // Try to render shipping options using the SDK's checkout shipping method
    console.log('Trying alternative: Wake SDK checkout.renderShipping...');
    
    // Check if Wake SDK has a method to render shipping
    if (typeof client.checkout?.renderShipping === 'function') {
        try {
            const shippingHtml = await client.checkout.renderShipping({ checkoutId });
            if (shippingHtml) {
                container.innerHTML = shippingHtml;
                return;
            }
        } catch (sdkError) {
            console.error('SDK renderShipping failed:', sdkError);
        }
    }

    // Last resort: Show message asking to select shipping on previous step
    console.log('Showing fallback message - user should select shipping on checkout page');
    container.innerHTML = `
        <div class="shipping-quote-groups-fallback">
            <h2 class="shipping-quote-groups-title" style="margin-bottom: 1rem;">
                <svg class="shipping-quote-groups-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 24px; height: 24px; margin-right: 0.5rem;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Opções de Entrega
            </h2>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <svg fill="none" stroke="#d97706" viewBox="0 0 24 24" style="width: 24px; height: 24px; flex-shrink: 0; margin-top: 2px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <p style="font-weight: 600; color: #92400e; margin: 0 0 0.5rem 0;">
                            Selecione o frete na etapa anterior
                        </p>
                        <p style="color: #a16207; margin: 0; font-size: 0.875rem;">
                            Para continuar, volte à página do carrinho e selecione uma opção de entrega.
                        </p>
                    </div>
                </div>
            </div>
            <a href="/checkout" class="shipping-quote-groups-retry-btn" style="display: inline-block; text-decoration: none; text-align: center;">
                Voltar ao carrinho
            </a>
        </div>
    `;
}

/**
 * Initialize listeners for shipping quote group selects
 */
function initShippingQuoteGroupsListeners() {
    console.log('Initializing shipping quote groups listeners...');
    
    const selects = document.querySelectorAll('.shipping-quote-group-select');
    console.log('Found', selects.length, 'shipping quote select elements');
    
    selects.forEach(select => {
        // Remove existing listeners to prevent duplicates
        select.removeEventListener('change', handleShippingSelectChange);
        // Add new listener with capture to get events first
        select.addEventListener('change', handleShippingSelectChange, true);
    });
    
    // Reset selected quotes map
    selectedShippingQuotes.clear();
    
    // Update summary visibility
    updateShippingSummary();
}

/**
 * Handle select change event with proper event handling
 * @param {Event} event - The change event
 */
function handleShippingSelectChange(event) {
    // Stop event propagation to prevent Wake default handlers
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Call our handler
    onShippingQuoteGroupSelect(event);
}

/**
 * Handle shipping quote selection change
 * @param {Event|HTMLSelectElement} eventOrElement - The change event or select element
 */
function onShippingQuoteGroupSelect(eventOrElement) {
    const select = eventOrElement.target || eventOrElement;
    const cdId = select.dataset.cdId || 'default';
    const distributionCenterId = select.dataset.distributionCenterId || ''; // ID do CD para a mutation
    const selectedOption = select.options[select.selectedIndex];
    
    console.log('Shipping quote selected:', {
        cdId: cdId,
        distributionCenterId: distributionCenterId,
        value: selectedOption?.value,
        name: selectedOption?.dataset?.name
    });
    
    if (!selectedOption || !selectedOption.value) {
        selectedShippingQuotes.delete(cdId);
    } else {
        selectedShippingQuotes.set(cdId, {
            cdId: cdId,
            distributionCenterId: distributionCenterId, // Necessário para a mutation Multi-CD
            shippingQuoteId: selectedOption.value,
            name: selectedOption.dataset.name,
            value: parseFloat(selectedOption.dataset.value) || 0,
            deadline: parseInt(selectedOption.dataset.deadline) || 0,
            type: selectedOption.dataset.type
        });
    }
    
    // Update the details display for this group
    updateGroupSelectedDetails(select);
    
    // Update the summary
    updateShippingSummary();
}

/**
 * Update the selected details display for a shipping group
 * @param {HTMLSelectElement} select - The select element
 */
function updateGroupSelectedDetails(select) {
    const group = select.closest('.shipping-quote-group');
    if (!group) return;
    
    const detailsContainer = group.querySelector('.shipping-quote-group-selected-details');
    if (!detailsContainer) return;
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        const nameEl = detailsContainer.querySelector('.shipping-quote-selected-name');
        const valueEl = detailsContainer.querySelector('.shipping-quote-selected-value');
        const deadlineEl = detailsContainer.querySelector('.shipping-quote-selected-deadline');
        
        if (nameEl) nameEl.textContent = selectedOption.dataset.name;
        if (valueEl) valueEl.textContent = formatCurrency(parseFloat(selectedOption.dataset.value) || 0);
        if (deadlineEl) {
            const deadline = parseInt(selectedOption.dataset.deadline) || 0;
            deadlineEl.textContent = deadline > 0 
                ? `${deadline} ${deadline === 1 ? 'dia útil' : 'dias úteis'}`
                : '';
        }
        
        detailsContainer.style.display = 'block';
    } else {
        detailsContainer.style.display = 'none';
    }
}

/**
 * Update the shipping summary section
 */
function updateShippingSummary() {
    const summaryContainer = document.querySelector('.shipping-quote-groups-summary');
    if (!summaryContainer) return;
    
    const summaryList = summaryContainer.querySelector('.shipping-quote-groups-summary-list');
    const totalValueEl = summaryContainer.querySelector('.shipping-quote-groups-total-value');
    const confirmBtn = summaryContainer.querySelector('.shipping-quote-groups-confirm-btn');
    
    // Get all groups count
    const allGroups = document.querySelectorAll('.shipping-quote-group');
    const totalGroups = allGroups.length;
    const selectedCount = selectedShippingQuotes.size;
    
    if (selectedCount === 0) {
        summaryContainer.style.display = 'none';
        const pickupInfo = document.getElementById('shipping-quote-pickup-info');
        if (pickupInfo) {
            pickupInfo.style.display = 'none';
            pickupInfo.setAttribute('hidden', '');
        }
        return;
    }
    
    summaryContainer.style.display = 'block';

    const needsPickupFields = Array.from(selectedShippingQuotes.values()).some((q) => isPickupShippingType(q.type));
    const pickupInfo = document.getElementById('shipping-quote-pickup-info');
    if (pickupInfo) {
        if (needsPickupFields) {
            pickupInfo.removeAttribute('hidden');
            pickupInfo.style.display = 'block';
        } else {
            pickupInfo.style.display = 'none';
            pickupInfo.setAttribute('hidden', '');
            const n = document.getElementById('shipping_pickup_name');
            const d = document.getElementById('shipping_pickup_document');
            if (n) n.value = '';
            if (d) d.value = '';
        }
    }
    
    // Build summary list
    let summaryHtml = '';
    let totalValue = 0;
    
    selectedShippingQuotes.forEach((quote, cdId) => {
        totalValue += quote.value;
        summaryHtml += `
            <div class="shipping-quote-summary-item">
                <span class="shipping-quote-summary-item-name">${quote.name}</span>
                <span class="shipping-quote-summary-item-value">${formatCurrency(quote.value)}</span>
            </div>
        `;
    });
    
    if (summaryList) {
        summaryList.innerHTML = summaryHtml;
    }
    
    if (totalValueEl) {
        totalValueEl.textContent = formatCurrency(totalValue);
    }
    
    // Enable confirm button only if all groups have a selection
    if (confirmBtn) {
        confirmBtn.disabled = selectedCount < totalGroups;
        if (selectedCount < totalGroups) {
            const waiting = getShippingConfirmWaitingLabel(totalGroups);
            confirmBtn.textContent = waiting;
            confirmBtn.title = waiting;
        } else {
            confirmBtn.textContent = 'Confirmar Frete';
            confirmBtn.title = 'Confirmar seleção de frete';
        }
    }
}

/**
 * Confirm the shipping quote selections and apply them to the checkout
 * Para Multi-CD: Chama a mutation checkoutSelectShippingQuote para CADA CD
 * Documentação: https://wakecommerce.readme.io/docs/storefront-api-checkoutselectshippingquote
 */
async function confirmShippingQuoteGroups() {
    const confirmBtn = document.querySelector('.shipping-quote-groups-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="shipping-quote-groups-spinner-small"></span> Processando...';
    }
    
    try {
        const shippingContainer = document.querySelector('[data-shipping-groups-container]') || 
                                  document.getElementById('shipping-quote-groups-container');
        const checkoutId = shippingContainer?.dataset.checkoutId || 
                          window.checkoutIdForShipping || 
                          client.cookie.get('carrinho-id');
        
        if (!checkoutId) {
            throw new Error('Checkout ID not found');
        }
        
        // Coletar todas as seleções de frete com distributionCenterId
        // Conforme documentação Wake: para Multi-CD, precisamos do distributionCenterId
        const shippingSelections = [];
        selectedShippingQuotes.forEach((quote) => {
            shippingSelections.push({
                shippingQuoteId: quote.shippingQuoteId,
                distributionCenterId: quote.distributionCenterId,
                name: quote.name,
                type: quote.type
            });
        });
        
        if (shippingSelections.length === 0) {
            throw new Error('Nenhuma opção de frete selecionada');
        }

        const needsPickup = shippingSelections.some((s) => isPickupShippingType(s.type));
        if (needsPickup) {
            const nameInput = document.getElementById('shipping_pickup_name');
            const docInput = document.getElementById('shipping_pickup_document');
            const pickupName = nameInput?.value?.trim() || '';
            const pickupDocument = docInput?.value?.trim() || '';
            if (!pickupName) {
                throw new Error('Informe o nome completo de quem irá retirar o pedido na loja.');
            }
            if (!pickupDocument) {
                throw new Error('Informe o documento de quem irá retirar o pedido na loja.');
            }
        }
        
        console.log('Confirming shipping selections:', shippingSelections);
        
        let result = null;

        result = await selectShippingQuotesViaGraphQL(checkoutId, shippingSelections);
        
        if (result) {
            // Success - update checkout sections
            showShippingSuccess('Frete selecionado com sucesso!');
            
            // Atualizar as seções do checkout após seleção do frete
            await updateCheckoutAfterShippingSelection(checkoutId);
        } else {
            throw new Error('Falha ao selecionar o frete');
        }
    } catch (error) {
        console.error('Error confirming shipping quotes:', error);
        
        // Show error message
        showShippingError(error.message || 'Erro ao confirmar o frete. Por favor, tente novamente.');
        
        // Re-enable button e sincronizar rótulo com o estado atual das seleções
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
        updateShippingSummary();
    }
}

/**
 * Update checkout sections after shipping selection
 * Recarrega a página para atualizar todas as seções do checkout (frete, resumo, pagamento)
 * @param {string} checkoutId - The checkout ID
 */
async function updateCheckoutAfterShippingSelection(checkoutId) {
    console.log('Shipping selected successfully, updating checkout sections...');

    if (typeof renderAfterShippingSelected === 'function') {
        await renderAfterShippingSelected();
    } else {
        window.location.reload();
    }
}

/**
 * Show a success message in the shipping section
 * @param {string} message - Success message to display
 */
function showShippingSuccess(message) {
    const shippingContainer = document.querySelector('[data-shipping-groups-container]') || 
                              document.getElementById('shipping-quote-groups-container');
    
    if (shippingContainer) {
        // Criar mensagem de sucesso visível
        const successContainer = document.createElement('div');
        successContainer.className = 'shipping-quote-groups-success-message';
        successContainer.style.cssText = `
            background-color: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        `;
        successContainer.innerHTML = `
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${message}</span>
        `;
        
        // Inserir no topo do container
        shippingContainer.insertBefore(successContainer, shippingContainer.firstChild);
        
        // Scroll suave para a mensagem
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Select shipping quotes via GraphQL mutation usando o SDK Wake
 * Para Multi-CD: É necessário chamar a mutation para CADA grupo de cotação (centro de distribuição)
 * Para CD único: Chama a mutation simples sem distributionCenterId
 * Documentação: https://wakecommerce.readme.io/docs/storefront-api-checkoutselectshippingquote
 * @param {string} checkoutId - The checkout ID
 * @param {Array} shippingSelections - Array of shipping selections with distributionCenterId
 * @returns {Promise<boolean>} Success status
 */
async function selectShippingQuotesViaGraphQL(checkoutId, shippingSelections) {
    // Verificar se é multi-CD ou CD único
    const isMultiCD = shippingSelections.some(s => s.distributionCenterId && s.distributionCenterId !== '');
    
    // Mutation para CD único (sem distributionCenterId)
    const simpleMutation = `
        mutation CheckoutSelectShippingQuote($checkoutId: Uuid!, $shippingQuoteId: Uuid!) {
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
    `;

    // CD único + retirada na loja (additionalInformation — Wake docs)
    const simpleMutationPickup = `
        mutation CheckoutSelectShippingQuotePickup(
            $checkoutId: Uuid!
            $shippingQuoteId: Uuid!
            $pickupName: String!
            $pickupDocument: String!
        ) {
            checkoutSelectShippingQuote(
                checkoutId: $checkoutId
                shippingQuoteId: $shippingQuoteId
                additionalInformation: { name: $pickupName, document: $pickupDocument }
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
    `;
    
    // Mutation para Multi-CD (com distributionCenterId)
    const multiCDMutation = `
        mutation CheckoutSelectShippingQuote(
            $checkoutId: Uuid!, 
            $shippingQuoteId: Uuid!,
            $distributionCenterId: ID
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
    `;

    const multiCDMutationPickup = `
        mutation CheckoutSelectShippingQuotePickupMulti(
            $checkoutId: Uuid!
            $shippingQuoteId: Uuid!
            $distributionCenterId: ID
            $pickupName: String!
            $pickupDocument: String!
        ) {
            checkoutSelectShippingQuote(
                checkoutId: $checkoutId
                shippingQuoteId: $shippingQuoteId
                distributionCenterId: $distributionCenterId
                additionalInformation: { name: $pickupName, document: $pickupDocument }
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
    `;

    const pickupName = document.getElementById('shipping_pickup_name')?.value?.trim() || '';
    const pickupDocument = document.getElementById('shipping_pickup_document')?.value?.trim() || '';
    
    try {
        // Para Multi-CD, chamamos a mutation para CADA CD sequencialmente
        for (const selection of shippingSelections) {
            let mutation, variables;
            const isPickup = isPickupShippingType(selection.type);
            
            if (isMultiCD && selection.distributionCenterId) {
                if (isPickup) {
                    mutation = multiCDMutationPickup;
                    variables = {
                        checkoutId: checkoutId,
                        shippingQuoteId: selection.shippingQuoteId,
                        distributionCenterId: selection.distributionCenterId,
                        pickupName: pickupName,
                        pickupDocument: pickupDocument
                    };
                } else {
                    mutation = multiCDMutation;
                    variables = {
                        checkoutId: checkoutId,
                        shippingQuoteId: selection.shippingQuoteId,
                        distributionCenterId: selection.distributionCenterId
                    };
                }
                console.log('Selecting shipping (multi-CD) for CD:', selection.distributionCenterId, 'Quote:', selection.shippingQuoteId, isPickup ? '(retirada)' : '');
            } else {
                if (isPickup) {
                    mutation = simpleMutationPickup;
                    variables = {
                        checkoutId: checkoutId,
                        shippingQuoteId: selection.shippingQuoteId,
                        pickupName: pickupName,
                        pickupDocument: pickupDocument
                    };
                } else {
                    mutation = simpleMutation;
                    variables = {
                        checkoutId: checkoutId,
                        shippingQuoteId: selection.shippingQuoteId
                    };
                }
                console.log('Selecting shipping (single CD) Quote:', selection.shippingQuoteId, isPickup ? '(retirada)' : '');
            }
            
            // Usar client.query() do SDK Wake para executar a mutation
            const response = await client.query(mutation, variables);
            
            console.log('Mutation response:', response);
            
            if (response && response.errors && response.errors.length > 0) {
                console.error('GraphQL Error:', response.errors);
                throw new Error(response.errors[0].message || 'Erro ao selecionar frete');
            }
            
            if (response?.data?.checkoutSelectShippingQuote) {
                console.log('Shipping selected successfully:', response.data.checkoutSelectShippingQuote);
            }
        }
        
        return true;
    } catch (error) {
        console.error('GraphQL mutation error:', error);
        throw error;
    }
}

/**
 * Show an error message in the shipping section
 * @param {string} message - Error message to display
 */
function showShippingError(message) {
    // Try to find or create an error container
    let errorContainer = document.querySelector('.shipping-quote-groups-error-message');
    
    if (!errorContainer) {
        const summaryContainer = document.querySelector('.shipping-quote-groups-summary');
        if (summaryContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'shipping-quote-groups-error-message';
            summaryContainer.insertBefore(errorContainer, summaryContainer.firstChild);
        }
    }
    
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

/**
 * Initialize shipping quote groups on page load if needed
 */
function initShippingQuoteGroupsOnLoad() {
    console.log('Initializing shipping quote groups...');
    
    const shippingContainer = document.querySelector('[data-shipping-groups-container]') || 
                              document.getElementById('shipping-quote-groups-container');
    
    if (shippingContainer) {
        console.log('Shipping container found');
        // Try to get checkoutId from container attribute first, then window variable, then cookie
        const checkoutId = shippingContainer.dataset.checkoutId || 
                          window.checkoutIdForShipping || 
                          client.cookie.get('carrinho-id');
        
        console.log('Checkout ID:', checkoutId);
        
        if (checkoutId) {
            // useSelectedAddress: true = use the address already selected in checkout
            loadShippingQuoteGroups(checkoutId, true);
        } else {
            console.error('No checkout ID found');
            // Show error in container
            if (shippingContainer) {
                shippingContainer.innerHTML = `
                    <div class="shipping-quote-groups-error">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 48px; height: 48px; color: #dc2626; margin-bottom: 1rem;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>ID do checkout não encontrado. Por favor, atualize a página.</span>
                    </div>
                `;
            }
        }
    } else {
        console.log('Shipping container not found - may not be on checkout close page');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShippingQuoteGroupsOnLoad);
} else {
    // DOM already loaded, run after a small delay to ensure other scripts are ready
    setTimeout(initShippingQuoteGroupsOnLoad, 100);
}

