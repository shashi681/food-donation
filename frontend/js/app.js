// --- UI Elements ---
const views = document.querySelectorAll('.view');
const navUserInfo = document.getElementById('nav-user-info');
const logoutBtn = document.getElementById('logout-btn');

// Toast
const toast = document.getElementById('toast');
function showToast(message, type = 'success') {
    const icon = type === 'success' ? 'check-circle' : 'warning-circle';
    toast.innerHTML = `<i class="ph-fill ph-${icon}"></i> <span>${message}</span>`;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.className = 'toast', 3000);
}

function formatDate(dateString) { return new Date(dateString).toLocaleString(); }

// --- App State & Navigation ---
function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    if (token && role) {
        navUserInfo.textContent = `Hello, ${name}`;
        navUserInfo.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        
        switchView(role === 'restaurant' ? 'restaurant-dashboard' : 'ngo-dashboard');
        
        if (role === 'restaurant') loadRestaurantData();
        if (role === 'ngo') loadNgoData();
    } else {
        navUserInfo.style.display = 'none';
        logoutBtn.style.display = 'none';
        switchView('auth-section');
    }
}

function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    showToast('Logged out successfully');
    checkAuth();
});

// --- Auth Logic ---
let isLoginMode = true;
const authForm = document.getElementById('auth-form');
const authToggle = document.getElementById('toggle-auth-mode');
const authTitle = document.getElementById('auth-title');
const nameGroup = document.getElementById('name-group');
const roleGroup = document.getElementById('role-group');

authToggle.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
    nameGroup.style.display = isLoginMode ? 'none' : 'block';
    roleGroup.style.display = isLoginMode ? 'none' : 'block';
    
    document.getElementById('auth-submit').textContent = isLoginMode ? 'Login' : 'Sign Up';
    document.getElementById('auth-switch-text').textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
    authToggle.textContent = isLoginMode ? "Sign up here" : "Login here";
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('auth-submit');
    btn.disabled = true;

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        let res;

        if (isLoginMode) {
            res = await ApiService.login(email, password);
        } else {
            const name = document.getElementById('name').value;
            const role = document.getElementById('role').value;
            res = await ApiService.register({ name, email, password, role });
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);
        
        showToast(`Welcome ${res.name}!`);
        authForm.reset();
        checkAuth();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
    }
});


// --- Restaurant Logic ---
document.getElementById('add-food-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;

    try {
        const data = {
            name: document.getElementById('food-name').value,
            quantity: document.getElementById('food-qty').value,
            expiry: document.getElementById('food-expiry').value,
            location: document.getElementById('food-location').value,
        };
        await ApiService.addFood(data);
        showToast('Food donation posted!');
        e.target.reset();
        loadRestaurantData();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
    }
});

async function loadRestaurantData() {
    try {
        // Load My Foods
        const myFoods = await ApiService.getMyFood();
        const foodsListContainer = document.getElementById('my-foods-list');
        foodsListContainer.innerHTML = '';
        myFoods.forEach(food => {
            foodsListContainer.innerHTML += `
                <li>
                    <div class="item-details">
                        <div class="item-title">${food.name} (Qty: ${food.quantity})</div>
                        <p><i class="ph ph-clock"></i> Expiry: ${formatDate(food.expiry)} | <i class="ph ph-check-circle"></i> Available: ${food.isAvailable ? 'Yes' : 'No'}</p>
                    </div>
                </li>
            `;
        });

        // Load Incoming Requests
        const incomingReqs = await ApiService.getIncomingRequests();
        const reqListContainer = document.getElementById('incoming-requests-list');
        reqListContainer.innerHTML = '';
        
        incomingReqs.forEach(req => {
            const statusClass = `badge-${req.status}`;
            let actionButtons = '';
            
            if (req.status === 'pending') {
                actionButtons = `
                    <button class="btn btn-small btn-success" onclick="updateReqStatus('${req._id}', 'accepted')"><i class="ph ph-check"></i> Accept</button>
                    <button class="btn btn-small btn-danger" onclick="updateReqStatus('${req._id}', 'rejected')"><i class="ph ph-x"></i> Reject</button>
                `;
            }

            reqListContainer.innerHTML += `
                <li>
                    <div class="item-details">
                        <div class="item-title">${req.food.name} (Qty: ${req.food.quantity})</div>
                        <p><i class="ph ph-user"></i> Requested by: ${req.ngo.name}</p>
                        <span class="badge ${statusClass}">${req.status}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-direction: column;">${actionButtons}</div>
                </li>
            `;
        });
    } catch (err) {
        showToast('Failed to load data', 'error');
    }
}

// Global action for button click handlers
window.updateReqStatus = async (id, status) => {
    try {
        await ApiService.updateRequestStatus(id, status);
        showToast(`Request ${status}!`);
        // Refresh based on who clicked
        if(localStorage.getItem('role') === 'restaurant'){
             loadRestaurantData();
        } else {
             loadNgoData();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}


// --- NGO Logic ---
async function loadNgoData() {
    try {
        // Load Available Foods
        const availableFoods = await ApiService.getAvailableFood();
        const availableFoodsContainer = document.getElementById('available-foods-list');
        availableFoodsContainer.innerHTML = '';
        
        availableFoods.forEach(food => {
            availableFoodsContainer.innerHTML += `
                <li>
                    <div class="item-details" style="width: 100%;">
                        <div class="item-title">${food.name}</div>
                        <p><i class="ph ph-storefront"></i> Restaurant: ${food.restaurant.name}</p>
                        <p><i class="ph ph-hash"></i> Qty: ${food.quantity} | <i class="ph ph-map-pin"></i> Location: ${food.location}</p>
                        <p style="color:var(--danger)"><i class="ph ph-clock"></i> Expires: ${formatDate(food.expiry)}</p>
                    </div>
                    <button class="btn btn-primary full-width" onclick="requestFood('${food._id}')"><i class="ph ph-hand-grabbing"></i> Request Food</button>
                </li>
            `;
        });

        // Load My Requests
        const myReqs = await ApiService.getMyRequests();
        const reqListContainer = document.getElementById('my-requests-list');
        reqListContainer.innerHTML = '';
        
        myReqs.forEach(req => {
            const statusClass = `badge-${req.status}`;
            let completeBtn = '';
            
            // Allow NGO to mark as completed if it was accepted
            if (req.status === 'accepted') {
                completeBtn = `<button class="btn btn-small btn-warning" onclick="updateReqStatus('${req._id}', 'completed')" style="margin-top: 10px;"><i class="ph ph-check-square"></i> Mark Collected</button>`;
            }

            reqListContainer.innerHTML += `
                <li>
                    <div class="item-details" style="width: 100%;">
                        <div class="item-title">${req.food.name} (Qty: ${req.food.quantity})</div>
                        <p><i class="ph ph-storefront"></i> From: ${req.restaurant.name}</p>
                        <p><i class="ph ph-map-pin"></i> Pickup: ${req.food.location}</p>
                        <span class="badge ${statusClass}">${req.status}</span>
                        <div>${completeBtn}</div>
                    </div>
                </li>
            `;
        });
    } catch (err) {
       showToast('Failed to load data', 'error');
    }
}

window.requestFood = async (foodId) => {
    try {
        await ApiService.createRequest(foodId);
        showToast('Request sent to restaurant!');
        loadNgoData();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Check initially
checkAuth();
