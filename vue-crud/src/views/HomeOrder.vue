<template>
  <div class="q-pa-md enhanced-layout">
    <div class="q-py-md">
      <q-btn icon="add" @click="onCreateOrder" label="Add Order" color="primary" class="add-btn q-mb-md" />
    </div>
    <q-table
      title="Order List"
      :rows="orderRows"
      :columns="orderColumns"
      row-key="order_id"
      class="custom-table shadow-2"
      :pagination.sync="pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input v-model="filter" placeholder="Search orders..." debounce="300" class="search-bar q-mr-md" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="action-buttons">
          <q-btn flat dense round icon="edit" @click="onEditOrder(props.row.order_id)" color="primary" />
          <q-btn flat dense round icon="delete" @click="onDeleteOrder(props.row.order_id)" color="negative" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router'

const orderColumns = ref([
  { name: 'order_id', align: 'center', label: 'Order ID', field: 'order_id', sortable: true },
  { name: 'customer_id', align: 'center', label: 'Customer ID', field: 'customer_id', sortable: true },
  { name: 'order_date', align: 'center', label: 'Order Date', field: 'order_date', sortable: true },
  { name: 'order_status', align: 'center', label: 'Status', field: 'order_status', sortable: true },
  { name: 'total_amount', align: 'center', label: 'Total Amount', field: 'total_amount', sortable: true },
  
]);

const orderRows = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10 })
const filter = ref('')

const fetchOrderData = async () => {
  fetch('http://localhost:8800/api/v1/orders') // เปลี่ยน URL เป็นคำสั่งซื้อ
    .then(res => res.json())
    .then(result => {
      orderRows.value = result
    })  }

fetchOrderData()

const onCreateOrder = () => {
  router.push('/create-order') // เปลี่ยนเส้นทางไปยังหน้าเพิ่มคำสั่งซื้อ
}

const onEditOrder = (id) => {
  router.push('/update-order/' + id) // เปลี่ยนเส้นทางไปยังหน้าแก้ไขคำสั่งซื้อ
}

const onDeleteOrder = (id) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOption = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`http://localhost:8800/api/v1/orders/${id}`, requestOption) // เปลี่ยน URL เป็นคำสั่งซื้อ
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      alert(result.message);
      if (result.status === 'ok') {
        orderRows.value = [...orderRows.value.filter(order => order.order_id !== id)];
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete the order. Please try again.');
    });
}
</script>

<style scoped>
/* Overall layout enhancements */
.enhanced-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Button enhancements */
.add-btn {
  background: linear-gradient(45deg, #43cea2, #185a9d);
  color: white;
  font-weight: bold;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Table header and body styling */
.custom-table {
  border-radius: 12px;
  overflow: hidden;
  font-family: sans-serif;
}

.q-table__header {
  background-color: #4A90E2; 
  color: white;
  font-size: 16px;
  padding: 16px;
}

.q-table__header th {
  font-weight: bold;
}

.q-table__body {
  background-color: #fafafa;
}

.q-table__row:hover {
  background-color: #f0f4f7;
}

/* Search bar customization */
.search-bar {
  width: 350px;
  border-radius: 20px;
  background-color: #f3f3f3;
  padding: 10px;
}

/* Action buttons enhancements */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-btn {
  margin: 0 8px;
}

.q-btn:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>
