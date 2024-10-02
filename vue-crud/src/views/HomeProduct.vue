<template>
  <div class="q-pa-md enhanced-layout">
    <div class="q-py-md">
      <q-btn icon="add" @click="onCreateProduct" label="Add Product" color="primary" class="add-btn q-mb-md" />
    </div>
    <q-table
      title="Product List"
      :rows="productRows"
      :columns="productColumns"
      row-key="product_id"
      class="custom-table shadow-2"
      :pagination.sync="pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input v-model="filter" placeholder="Search products..." debounce="300" class="search-bar q-mr-md" />
      </template>

      <template v-slot:body-cell-image_url="props">
        <q-td :props="props">
          <img :src="props.row.image_url" alt="Product Image" class="product-image" />
        </q-td>
      </template>
      
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="action-buttons">
          <q-btn flat dense round icon="edit" @click="onEditProduct(props.row.product_id)" color="primary" />
          <q-btn flat dense round icon="delete" @click="onDeleteProduct(props.row.product_id)" color="negative" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router'

const productColumns = ref([
{ name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
  { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
  { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
  { name: 'image_url', align: 'center', label: 'Image', field: 'image_url', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' },
])

const productRows = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10 })
const filter = ref('')

const fetchProductData = async () => {
  fetch('http://localhost:8800/api/v1/products')
    .then(res => res.json())
    .then(result => {
      productRows.value = result
    })
}

fetchProductData()

const onCreateProduct = () => {
  router.push('/create-product')
}

const onEditProduct = (id) => {
  router.push('/update-product/' + id)
}

const onDeleteProduct = (id) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOption = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`http://localhost:8800/api/v1/products/${id}`, requestOption)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      alert(result.message);
      if (result.status === 'ok') {
        productRows.value = [...productRows.value.filter(product => product.product_id !== id)];
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete the product. Please try again.');
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

/* Product Image styling */
.product-image {
  width: 120px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
