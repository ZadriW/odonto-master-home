/**
 * Meus Dados (/account/my-data) — trim nas extremidades dos campos (input/textarea),
 * no blur (focusout) e imediatamente antes de Salvar/submit, evitando cadastro com espaços
 * acidentais. Escopo: .wake-account-wrapper nesta rota apenas.
 */
(function () {
    'use strict';

    var SKIP_TYPES = {
        hidden: true,
        radio: true,
        checkbox: true,
        submit: true,
        button: true,
        reset: true,
        file: true,
        image: true,
        range: true
    };

    function isMyDataPage() {
        var p = (window.location.pathname || '').toLowerCase();
        return p.indexOf('my-data') !== -1;
    }

    function trimAccountField(el) {
        if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return;
        var type = (el.type || '').toLowerCase();
        if (SKIP_TYPES[type]) return;
        if (typeof el.value !== 'string') return;
        var t = el.value.trim();
        if (el.value !== t) {
            el.value = t;
        }
    }

    function trimFormTree(root) {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        root.querySelectorAll('input, textarea').forEach(trimAccountField);
    }

    function getAccountWrapper() {
        return document.querySelector('.wake-account-wrapper');
    }

    function bindFormSubmitAndSaveClick(form) {
        if (!form || form.dataset.accountMyDataFormTrimBound === 'true') return;
        form.dataset.accountMyDataFormTrimBound = 'true';

        form.addEventListener(
            'submit',
            function () {
                trimFormTree(form);
            },
            true
        );

        form.addEventListener(
            'click',
            function (e) {
                var btn = e.target && e.target.closest && e.target.closest('button.save, button[type="submit"]');
                if (!btn || !form.contains(btn)) return;
                trimFormTree(form);
            },
            true
        );
    }

    function bindAllFormsInWrapper(wrapper) {
        wrapper.querySelectorAll('form').forEach(bindFormSubmitAndSaveClick);
    }

    function bindAccountMyDataTrim() {
        if (!isMyDataPage()) return;

        var wrapper = getAccountWrapper();
        if (!wrapper) return;

        if (wrapper.dataset.accountMyDataTrimInit !== 'true') {
            if (!wrapper.querySelector('form')) return;

            wrapper.dataset.accountMyDataTrimInit = 'true';

            wrapper.addEventListener(
                'focusout',
                function (e) {
                    var el = e.target;
                    if (!wrapper.contains(el)) return;
                    trimAccountField(el);
                },
                false
            );
        }

        bindAllFormsInWrapper(wrapper);
    }

    function init() {
        bindAccountMyDataTrim();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', function () {
        init();
        setTimeout(init, 400);
        setTimeout(init, 1200);
    });

    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(function () {
            if (!isMyDataPage()) return;
            init();
        }).observe(document.body, { childList: true, subtree: true });
    }
})();
