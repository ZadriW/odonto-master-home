/* ===== HEADER JS - Baseado no projeto Base ===== */

(function() {
    'use strict';

    let initAttempts = 0;
    const MAX_ATTEMPTS = 20; // Tentar por até 2 segundos (20 * 100ms)

    function initializeHeader() {
        initAttempts++;
        console.log('Header JS - Initializing... (Attempt ' + initAttempts + '/' + MAX_ATTEMPTS + ')');
        console.log('Document ready state:', document.readyState);

        // ===== AUTOCOMPLETE =====

        const searchInput = document.getElementById('search-bar');
        const autocompleteContainer = document.getElementById('autocomplete-list');

        if (searchInput && autocompleteContainer) {
            console.log('Autocomplete elements found');
        }

        // ===== DROPDOWN USER LOGIN =====
        const loggedUser = document.getElementById('logged-user');
        const userDropdown = loggedUser ? loggedUser.querySelector('div[class*="group-hover"]') : null;

        if (loggedUser && userDropdown && window.innerWidth >= 1024) {
            let userHideTimeout = null;
            let userShowTimeout = null;
            let mouseInUser = false;
            let mouseInDropdown = false;

            console.log('User Login Dropdown Elements:', {
                loggedUser: !!loggedUser,
                userDropdown: !!userDropdown
            });

            function showUserDropdown() {
                console.log('Showing user dropdown');
                if (userHideTimeout) {
                    clearTimeout(userHideTimeout);
                    userHideTimeout = null;
                }
                
                if (userShowTimeout) {
                    clearTimeout(userShowTimeout);
                    userShowTimeout = null;
                }
                
                userShowTimeout = setTimeout(function() {
                    userDropdown.classList.add('user-dropdown-open');
                    userShowTimeout = null;
                }, 100);
            }

            function hideUserDropdown() {
                console.log('Hiding user dropdown (with delay)');
                if (userShowTimeout) {
                    clearTimeout(userShowTimeout);
                    userShowTimeout = null;
                }
                
                if (userHideTimeout) {
                    clearTimeout(userHideTimeout);
                    userHideTimeout = null;
                }


                userHideTimeout = setTimeout(function() {
                    if (!mouseInUser && !mouseInDropdown) {
                        console.log('User dropdown hidden');
                        userDropdown.classList.remove('user-dropdown-open');
                    }
                    userHideTimeout = null;
                }, 300);
            }


            userDropdown.classList.remove('user-dropdown-open');

            loggedUser.addEventListener('mouseenter', function() {
                mouseInUser = true;
                showUserDropdown();
            });

            loggedUser.addEventListener('mouseleave', function() {
                mouseInUser = false;
                hideUserDropdown();
            });

            userDropdown.addEventListener('mouseenter', function() {
                mouseInDropdown = true;
                showUserDropdown();
            });

            userDropdown.addEventListener('mouseleave', function() {
                mouseInDropdown = false;
                hideUserDropdown();
            });

            console.log('User Login dropdown initialized successfully with delays (100ms open, 300ms close)');
        } else if (loggedUser && userDropdown) {
            console.log('User Login dropdown found but in mobile mode - using native behavior');
        } else {
            console.log('User Login dropdown not found or user not logged in');
        }

        console.log('Header JS - Initialization complete');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHeader);
    } else {
        initializeHeader();
    }

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initAttempts = 0;
            initializeHeader();
        }, 250);
    });

})();
