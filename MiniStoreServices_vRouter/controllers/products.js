const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ส่วนของ Post
//insert one Product
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createProduct = async (req, res) => {
  const { product_id,name, description, price, category, image_url } = req.body;

  // Validate image_url
  if (image_url && !isValidUrl(image_url)) {
    return res.status(400).json({ error: "Invalid URL format for image_url" });
  }

  try {
    const prd = await prisma.products.create({
      data: {
        product_id,
        name,
        description,
        price,
        category,
        image_url,
      },
    });
    res.status(200).json({
      status: "ok",
      message: `User with ID = ${prd.product_id} is created`, // ส่ง ID ที่ถูกสร้างกลับไป
    });
  } catch (err) {
    console.error("Failed to create orders:", err.message);
    res.status(500).json(err);
  }
};

// ส่วนของ Put
// Update one Product
const updateProduct = async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  const { id } = req.params;

  // สร้างอ็อบเจ็กต์ข้อมูลสำหรับการอัปเดต
  const data = {};
  if (name) data.name = name;
  if (description) data.description = description;
  if (price) data.price = price;
  if (category) data.category = category;
  if (image_url) data.image_url = image_url;

  // ตรวจสอบว่ามีข้อมูลให้ปรับปรุงหรือไม่
  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No data provided for update.",
    });
  }

  try {
    const prd = await prisma.products.update({
      data,
      where: { product_id: Number(id) }, // ใช้ ID จาก URL
    });
    res.status(200).json({
      status: "ok",
      message: `Product with ID = ${id} is updated`,
      product: prd,
    });
  } catch (err) {
    // จัดการข้อผิดพลาดที่รู้จักจาก Prisma
    if (err.code === "P2002") {
      // ข้อผิดพลาดจากการละเมิดข้อกำหนดเฉพาะ (เช่น image_url ที่ซ้ำกัน)
      res.status(400).json({
        status: "error",
        message: "Image URL already exists.",
      });
    } else if (err.code === "P2025") {
      // ไม่พบเรคคอร์ด
      res.status(404).json({
        status: "error",
        message: `Product with ID = ${id} not found.`,
      });
    } else {
      // จัดการข้อผิดพลาดที่ไม่คาดคิด
      console.error("Update product error: ", err);
      res.status(500).json({
        status: "error",
        message: "An unexpected error occurred.",
      });
    }
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
    const existingCustomer = await prisma.products.findUnique({
      where: {
        product_id: Number(id), // ตรวจสอบว่า product_id เป็นตัวเลข
      },
    });

    // ถ้าไม่พบลูกค้า
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ลบลูกค้า
    await prisma.products.delete({
      where: {
        product_id: Number(id),
      },
    });

    // ส่งข้อความเมื่อทำการลบสำเร็จ
    res.status(200).json({
      status: "ok",
      message: `User with ID = ${id} is deleted`, // แสดง ID ที่ถูกลบ
    });
  } catch (err) {
    console.error("Delete customer error: ", err); // แสดงข้อผิดพลาดใน console
    res.status(500).json({ error: err.message }); // ส่งข้อความข้อผิดพลาดกลับไปที่ client
  }
};

// ส่วนของ get
// get all Product
const getProducts = async (req, res) => {
  const prds = await prisma.products.findMany();
  res.json(prds);
};

//get only one Product by product_id
const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const prd = await prisma.products.findUnique({
      where: { product_id: Number(id) },
    });
    if (!prd) {
      res.status(404).json({ message: "Product not found!" });
    } else {
      res.status(200).json(prd);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProductsByCat = async (req, res) => {
  const searchString = req.params.cat;
  try {
    const prds = await prisma.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchString,
            },
          },
          {
            category: {
              contains: searchString,
            },
          },
        ],
      },
    });
    if (!prds || prds.length == 0) {
      res.status(404).json({ message: "Product not found!" });
    } else {
      res.status(200).json(prds);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByCat,
};
