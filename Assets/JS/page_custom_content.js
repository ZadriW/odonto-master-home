/**
 * Script de identificação de páginas e exibição de conteúdo customizado
 * Este script analisa a URL da página e exibe conteúdo específico ao final da página
 * seguindo a estrutura do wake-content-wrapper
 */

(function() {
    'use strict';

    // Configuração de páginas e seus conteúdos
    const pageContentConfig = {
        'dentistica-e-estetica': {
            title: 'Dentística e Estética',
            content: `
                <p>A Dentística é a especialidade da odontologia responsável por preservar, restaurar e valorizar a estrutura dental, garantindo função, saúde e estética ao sorriso.</p>
                <p>Ela é dividida em Dentística Restauradora e Dentística Estética, áreas que envolvem diferentes técnicas, procedimentos clínicos e materiais odontológicos específicos, a escolha correta desses materiais é essencial para a qualidade e longevidade dos tratamentos.</p>
                
                <h3>Dentística Restauradora</h3>
                <p>A Dentística Restauradora tem como foco a recuperação de dentes comprometidos por cáries, fraturas, desgastes ou traumas.</p>
                <p>Por meio de restaurações diretas e indiretas, essa especialidade devolve a função mastigatória, a resistência e a aparência natural dos dentes, sempre preservando o máximo da estrutura dental.</p>
                
                <h4>Quais materiais são utilizados na Dentística Restauradora?</h4>
                <p>Entre os principais materiais utilizados estão:</p>
                <ul>
                    <li>Resinas compostas</li>
                    <li>Anestésicos odontológicos</li>
                    <li>Condicionadores ácidos</li>
                    <li>Brocas e instrumentais rotatórios</li>
                    <li>Curetas e instrumentos manuais</li>
                    <li>Acessórios para acabamento e polimento</li>
                </ul>
                <p><strong>A Odonto Master oferece um portfólio completo de materiais restauradores, garantindo desempenho clínico, segurança e confiabilidade nos procedimentos diários.</strong></p>
                
                <h3>Dentística Estética</h3>
                <p>A Dentística Estética é a área dedicada à harmonia do sorriso, promovendo melhorias na cor, forma e proporção dos dentes. Os procedimentos mais comuns incluem clareamento dental, facetas, lentes de contato dental e reanatomização estéticas.</p>
                <p><strong>Garanta resultados estéticos previsíveis com a Odonto Master</strong></p>
                <p>Contar com materiais de qualidade é fundamental para alcançar resultados naturais e duradouros nos tratamentos estéticos.</p>
                
                <h4>Quais os melhores produtos para Dentística Estética?</h4>
                <p>Para procedimentos estéticos de excelência, é indispensável utilizar:</p>
                <ul>
                    <li>Resinas compostas com alta estabilidade de cor e durabilidade</li>
                    <li>Clareadores dentais eficientes e seguros</li>
                    <li>Sistemas adesivos com alto poder de adesão</li>
                    <li>Cimentos resinosos de qualidade clínica comprovada</li>
                </ul>
                <p>Além disso, o uso de um fotopolimerizador eficiente, com potência adequada e emissão de luz confiável, é essencial para aumentar a longevidade das restaurações e tratamentos estéticos.</p>
                
                <h4>Quais os Materiais de Dentística para estudantes de odontologia?</h4>
                <p>A lista acadêmica de Dentística e Estética é ampla e contempla os principais materiais utilizados durante a graduação.</p>
                <p>Os principais materiais que os estudantes precisam adquirir:</p>
                <ul>
                    <li>Resinas compostas</li>
                    <li>Instrumentais clínicos</li>
                    <li>Acessórios de acabamento e polimento</li>
                    <li>Materiais para isolamento absoluto</li>
                    <li>Insumos indicados pelas instituições de ensino</li>
                </ul>
                <p><strong>A Odonto Master disponibiliza soluções acessíveis e de qualidade para atender às necessidades acadêmicas, ajudando o estudante a montar sua lista com economia e segurança.</strong></p>
                
                <h4>Quais as melhores marcas de Dentística e Estética?</h4>
                <p>A Odonto Master trabalha com fabricantes reconhecidos no mercado odontológico como Solventum, Tokuyama Dental, SDI, Kulzer, FGM, que seguem rigorosos padrões de qualidade e inovação. Esses parceiros garantem materiais confiáveis para procedimentos restauradores e estéticos, atendendo às exigências da prática clínica moderna.</p>
                
                <h4>Onde comprar materiais de Dentística e Estética?</h4>
                <p>Na Odonto Master, estudantes e profissionais encontram tudo o que precisam em Dentística e Estética: materiais restauradores, instrumentais e soluções para isolamento e acabamento.</p>
                <p><strong>Com uma experiência de compra facilitada e um portfólio completo, a Odonto Master é a escolha certa para quem busca qualidade, confiança e suporte em cada etapa da odontologia.</strong></p>
            `
        },
        'ortodontia': {
            title: 'Ortodontia',
            content: `
                <p>A Ortodontia é a especialidade da odontologia responsável pelo diagnóstico, prevenção e correção das irregularidades dentárias e ósseas, promovendo alinhamento, equilíbrio funcional e harmonia do sorriso.</p>
                <p>Por meio de diferentes técnicas e dispositivos ortodônticos, essa área contribui não apenas para a estética, mas também para a saúde bucal, a mastigação, a fala e a qualidade de vida dos pacientes.</p>
                
                <h3>Tratamentos Ortodônticos</h3>
                <p>Os tratamentos ortodônticos têm como objetivo corrigir o posicionamento dos dentes e a relação entre os maxilares, proporcionando uma oclusão funcional e estável.</p>
                <p>Cada plano de tratamento é individualizado, considerando fatores como idade, diagnóstico clínico, necessidades funcionais e expectativas estéticas do paciente.</p>
                
                <h4>Tipos de aparelhos ortodônticos</h4>
                <p>A Ortodontia oferece diferentes tipos de aparelhos, indicados de acordo com o caso clínico e o perfil do paciente:</p>
                <ul>
                    <li>Aparelhos fixos metálicos</li>
                    <li>Aparelhos cerâmicos e estéticos</li>
                    <li>Aparelhos autoligáveis</li>
                    <li>Aparelhos móveis</li>
                    <li>Alinhadores transparentes</li>
                </ul>
                <p>Cada sistema possui características específicas que influenciam no conforto, na estética e na previsibilidade do tratamento.</p>
                
                <h4>Quais materiais são utilizados na Ortodontia?</h4>
                <p>Os materiais ortodônticos são fundamentais para garantir eficiência, segurança e durabilidade ao tratamento. Entre os principais, destacam-se:</p>
                <ul>
                    <li>Bráquetes metálicos, cerâmicos e autoligáveis</li>
                    <li>Fios ortodônticos de diferentes ligas e calibres</li>
                    <li>Molas e elásticos ortodônticos</li>
                    <li>Tubos, bandas e acessórios</li>
                    <li>Materiais de colagem e cimentação</li>
                </ul>
                <p>A escolha correta desses materiais impacta diretamente no desempenho clínico e na experiência do paciente.</p>
                
                <h4>Acessórios essenciais na Ortodontia</h4>
                <p>Os acessórios ortodônticos complementam o tratamento e permitem ajustes precisos ao longo das consultas. Entre os mais utilizados estão:</p>
                <ul>
                    <li>Ligaduras elásticas e metálicas</li>
                    <li>Elásticos intermaxilares</li>
                    <li>Molas abertas e fechadas</li>
                    <li>Tubos bucais e ganchos</li>
                    <li>Acessórios auxiliares para mecânica ortodôntica</li>
                </ul>
                <p><strong>A Odonto Master oferece uma linha completa de acessórios, garantindo variedade e qualidade para a rotina clínica.</strong></p>
                
                <h4>Instrumentais utilizados na Ortodontia</h4>
                <p>Para a instalação, manutenção e remoção dos aparelhos, o profissional necessita de instrumentais específicos, como:</p>
                <ul>
                    <li>Alicates ortodônticos</li>
                    <li>Cortadores de fio</li>
                    <li>Pinças e posicionadores</li>
                    <li>Instrumentais para colagem e descolagem de bráquetes</li>
                </ul>
                <p>Instrumentais de qualidade proporcionam maior precisão, segurança e conforto durante os atendimentos.</p>
                
                <h4>Materiais para colagem e cimentação</h4>
                <p>A colagem adequada dos acessórios ortodônticos é essencial para a estabilidade do tratamento. Os principais materiais incluem:</p>
                <ul>
                    <li>Adesivos ortodônticos</li>
                    <li>Cimentos para bandas</li>
                    <li>Condicionadores ácidos</li>
                    <li>Fotopolimerizadores com potência adequada</li>
                </ul>
                <p>O uso de materiais confiáveis reduz falhas de colagem e contribui para a eficiência clínica.</p>
                
                <h4>Quais os Materiais de Ortodontia para estudantes de odontologia?</h4>
                <p>A lista acadêmica de Ortodontia contempla os principais itens utilizados durante a graduação, como:</p>
                <ul>
                    <li>Bráquetes e fios ortodônticos</li>
                    <li>Ligaduras e elásticos</li>
                    <li>Instrumentais básicos</li>
                    <li>Materiais de colagem indicados pelas instituições de ensino</li>
                </ul>
                <p><strong>A Odonto Master disponibiliza soluções acessíveis e de qualidade, auxiliando o estudante a montar sua lista acadêmica com economia e segurança.</strong></p>
                
                <h4>Quais as melhores marcas de Ortodontia?</h4>
                <p>A Odonto Master trabalha com fabricantes reconhecidos no mercado odontológico, como Morelli, 3M Unitek, GAC, American Orthodontics e Ortho Technology.</p>
                <p>Essas marcas seguem rigorosos padrões de qualidade e inovação, garantindo materiais confiáveis para tratamentos clínicos e acadêmicos.</p>
                
                <h4>Onde comprar materiais de Ortodontia?</h4>
                <p>Na Odonto Master, profissionais e estudantes encontram tudo o que precisam em Ortodontia: aparelhos, acessórios, instrumentais e materiais de colagem.</p>
                <p><strong>Com um portfólio completo, marcas reconhecidas e uma experiência de compra facilitada, a Odonto Master é a escolha certa para quem busca qualidade, confiança e suporte em cada etapa do tratamento ortodôntico.</strong></p>
            `
        },
        'endodontia': {
            title: 'Endodontia',
            content: `
                <p>A Endodontia é a especialidade da odontologia responsável pelo diagnóstico, prevenção e tratamento das doenças da polpa dentária e dos tecidos periapicais. Seu principal objetivo é preservar dentes comprometidos, eliminando infecções, aliviando a dor e restabelecendo a função dental.</p>
                <p>Os procedimentos endodônticos exigem precisão técnica e o uso de materiais específicos para cada etapa do tratamento, desde a instrumentação até a obturação dos canais radiculares. A escolha correta desses materiais impacta diretamente o sucesso clínico e a longevidade do tratamento.</p>
                
                <h3>Tratamentos Endodônticos</h3>
                <p>Os tratamentos realizados na Endodontia incluem:</p>
                <ul>
                    <li>Tratamento de canal em dentes permanentes</li>
                    <li>Retratamento endodôntico</li>
                    <li>Procedimentos em canais com anatomia complexa</li>
                    <li>Controle e eliminação de infecções pulpares e periapicais</li>
                </ul>
                <p>Cada abordagem clínica demanda materiais adequados para garantir segurança, eficiência e previsibilidade nos resultados.</p>
                
                <h4>Quais materiais são utilizados na Endodontia?</h4>
                <p>A Endodontia utiliza uma ampla variedade de materiais desenvolvidos para atuar em todas as fases do tratamento, como:</p>
                <ul>
                    <li>Instrumentos para exploração, preparo e modelagem dos canais</li>
                    <li>Materiais para irrigação e desinfecção</li>
                    <li>Medicamentos intracanais</li>
                    <li>Sistemas de obturação e selamento</li>
                    <li>Acessórios auxiliares para procedimentos endodônticos</li>
                </ul>
                <p>Esses materiais são essenciais para assegurar a limpeza adequada do sistema de canais e o correto selamento do dente tratado.</p>
                
                <h4>Por que investir em bons materiais de Endodontia?</h4>
                <p>Utilizar materiais de qualidade em Endodontia proporciona:</p>
                <ul>
                    <li>Maior eficiência na instrumentação dos canais</li>
                    <li>Melhor controle microbiológico</li>
                    <li>Selamento apical mais eficaz</li>
                    <li>Redução de falhas e retratamentos</li>
                    <li>Mais segurança clínica para o profissional e o paciente</li>
                </ul>
                <p>A qualidade dos materiais influencia diretamente o prognóstico do tratamento endodôntico.</p>
                
                <h4>Quais os melhores produtos para Endodontia?</h4>
                <p>Os melhores produtos para Endodontia são aqueles que oferecem desempenho clínico comprovado, precisão e confiabilidade. Eles devem atender às exigências técnicas dos procedimentos e garantir resultados consistentes em diferentes protocolos endodônticos.</p>
                <p><strong>Na Odonto Master, você encontra produtos selecionados para todas as etapas do tratamento endodôntico, atendendo tanto clínicas quanto ambientes acadêmicos.</strong></p>
                
                <h4>Quais os Materiais de Endodontia para estudantes de odontologia?</h4>
                <p>Durante a graduação, os estudantes de odontologia precisam de materiais específicos para a prática clínica e laboratorial em Endodontia. A lista acadêmica normalmente inclui:</p>
                <ul>
                    <li>Instrumentos endodônticos manuais</li>
                    <li>Materiais para irrigação e obturação</li>
                    <li>Acessórios auxiliares para procedimentos clínicos</li>
                    <li>Insumos indicados pelas instituições de ensino</li>
                </ul>
                <p><strong>A Odonto Master oferece soluções acessíveis e de qualidade para auxiliar o estudante a montar sua lista acadêmica com segurança e economia.</strong></p>
                
                <h4>Quais as melhores marcas de Endodontia?</h4>
                <p>A Odonto Master trabalha com marcas reconhecidas no mercado odontológico, que seguem rigorosos padrões de qualidade e inovação.</p>
                <p>Entre as principais marcas disponíveis estão:</p>
                <ul>
                    <li>Maillefer</li>
                    <li>Dentsply</li>
                    <li>Easy</li>
                    <li>Tanari</li>
                    <li>TDK</li>
                    <li>FGM</li>
                    <li>Biodinâmica</li>
                </ul>
                <p>Esses fabricantes oferecem materiais confiáveis para diferentes técnicas e níveis de complexidade clínica.</p>
                
                <h4>Onde comprar materiais de Endodontia?</h4>
                <p>Na Odonto Master, profissionais e estudantes encontram um portfólio completo de materiais de Endodontia, com marcas consolidadas, variedade de produtos e soluções pensadas para a rotina clínica e acadêmica.</p>
                <p><strong>Com uma experiência de compra facilitada e suporte especializado, a Odonto Master é a escolha certa para quem busca qualidade, segurança e confiança em Endodontia.</strong></p>
            `
        },
        'descartaveis': {
            title: 'Descartáveis',
            content: `
                <p>Os descartáveis odontológicos são itens indispensáveis para a rotina clínica, sendo fundamentais para garantir biossegurança, higiene e controle de infecção em consultórios, clínicas e ambientes acadêmicos.</p>
                <p>Seu uso correto reduz riscos de contaminação cruzada, protege profissionais e pacientes e assegura o cumprimento das normas sanitárias vigentes.</p>
                <p><strong>A Odonto Master oferece uma linha completa de descartáveis desenvolvidos para proporcionar praticidade, conforto e segurança durante os atendimentos odontológicos.</strong></p>
                
                <h3>Principais descartáveis utilizados na Odontologia</h3>
                <p>Os descartáveis odontológicos estão presentes em praticamente todos os procedimentos clínicos. Entre os principais itens utilizados no dia a dia estão:</p>
                <ul>
                    <li>Luvas descartáveis (látex, nitrilo e vinil)</li>
                    <li>Máscaras cirúrgicas e respiratórias</li>
                    <li>Gorros e toucas descartáveis</li>
                    <li>Aventais e campos cirúrgicos</li>
                    <li>Sugadores descartáveis</li>
                    <li>Copos descartáveis para bochecho</li>
                    <li>Babadores e protetores odontológicos</li>
                    <li>Cânulas e acessórios descartáveis</li>
                </ul>
                <p>Esses materiais garantem um ambiente clínico mais seguro, organizado e alinhado às boas práticas de biossegurança.</p>
                
                <h4>Benefícios do uso de descartáveis de qualidade</h4>
                <p>O uso de descartáveis adequados proporciona diversos benefícios para a rotina clínica, contribuindo diretamente para a segurança e eficiência dos atendimentos odontológicos. Entre os principais benefícios estão:</p>
                <ul>
                    <li>Maior segurança biológica para profissionais e pacientes</li>
                    <li>Redução de riscos infecciosos e de contaminação cruzada</li>
                    <li>Praticidade e agilidade no atendimento clínico</li>
                    <li>Conformidade com normas sanitárias e protocolos de biossegurança</li>
                    <li>Mais conforto e bem-estar para o paciente durante os procedimentos</li>
                </ul>
                <p>A escolha de descartáveis de qualidade é essencial para manter um ambiente clínico seguro, organizado e alinhado às exigências regulatórias.</p>
                
                <h4>Quais as melhores marcas de descartáveis odontológicos?</h4>
                <p>Com base no portfólio disponível, a Odonto Master trabalha com marcas reconhecidas no mercado odontológico e hospitalar, como:</p>
                <ul>
                    <li>Indusbello</li>
                    <li>Descarpack</li>
                    <li>Supermax</li>
                    <li>UniGloves</li>
                    <li>Medix</li>
                    <li>Bestcare</li>
                    <li>Qualy Bless</li>
                    <li>Mark Med</li>
                    <li>Granmask</li>
                    <li>Talge</li>
                    <li>SSplus</li>
                    <li>Cristófoli</li>
                    <li>Maquira</li>
                    <li>Preven</li>
                </ul>
                <p>Esses fabricantes seguem padrões rigorosos de qualidade, oferecendo descartáveis confiáveis, seguros e adequados para o uso profissional.</p>
                
                <h4>Onde comprar descartáveis odontológicos?</h4>
                <p>Na Odonto Master, profissionais e estudantes encontram uma linha completa de descartáveis odontológicos, com variedade de modelos, tamanhos e marcas para atender diferentes necessidades clínicas e acadêmicas.</p>
                <p><strong>Aqui você encontra praticidade, segurança e confiança para manter seu consultório sempre preparado e em conformidade com as exigências de biossegurança.</strong></p>
            `
        }
        // Adicionar mais páginas aqui conforme necessário
    };

    /**
     * Verifica se a URL atual corresponde a uma página configurada
     * @returns {string|null} A chave da página configurada ou null
     */
    function getCurrentPageKey() {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
        
        // Verificar se algum segmento da URL corresponde a uma página configurada
        for (const pageKey in pageContentConfig) {
            if (pathSegments.includes(pageKey)) {
                return pageKey;
            }
        }
        
        return null;
    }

    /**
     * Obtém o símbolo SVG da loja
     * @returns {string} URL do símbolo SVG
     */
    function getSymbolSvgUrl() {
        // Buscar em qualquer elemento que tenha o símbolo (carousel-icon)
        const existingSymbol = document.querySelector('.carousel-icon');
        if (existingSymbol && existingSymbol.src) {
            return existingSymbol.src;
        }
        
        // Buscar em wake-content-title
        const wakeTitle = document.querySelector('.wake-content-title .carousel-icon');
        if (wakeTitle && wakeTitle.src) {
            return wakeTitle.src;
        }
        
        // Fallback: construir URL baseado na estrutura esperada
        // A URL geralmente segue o padrão: /static/img/simbolo.svg?theme=...&v=...
        const baseUrl = window.location.origin;
        return baseUrl + '/static/img/simbolo.svg';
    }

    /**
     * Cria o elemento de conteúdo customizado
     * @param {string} pageKey - Chave da página configurada
     * @param {Object} pageConfig - Configuração da página (title e content)
     * @returns {HTMLElement} Elemento criado
     */
    function createCustomContentElement(pageKey, pageConfig) {
        // Container externo que centraliza (igual ao da página hotsite.html)
        const outerContainer = document.createElement('div');
        outerContainer.className = 'flex flex-col my-4 w-full lg:flex-row lg:justify-center';
        outerContainer.setAttribute('data-page-custom-content-wrapper', pageKey);
        
        // Container interno com items-center para centralizar
        const innerContainer = document.createElement('div');
        innerContainer.className = 'flex flex-col items-center w-full lg:max-w-[1330px] relative';
        
        // Wake-content-wrapper (igual ao componente content.html)
        const wrapper = document.createElement('div');
        wrapper.className = 'wake-content-wrapper flex flex-col w-full items-center justify-center px-4 py-6 lg:py-8';
        wrapper.setAttribute('data-page-custom-content', pageKey);
        
        // Wake-content-container
        const container = document.createElement('div');
        container.className = 'wake-content-container w-full lg:max-w-[1450px] p-6 lg:p-8';
        
        // Adicionar título se fornecido
        if (pageConfig.title && pageConfig.title.trim() !== '') {
            const title = document.createElement('h2');
            title.className = 'wake-content-title text-xl lg:text-2xl font-bold mb-4 pb-3 uppercase';
            
            // Criar ícone do símbolo
            const icon = document.createElement('img');
            icon.src = getSymbolSvgUrl();
            icon.alt = '';
            icon.className = 'carousel-icon';
            icon.style.cssText = 'display: inline-block !important; visibility: visible !important; opacity: 1 !important; height: 1.5em !important; min-height: 32px !important; max-height: 48px !important; width: auto !important; min-width: 32px !important; flex-shrink: 0 !important; vertical-align: middle !important;';
            
            // Criar span com o texto do título
            const titleSpan = document.createElement('span');
            titleSpan.textContent = pageConfig.title;
            
            title.appendChild(icon);
            title.appendChild(titleSpan);
            container.appendChild(title);
        }
        
        // Adicionar corpo do conteúdo
        const body = document.createElement('div');
        body.className = 'wake-content-body';
        body.style.textAlign = 'left';
        body.innerHTML = pageConfig.content || '';
        
        container.appendChild(body);
        wrapper.appendChild(container);
        innerContainer.appendChild(wrapper);
        outerContainer.appendChild(innerContainer);
        
        return outerContainer;
    }

    /**
     * Insere o conteúdo customizado na página
     * @param {HTMLElement} contentElement - Elemento a ser inserido (já contém o container externo)
     */
    function insertCustomContent(contentElement) {
        // Prioridade 1: Inserir após o container do content "Rodapé" (que tem a mesma estrutura)
        // Buscar pelo container externo que envolve o último wake-content-wrapper
        const lastContentContainer = document.querySelectorAll('div.flex.flex-col.my-4.w-full.lg\\:flex-row.lg\\:justify-center');
        if (lastContentContainer.length > 0) {
            // Verificar se o último container contém um wake-content-wrapper
            for (let i = lastContentContainer.length - 1; i >= 0; i--) {
                const container = lastContentContainer[i];
                const hasWakeContent = container.querySelector('.wake-content-wrapper');
                if (hasWakeContent && container.parentNode) {
                    container.parentNode.insertBefore(contentElement, container.nextSibling);
                    return;
                }
            }
        }
        
        // Prioridade 2: Inserir após o último wake-content-wrapper (content "Rodapé")
        const lastContentWrapper = document.querySelectorAll('.wake-content-wrapper');
        if (lastContentWrapper.length > 0) {
            const lastWrapper = lastContentWrapper[lastContentWrapper.length - 1];
            // Subir até encontrar o container externo
            let parent = lastWrapper.parentElement;
            while (parent && !parent.classList.contains('flex')) {
                parent = parent.parentElement;
            }
            if (parent && parent.parentNode) {
                parent.parentNode.insertBefore(contentElement, parent.nextSibling);
                return;
            }
        }
        
        // Prioridade 3: Inserir antes do wake_modal
        const wakeModal = document.querySelector('[class*="wake-modal"], [id*="wake-modal"]');
        if (wakeModal && wakeModal.parentNode) {
            wakeModal.parentNode.insertBefore(contentElement, wakeModal);
            return;
        }
        
        // Prioridade 4: Inserir antes do mobile_bottom_menu
        const mobileMenu = document.querySelector('[class*="mobile_bottom_menu"], [id*="mobile_bottom_menu"]');
        if (mobileMenu && mobileMenu.parentNode) {
            mobileMenu.parentNode.insertBefore(contentElement, mobileMenu);
            return;
        }
        
        // Prioridade 5: Inserir antes do footer
        const footer = document.querySelector('footer');
        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(contentElement, footer);
            return;
        }
        
        // Prioridade 6: Inserir antes do último script ou ao final do body
        const scripts = document.querySelectorAll('body > script');
        if (scripts.length > 0) {
            const lastScript = scripts[scripts.length - 1];
            lastScript.parentNode.insertBefore(contentElement, lastScript);
            return;
        }
        
        // Último recurso: inserir ao final do body
        document.body.appendChild(contentElement);
    }

    /**
     * Inicializa o script
     */
    function init() {
        const pageKey = getCurrentPageKey();
        
        if (!pageKey) {
            return; // Não é uma página configurada
        }
        
        const pageConfig = pageContentConfig[pageKey];
        
        if (!pageConfig || (!pageConfig.content || pageConfig.content.trim() === '')) {
            return; // Não há conteúdo configurado para esta página
        }
        
        // Aguardar o DOM estar completamente carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                const contentElement = createCustomContentElement(pageKey, pageConfig);
                insertCustomContent(contentElement);
            });
        } else {
            // DOM já está carregado
            const contentElement = createCustomContentElement(pageKey, pageConfig);
            insertCustomContent(contentElement);
        }
    }

    // Inicializar quando o script for carregado
    init();

    // Exportar função para atualizar conteúdo dinamicamente (se necessário)
    window.updatePageCustomContent = function(pageKey, config) {
        if (pageContentConfig[pageKey]) {
            // Atualizar configuração
            if (config.title !== undefined) {
                pageContentConfig[pageKey].title = config.title;
            }
            if (config.content !== undefined) {
                pageContentConfig[pageKey].content = config.content;
            }
            
            // Remover conteúdo existente se houver (buscar pelo wrapper externo)
            const existingContent = document.querySelector(`[data-page-custom-content-wrapper="${pageKey}"]`);
            if (existingContent) {
                existingContent.remove();
            } else {
                // Fallback: buscar pelo atributo interno
                const existingContentInner = document.querySelector(`[data-page-custom-content="${pageKey}"]`);
                if (existingContentInner) {
                    // Subir até encontrar o container externo
                    let parent = existingContentInner.closest('div.flex.flex-col.my-4');
                    if (parent) {
                        parent.remove();
                    } else {
                        existingContentInner.remove();
                    }
                }
            }
            
            // Criar e inserir novo conteúdo
            const pageConfig = pageContentConfig[pageKey];
            if (pageConfig.content && pageConfig.content.trim() !== '') {
                const contentElement = createCustomContentElement(pageKey, pageConfig);
                insertCustomContent(contentElement);
            }
        }
    };

})();

