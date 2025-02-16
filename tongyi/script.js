// 模拟数据存储
let currentUser = null;
let products = [
    {
        id: 1,
        name: "JavaScript高级程序设计",
        price: 99.00,
        category: "科技",
        stock: 100,
        image: "picture/book1.jpg",
        description: "深入理解JavaScript语言的权威指南"
    },
    // 可以添加更多商品...
];

let cart = [];

// 登录功能
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (!username || !password) {
        alert('请输入用户名和密码！');
        return;
    }

    // 模拟登录验证
    currentUser = {
        username,
        type: userType,
        avatar: 'default-avatar.png'
    };

    // 显示相应界面
    document.getElementById('loginSection').classList.add('hidden');
    if (userType === 'customer') {
        document.getElementById('customerSection').classList.remove('hidden');
        loadProducts();
    } else {
        document.getElementById('sellerSection').classList.remove('hidden');
        loadSellerDashboard();
    }
}

// 退出登录
function logout() {
    currentUser = null;
    cart = [];
    document.getElementById('customerSection').classList.add('hidden');
    document.getElementById('sellerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// 加载商品列表时根据分类过滤
function loadProducts(category = '全部') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products
        .filter(product => category === '全部' || product.category === category)
        .forEach(product => {
            const productElement = createProductCard(product);
            container.appendChild(productElement);
        });
}

// 创建商品卡片
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>¥${product.price.toFixed(2)}</p>
        <p>库存: ${product.stock}</p>
        <button onclick="addToCart(${product.id})">加入购物车</button>
    `;
    return div;
}

// 添加到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1,
            price: product.price
        });
    }

    updateCartDisplay();
}

// 更新购物车显示
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        total += item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <p>${product.name} x ${item.quantity}</p>
            <p>¥${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${item.productId})">删除</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    totalPrice.textContent = `¥${total.toFixed(2)}`;
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartDisplay();
}

// 结算
function checkout() {
    if (cart.length === 0) {
        alert('购物车是空的！');
        return;
    }

    alert('订单提交成功！');
    cart = [];
    updateCartDisplay();
}

// 添加新商品的表单显示
function showAddProductForm() {
    const formHtml = `
        <div id="addProductForm" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeAddProductForm()">&times;</span>
                <h2>添加新商品</h2>
                <input type="text" id="newProductName" placeholder="商品名称">
                <input type="number" id="newProductPrice" placeholder="价格">
                <input type="text" id="newProductCategory" placeholder="分类">
                <input type="number" id="newProductStock" placeholder="库存">
                <button onclick="addNewProduct()">添加商品</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

// 关闭添加商品表单
function closeAddProductForm() {
    const form = document.getElementById('addProductForm');
    if (form) {
        form.remove();
    }
}

// 添加新商品到列表
function addNewProduct() {
    const name = document.getElementById('newProductName').value;
    const price = parseFloat(document.getElementById('newProductPrice').value);
    const category = document.getElementById('newProductCategory').value;
    const stock = parseInt(document.getElementById('newProductStock').value);

    if (name && !isNaN(price) && category && !isNaN(stock)) {
        const newProduct = {
            id: products.length + 1,
            name,
            price,
            category,
            stock,
            image: 'picture/default-product.jpg',
            description: '新商品描述'
        };
        products.push(newProduct);
        closeAddProductForm();
        loadSellerProducts(); // 重新加载商家页面的商品列表
    } else {
        alert('请填写所有字段！');
    }
}

// 为分类按钮添加事件监听
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        loadProducts(this.textContent);
    });
});

// 加载商家页面的商品列表
function loadSellerProducts() {
    const container = document.getElementById('productsList');
    container.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>价格: ¥${product.price.toFixed(2)}</p>
            <p>库存: ${product.stock}</p>
            <button onclick="removeProduct(${product.id})">下架</button>
        `;
        container.appendChild(productElement);
    });
}

// 在商家登录后调用
function loadSellerDashboard() {
    initializeCharts();
    loadSellerProducts(); // 加载商家页面的商品列表
    // 加载订单列表等其他数据...
}
