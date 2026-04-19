// ===== SMARTSHOP CART SYSTEM =====

const Cart = {
  CART_KEY: 'smartshop_cart',

  get() {
    try { return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]'); }
    catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.updateCount();
    this.onCartChange && this.onCartChange(items);
  },

  add(product) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    this.save(items);
    Toast.show(`<strong>${product.name}</strong> added to cart!`, 'success');
  },

  remove(id) {
    const items = this.get().filter(i => i.id !== id);
    this.save(items);
  },

  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) {
      if (qty <= 0) { this.remove(id); return; }
      item.qty = qty;
      this.save(items);
    }
  },

  clear() {
    this.save([]);
  },

  count() {
    return this.get().reduce((a, i) => a + (i.qty || 1), 0);
  },

  total() {
    return this.get().reduce((a, i) => a + (i.price * (i.qty || 1)), 0);
  },

  updateCount() {
    const count = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count > 0 ? count : '';
    });
  }
};

// ===== PRODUCT DATA =====
const PRODUCTS = [
  // SALON / LIVING ROOM
  {
    id: 'p1', name: 'Luxury Sofa Set 3-Piece', category: 'SALON',
    price: 285000, oldPrice: 350000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    rating: 4.8, reviews: 124, badge: 'Best Seller', inStock: true
  },
  {
    id: 'p2', name: 'Scandinavian Coffee Table', category: 'SALON',
    price: 89000, oldPrice: 120000,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600',
    rating: 4.5, reviews: 67, badge: 'Sale', inStock: true
  },
  {
    id: 'p3', name: 'Modern TV Stand Unit', category: 'SALON',
    price: 145000, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    rating: 4.6, reviews: 89, badge: null, inStock: true
  },
  {
    id: 'p4', name: 'Velvet Accent Chair', category: 'SALON',
    price: 75000, oldPrice: 95000,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600',
    rating: 4.7, reviews: 52, badge: 'New', inStock: true
  },

  // BEDROOM
  {
    id: 'p5', name: 'King Size Platform Bed', category: 'BEDROOM',
    price: 320000, oldPrice: 420000,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
    rating: 4.9, reviews: 203, badge: 'Best Seller', inStock: true
  },
  {
    id: 'p6', name: 'Wardrobe 6-Door Mirror', category: 'BEDROOM',
    price: 265000, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    rating: 4.5, reviews: 78, badge: null, inStock: true
  },
  {
    id: 'p7', name: 'Bedside Table Set (2pcs)', category: 'BEDROOM',
    price: 58000, oldPrice: 72000,
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=600',
    rating: 4.3, reviews: 45, badge: 'Sale', inStock: true
  },
  {
    id: 'p8', name: 'Premium Mattress Queen', category: 'BEDROOM',
    price: 180000, oldPrice: 230000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    rating: 4.8, reviews: 167, badge: 'Hot Deal', inStock: true
  },

  // KITCHEN
  {
    id: 'p9', name: 'Kitchen Cabinet Set', category: 'KITCHEN',
    price: 480000, oldPrice: 600000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    rating: 4.7, reviews: 91, badge: 'Popular', inStock: true
  },
  {
    id: 'p10', name: 'Dining Table Set 6-Seater', category: 'KITCHEN',
    price: 210000, oldPrice: 270000,
    image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600',
    rating: 4.6, reviews: 112, badge: 'Best Seller', inStock: true
  },
  {
    id: 'p11', name: 'Bar Stools Set of 4', category: 'KITCHEN',
    price: 95000, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600',
    rating: 4.4, reviews: 38, badge: 'New', inStock: true
  },
  {
    id: 'p12', name: 'Kitchen Island Cart', category: 'KITCHEN',
    price: 125000, oldPrice: 158000,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    rating: 4.5, reviews: 55, badge: 'Sale', inStock: true
  },

  // OFFICE
  {
    id: 'p13', name: 'Ergonomic Office Chair', category: 'OFFICE',
    price: 145000, oldPrice: 185000,
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600',
    rating: 4.8, reviews: 245, badge: 'Best Seller', inStock: true
  },
  {
    id: 'p14', name: 'Executive Desk L-Shape', category: 'OFFICE',
    price: 195000, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    rating: 4.6, reviews: 73, badge: 'New', inStock: true
  },
  {
    id: 'p15', name: 'Bookshelf 5-Tier', category: 'OFFICE',
    price: 68000, oldPrice: 85000,
    image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=600',
    rating: 4.4, reviews: 62, badge: 'Sale', inStock: true
  },
  {
    id: 'p16', name: 'Filing Cabinet 4-Drawer', category: 'OFFICE',
    price: 115000, oldPrice: 140000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    rating: 4.3, reviews: 29, badge: null, inStock: false
  },

  // OUTDOOR
  {
    id: 'p17', name: 'Garden Patio Set 5-Piece', category: 'OUTDOOR',
    price: 295000, oldPrice: 380000,
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600',
    rating: 4.7, reviews: 84, badge: 'Summer Deal', inStock: true
  },
  {
    id: 'p18', name: 'Hammock with Frame', category: 'OUTDOOR',
    price: 72000, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    rating: 4.5, reviews: 41, badge: 'New', inStock: true
  }
];

// Format price in RWF
function formatPrice(amount) {
  return 'RWF ' + amount.toLocaleString('en-RW');
}

// Generate star rating HTML
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '★';
  if (half) html += '½';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '☆';
  return html;
}

// Render a product card
function renderProductCard(p) {
  return `
    <div class="product-card fade-in" data-id="${p.id}" data-category="${p.category}">
      <div style="position:relative;overflow:hidden;">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${!p.inStock ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;"><span style="background:#e74c3c;color:white;padding:0.4rem 1rem;border-radius:20px;font-weight:700;font-size:0.85rem;">Out of Stock</span></div>' : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">${renderStars(p.rating)} <small style="color:var(--text-muted)">(${p.reviews})</small></div>
        <div>
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        <div class="product-actions" style="margin-top:1rem;">
          <button class="btn-cart" onclick="Cart.add(PRODUCTS.find(x=>x.id==='${p.id}'))" ${!p.inStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
            🛒 Add to Cart
          </button>
          <button class="btn-wish" title="Wishlist" onclick="Toast.show('Added to wishlist!','info')">♡</button>
        </div>
      </div>
    </div>`;
}
