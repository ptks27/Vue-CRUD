<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="onCreateCustomer" label="Add Customer" color="primary" class="add-customer-btn q-mb-md" />
    </div>
    <q-table
      title="Customer List"
      :rows="filteredCustomers"
      :columns="customerColumns"
      row-key="customer_id"
      class="custom-table shadow-3"
      :pagination.sync="pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input v-model="filter" placeholder="Search customers..." debounce="300" class="search-input q-mr-md" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" @click="onEditCustomer(props.row.customer_id)" color="primary" class="edit-btn" />
          <q-btn flat dense round icon="delete" @click="onDeleteCustomer(props.row.customer_id)" color="negative" class="delete-btn" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '../router'

// Customer Table Columns
const customerColumns = ref([
  { name: 'customer_id', align: 'center', label: 'Customer ID', field: 'customer_id', sortable: true },
  { name: 'first_name', align: 'center', label: 'First Name', field: 'first_name', sortable: true },
  { name: 'last_name', align: 'center', label: 'Last Name', field: 'last_name', sortable: true },
  { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
  { name: 'address', align: 'center', label: 'Address', field: 'address', sortable: true },
  { name: 'phone_number', align: 'center', label: 'Phone Number', field: 'phone_number', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' },
])

const customerRows = ref([]) // Customer data rows
const pagination = ref({ page: 1, rowsPerPage: 10 })
const filter = ref('')

// Fetch customer data
const fetchCustomerData = async () => {
  fetch('http://localhost:8800/api/v1/customers')
    .then(res => res.json())
    .then(result => {
      customerRows.value = result
    })
}

fetchCustomerData()

// Filtered Customers (only for specific columns)
const filteredCustomers = computed(() => {
  if (!filter.value) {
    return customerRows.value;
  }

  const search = filter.value.toLowerCase();

  return customerRows.value.filter((customer) =>
    ['customer_id', 'first_name', 'last_name', 'email', 'address', 'phone_number'].some(key =>
      String(customer[key]).toLowerCase().includes(search)
    )
  );
})

const onCreateCustomer = () => {
  router.push('/create')
}

const onEditCustomer = (id) => {
  router.push('/update/' + id)
}

const onDeleteCustomer = (id) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOption = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`http://localhost:8800/api/v1/customers/${id}`, requestOption)
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      if (result.status === "ok") {
        customerRows.value = customerRows.value.filter(customer => customer.customer_id !== id);
      }
    })
    .catch(error => console.log('error', error));
}
</script>

<style scoped>
/* Custom Table Styles similar to Product List */
.custom-table {
  border-radius: 15px;
  overflow: hidden;
}

.q-table__header {
  background-color: #3949ab; /* Change header color to a deep blue */
  color: white;
  font-weight: bold;
}

.q-table__header th {
  padding: 14px;
}

.q-table__body {
  background-color: #f4f4f4; /* Light gray for table body */
}

.q-table__row {
  transition: background-color 0.3s;
}

.q-table__row:hover {
  background-color: #e0e7ff; /* Light blue hover effect */
}

/* Button Styling */
.q-btn {
  margin: 0 5px;
}

.add-customer-btn {
  font-weight: bold;
  background: linear-gradient(to right, #36d1dc, #5b86e5); /* Gradient background */
  color: white;
  border-radius: 20px;
}

.edit-btn:hover {
  background-color: #bbdefb; /* Light blue hover effect for edit button */
}

.delete-btn:hover {
  background-color: #ffcccb; /* Light red hover effect for delete button */
}

/* Search Input Styling */
.search-input {
  width: 280px;
  border-radius: 8px;
}

/* Box Shadow for Elevation */
.shadow-3 {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
