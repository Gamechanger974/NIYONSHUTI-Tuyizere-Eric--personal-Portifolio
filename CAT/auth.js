// ===== SMARTSHOP AUTH SYSTEM =====
// Global authentication, validation, and user management

const SmartAuth = {

  // --- Storage Keys ---
  USERS_KEY: 'smartshop_users',
  SESSION_KEY: 'smartshop_session',

  // --- Simple hash simulation ---
  hashPassword(password) {
    let hash = 0;
    const salt = 'SmartShop@2026!';
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36) + str.length.toString(36);
  },

  // --- Sanitize input ---
  sanitize(str) {
    return String(str).replace(/[<>"'&]/g, '').trim();
  },

  // --- Get all users ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch { return []; }
  },

  // --- Save users ---
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  // --- Current session ---
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(this.SESSION_KEY));
    } catch { return null; }
  },

  // --- Protect page (call on every protected page) ---
  requireAuth() {
    const session = this.getSession();
    if (!session || !session.email) {
      window.location.href = 'login.html';
      return null;
    }
    return session;
  },

  // --- Register new user ---
  register(data) {
    const { name, email, phone, password } = data;
    const users = this.getUsers();

    // Check duplicate
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const user = {
      id: Date.now().toString(),
      name: this.sanitize(name),
      email: email.toLowerCase(),
      phone: this.sanitize(phone),
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      wishlist: [],
      orders: []
    };

    users.push(user);
    this.saveUsers(users);
    return { success: true, user };
  },

  // --- Login ---
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, error: 'Incorrect password.' };
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loginTime: Date.now()
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  },

  // --- Logout ---
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  }
};

// --- Validation helpers ---
const Validate = {
  email(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  },
  phone(val) {
    return /^\+250[0-9]{9}$/.test(val.trim().replace(/\s/g, ''));
  },
  password(val) {
    return {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
      score() {
        const checks = [this.length, this.upper, this.number, this.special];
        return checks.filter(Boolean).length;
      },
      isValid() { return this.score() >= 4; }
    };
  },
  name(val) {
    return val.trim().length >= 2;
  }
};

// --- Real-time field validation ---
function attachValidation(inputId, msgId, validator, requiredMsg) {
  const input = document.getElementById(inputId);
  const msg = document.getElementById(msgId);
  if (!input || !msg) return;

  input.addEventListener('input', () => {
    const val = input.value;
    if (!val) {
      input.className = 'form-control';
      msg.textContent = '';
      msg.className = 'field-msg';
      return;
    }
    const ok = typeof validator === 'function' ? validator(val) : validator;
    input.className = `form-control ${ok ? 'is-valid' : 'is-invalid'}`;
    msg.textContent = ok ? '✓ Looks good' : requiredMsg;
    msg.className = `field-msg ${ok ? 'valid' : 'invalid'}`;
  });
}

// --- Password strength bar ---
function attachPasswordStrength(inputId, barsId, msgId) {
  const input = document.getElementById(inputId);
  const bars = document.getElementById(barsId);
  const msg = document.getElementById(msgId);
  if (!input) return;

  input.addEventListener('input', () => {
    const result = Validate.password(input.value);
    const score = result.score();

    if (bars) {
      const barEls = bars.querySelectorAll('.pwd-bar');
      const labels = ['weak','weak','medium','strong'];
      barEls.forEach((bar, i) => {
        bar.className = 'pwd-bar' + (i < score ? ` ${labels[Math.min(score-1,3)]}` : '');
      });
    }

    if (msg) {
      const levels = ['','Weak','Weak','Medium','Strong'];
      const classes = ['','invalid','invalid','','valid'];
      if (input.value) {
        msg.textContent = levels[score] ? `Password strength: ${levels[score]}` : '';
        msg.className = `field-msg ${classes[score]}`;
        if (!result.isValid()) {
          const hints = [];
          if (!result.length) hints.push('8+ chars');
          if (!result.upper) hints.push('uppercase');
          if (!result.number) hints.push('number');
          if (!result.special) hints.push('special char');
          msg.textContent = `Need: ${hints.join(', ')}`;
          msg.className = 'field-msg invalid';
        }
      } else {
        msg.textContent = '';
      }
    }

    input.className = `form-control ${input.value ? (result.isValid() ? 'is-valid' : 'is-invalid') : ''}`;
  });
}

// --- Toast system ---
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    this.init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '📢'}</span>
      <span class="toast-msg">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
};

// --- Navbar init (call on every page) ---
function initNavbar(activePage) {
  const session = SmartAuth.getSession();

  // Cart count
  const cartData = JSON.parse(localStorage.getItem('smartshop_cart') || '[]');
  const count = cartData.reduce((a, i) => a + (i.qty || 1), 0);
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) cartCount.textContent = count > 0 ? count : '';

  // Active nav link
  if (activePage) {
    document.querySelectorAll('.navbar-links a').forEach(a => {
      if (a.href.includes(activePage)) a.classList.add('active');
    });
  }

  // Hamburger
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Logout
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => SmartAuth.logout());
  }

  // User greeting
  const userGreet = document.getElementById('userGreeting');
  if (userGreet && session) {
    userGreet.textContent = `Hi, ${session.name.split(' ')[0]}`;
  }
}

// --- Loader ---
function showLoader(msg = 'Processing...') {
  const loader = document.createElement('div');
  loader.className = 'loader-overlay';
  loader.id = 'globalLoader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <div class="loader-text">${msg}</div>`;
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById('globalLoader');
  if (loader) loader.remove();
}
