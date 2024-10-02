<template>
    <div class="q-pa-md q-bg-purple-5 q-text-white">
      <div class="q-gutter-md" style="max-width: 400px; margin: auto;">
        <h2 class="text-center create-title">Create Customer</h2>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="first_name" label="First Name" class="bg-white text-black" />
          <q-input v-model="last_name" label="Last Name" class="bg-white text-black" />
          <q-input v-model="email" label="Email" class="bg-white text-black" />
          <q-input v-model="address" label="Address" class="bg-white text-black" />
          <q-input v-model="phone_number" label="Phone Number" class="bg-white text-black" />
          <q-btn type="submit" color="primary" label="Submit" class="full-width" />
        </q-form>
      </div>
     
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import router from '../router'
  
  const first_name = ref('')
  const last_name = ref('')
  const email = ref('')
  const address = ref('')
  const phone_number = ref('')

  
  const onSubmit = () => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
  
    const raw = JSON.stringify({
      "first_name": first_name.value,
      "last_name": last_name.value,
      "email": email.value,
      "address": address.value,
      "phone_number": phone_number.value
    })
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    }
  
    fetch('http://localhost:8800/api/v1/customers', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        alert(result.message)
        if (result.status === "ok") {
          router.push('/')
        }
      })
      .catch((error) => console.error(error))
  }
  </script>
  
  <style scoped>
  .create-title {
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
    