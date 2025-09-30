require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Serve uploaded files
app.use('/uploads', express.static('uploads'));


// --------------------- CORS ---------------------

// --------------------- Body parser ---------------------
app.use(express.json());

// --------------------- Multer (file upload) ---------------------
const upload = multer({ dest: "uploads/" }); // stores uploaded files in /uploads folder

// --------------------- PostgreSQL ---------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});



const allowedOrigins = [
  "http://localhost:5173",                 // Vite dev server
  "https://development-1-3bvs.onrender.com" // Deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);

      // Allow only listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`Blocked CORS request from: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // required if your frontend uses cookies or auth headers
  })
);

// Handle preflight requests (OPTIONS)
app.options("*", cors());





// Test DB connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully on startup!");
    client.release();
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL on startup:", err);
  }
})();

// --------------------- Root endpoint ---------------------
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error("❌ Full query error:", err);
    res.status(500).send("Database error: " + err.message);
  }
});

// --------------------- Register endpoint ---------------------
app.post("/api/register", async (req, res) => {
  const { name, surname, role, email, password } = req.body;

  if (!name || !surname || !role || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, surname, role, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, surname, role, email, created_at
    `;

    const values = [name, surname, roleCapitalized, email, hashedPassword];
    const result = await pool.query(query, values);

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else if (err.code === "23514") {
      res.status(400).json({ error: "Invalid role" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
});

// --------------------- Login endpoint ---------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/products", upload.single("photo"), async (req, res) => {
  try {
    const { name, price, qty, location, category, phone_number, vendor_name } = req.body;
    const photoPath = req.file ? req.file.filename : null;

    if (!name || !price || !qty || !location || !category || !phone_number || !vendor_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const insertQuery = `
      INSERT INTO products (name, price, qty, photo, location, category, phone_number, vendor_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [name, price, qty, photoPath, location, category, phone_number, vendor_name];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    console.error("❌ Error inserting product:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(p.vendor_name, u.name) AS owner_name,
        p.phone_number AS owner_phone,
        p.location
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC;
    `);
    res.json({ products: result.rows });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});// --------------------- Vendors endpoint ---------------------
app.get("/api/vendors", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM users
      WHERE role = 'Vendor'
      ORDER BY name;
    `);

    res.json({ vendors: result.rows });
  } catch (err) {
    console.error("❌ Error fetching vendors:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// You don’t have a DELETE /api/products/:id yet
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully", product: result.rows[0] });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------- Get Orders for Vendor ---------------------
app.get("/api/orders/vendor/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Get all orders for products that belong to this vendor
    const result = await pool.query(`
      SELECT o.id, o.product_id, o.customer_id, o.quantity, o.total_price, o.created_at,
             p.name AS product_name,
             u.name AS customer_name, u.surname AS customer_surname
      FROM orders o
      JOIN products p ON o.product_id = p.id
      LEFT JOIN users u ON o.customer_id = u.id
      WHERE p.user_id = $1
      ORDER BY o.created_at DESC;
    `, [vendorId]);

    // Return count and orders
    res.json({
      count: result.rows.length,
      orders: result.rows
    });
  } catch (err) {
    console.error("❌ Error fetching vendor orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});




// Endpoint to retrieve customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, surname, email FROM users WHERE role='Customer'`
    );
    res.json({ customers: result.rows });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// --------------------- Orders endpoint ---------------------
// --------------------- Create Order ---------------------
app.post("/api/orders", async (req, res) => {
  const { productId, customerId, quantity } = req.body;

  if (!productId || !customerId || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get product price
    const productResult = await pool.query("SELECT price FROM products WHERE id = $1", [productId]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = productResult.rows[0].price;
    const totalPrice = (price * quantity).toFixed(2);

    // Insert into orders table
    const insertQuery = `
      INSERT INTO orders (product_id, customer_id, quantity, total_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [productId, customerId, quantity, totalPrice];

    const orderResult = await pool.query(insertQuery, values);

    res.status(201).json({ order: orderResult.rows[0] });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// --------------------- Get All Orders with Customer and Product Names ---------------------
// --------------------- Get All Orders with Customer and Product Names ---------------------
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.quantity,
        o.total_price,
        o.status,
        o.created_at,
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        p.photo AS product_photo,
        u.id AS customer_id,
        u.name AS customer_name,
        u.surname AS customer_surname,
        p.user_id AS vendor_id
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      LEFT JOIN users u ON o.customer_id = u.id
      ORDER BY o.created_at DESC;
    `);

    res.json({ orders: result.rows });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------- Accept / Update Order Status ---------------------
app.patch("/api/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Status is required" });

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, orderId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json({ order: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------- Get Orders for a Customer ---------------------
app.get("/api/orders/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.product_id,
        o.quantity,
        o.total_price,
        o.status,
        o.created_at,
        p.name AS product_name,
        p.price AS product_price,
        p.photo AS product_photo,
        p.user_id AS vendor_id
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.customer_id = $1
      ORDER BY o.created_at DESC;
    `, [customerId]);

    res.json({ count: result.rows.length, orders: result.rows });
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// --------------------- Catch-all ---------------------
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// --------------------- Start server ---------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
