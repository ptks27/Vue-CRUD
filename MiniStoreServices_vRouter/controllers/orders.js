const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    const { customerId, items, paymentMethod, totalAmount } = req.body; // ลบ orderDate

    if (!customerId || !items || !paymentMethod || !totalAmount) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    try {
        const order = await prisma.orders.create({
            data: {
                customer_id: customerId,
                // order_date ไม่ต้องส่งค่า เพราะจะใช้ default value
                order_status: 'processing',
                total_amount: totalAmount,
                orderdetail: {
                    create: items.map((item) => ({
                        product_id: item.productId,
                        quantity: item.quantity,
                        unit_price: item.unitPrice,
                    })),
                },
            },
        });

        const payment = await prisma.payments.create({
            data: {
                order_id: order.order_id,  // ใช้ order_id ที่เพิ่งสร้าง
                amount: totalAmount,
                payment_method: paymentMethod,
                payment_status: 'pending',
            },
        });

        console.log('Transaction committed:', { order, payment });
        res.status(201).json({ message: 'Order created successfully.', order });
    } catch (err) {
        console.error('Failed to create orders:', err.message);
        res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                orderdetail: true,  // รวมรายละเอียดคำสั่งซื้อ
                payments: true,     // รวมข้อมูลการชำระเงิน
            },
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
};


const getOrderById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
  
    try {
      const order = await prisma.orders.findUnique({
        where: {
          order_id: parseInt(id),  // แปลง id เป็นตัวเลข
        },
        include: {
          orderdetail: true,
          payments: true,
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(order);
    } catch (err) {
      console.error('Error fetching order:', err.message);
      res.status(500).json(err);
    }
  };

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { customerId, orderStatus, totalAmount } = req.body;

    try {
        const order = await prisma.orders.update({
            where: { order_id: parseInt(id) },
            data: {
                customer_id: customerId,
                order_status: orderStatus,
                total_amount: totalAmount,
            },
        });
        res.status(200).json(order);
    } catch (err) {
        console.error('Error updating order:', err.message);
        res.status(500).json(err);
    }
};
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.$transaction([
            prisma.orderDetail.deleteMany({ where: { order_id: parseInt(id) } }),
            prisma.payments.deleteMany({ where: { order_id: parseInt(id) } }),
            prisma.orders.delete({ where: { order_id: parseInt(id) } }),
        ]);
        res.status(200).json({ status: 'ok', message: 'Order deleted successfully.' });
    } catch (err) {
        console.error('Error deleting order:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { createOrder,getAllOrders, getOrderById, deleteOrder , updateOrder };

