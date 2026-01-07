let pageUser = null;
let checkUserLoginAttempts = 0;
const MAX_CHECK_ATTEMPTS = 50; // Maximum 5 seconds (50 * 100ms)

/**
 * Checks if the user is logged to change the site's login settings.
*/
async function checkUserLogin() {
    // Wait for client to be available with timeout
    if (typeof client === 'undefined' || !client) {
        checkUserLoginAttempts++;
        if (checkUserLoginAttempts < MAX_CHECK_ATTEMPTS) {
            setTimeout(checkUserLogin, 100);
        }
        return;
    }
    
    let user;
    try {
        user = await client.customer.get();
    
        const login = document.querySelectorAll("[id='login']");
        const userName = document.querySelectorAll("[id='user-name']");
        const userHref = document.querySelectorAll("[id='user-href']");
        const loggedUser = document.querySelectorAll("[id='logged-user']");
        const userAction = document.querySelectorAll("[id='user-action']");
        
        if(user?.data) {
            pageUser = user;
            // Garante que customerAccessToken está definido
            if (!pageUser.customerAccessToken) {
                const customerAccessToken = client.cookie.get('sf_customer_access_token');
                if (customerAccessToken) {
                    pageUser.customerAccessToken = customerAccessToken;
                }
            }
            const name = parseUserName(user.data.customerName);

            login.forEach(x => {
                x.classList.add('hidden');
            });

            loggedUser.forEach(x => {
                x.classList.remove('hidden');
                x.classList.add('flex', 'items-center');
            });
            
            userName.forEach(x => {
                x.innerHTML = `${name}`
            });
            
            userAction.forEach(x => {
                x.innerHTML = "Logout";
            });
        }
        else{
            login.forEach(x => {
                x.classList.remove('hidden');
            });

            loggedUser.forEach(x => {
                x.classList.add('hidden');
                x.classList.remove('flex', 'items-center');
            });
            
            userHref.forEach(x => {
                x.href += window.location.href;
            });
        }
        
        // Only call handleUserCheckDataLayerEvent if it exists
        if (typeof handleUserCheckDataLayerEvent === 'function') {
            try {
        await handleUserCheckDataLayerEvent(); 
            } catch (e) {
                // Silently fail if data layer event handler has issues
                console.warn('Data layer event handler error:', e);
            }
        }
        
        // Dispara evento para notificar que o usuário foi verificado
        window.dispatchEvent(new CustomEvent("userChecked"));
    } catch(error) {
        // Only log errors that are not related to unauthenticated users
        if (error && !error.message?.includes('unauthorized') && !error.message?.includes('401')) {
            console.warn('User login check error:', error);
    }
    }
}

// Initialize when DOM is ready or on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUserLogin);
} else {
    // DOM is already ready
    window.addEventListener("load", checkUserLogin, false);
}

function redirectToLogin(){
    const loginUrl = document.getElementById('login-url')?.value;
    if (!loginUrl) return;
    
    window.location = loginUrl + "?returnUrl=" + window.location.href;
}

/**
 * Returns the first name of the user.
 * @param {string} fullname - User full name.
*/
function parseUserName(fullname) {
    const names = fullname.split(" ");
    return names[0];
}

/**
 * Show user options on mouse enter.
*/
function userMouseEnter(){
    document.getElementById("user-options").style.display = "flex";
}

/**
 * Hides user options on mouse leave.
*/
function userMouseLeave(){
    document.getElementById("user-options").style.display = "none";
}