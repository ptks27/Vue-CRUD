<template>
    <div class="q-pa-md q-bg-purple-5 q-text-white">
      <div class="q-gutter-md" style="max-width: 400px; margin: auto;">
        <h2 class="text-center update-title">Update Customer</h2>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input v-model="id" label="ID" readonly class="bg-white text-black" />
          <q-input v-model="first_name" label="First Name" class="bg-white text-black" />
          <q-input v-model="last_name" label="Last Name" class="bg-white text-black" />
          <q-input v-model="email" label="Email" type="email" class="bg-white text-black" />
          <q-input v-model="address" label="Address" class="bg-white text-black" />
          <q-input v-model="phone_number" label="Phone Number" class="bg-white text-black" />
          <q-btn label="Update" type="submit" color="primary" class="full-width" />
        </q-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const id = ref(route.params.id);
  const first_name = ref('');
  const last_name = ref('');
  const email = ref('');
  const address = ref('');
  const phone_number = ref('');
  
  const fetchData = () => {
    fetch("http://localhost:8800/api/v1/customers/" + id.value)
      .then(res => res.json())
      .then(result => {
        first_name.value = result.first_name;
        last_name.value = result.last_name;
        email.value = result.email;
        address.value = result.address;
        phone_number.value = result.phone_number;
      });
  };
  
  fetchData();
  
  const onSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      address: address.value,
      phone_number: phone_number.value,
    });
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    fetch("http://localhost:8800/api/v1/customers/" + id.value, requestOptions)
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message || "Something went wrong");
          });
        }
        return response.json();
      })
      .then(result => {
        alert(result.message);
        if (result.status === 'ok') {
          router.push('/');
        }
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      });
  };
  </script>
  
  <style scoped>
  .update-title {
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 2rem;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
  }
  
  .q-input {
    border-radius: 5px;
  }
  
  .q-btn {
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .q-btn:hover {
    background-color: #1976d2; /* Darker shade on hover */
    transform: scale(1.05); /* Slight scale effect */
  }
  </style>
  