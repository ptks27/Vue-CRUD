<template>
    <div class="q-pa-md q-bg-purple-5 q-text-white">
      <div class="q-gutter-md" style="max-width: 400px; margin: auto;">
        <h2 class="text-center create-title">Create Product</h2>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input v-model="name" label="Product Name" required class="bg-white text-black" />
          <q-input v-model="description" label="Description" required class="bg-white text-black" />
          <q-input v-model="price" label="Price" type="number" required class="bg-white text-black" />
          <q-input v-model="category" label="Category" required class="bg-white text-black" />
          <q-input v-model="image_url" label="Image URL" type="url" required class="bg-white text-black" />
          <q-btn type="submit" color="primary" label="Submit" class="full-width" />
        </q-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import router from '../router'
  
  const name = ref('')
  const description = ref('')
  const price = ref('')
  const category = ref('')
  const image_url = ref('')
  
  const onSubmit = async () => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
  
    const raw = JSON.stringify({
      name: name.value,
      description: description.value,
      price: parseFloat(price.value),
      category: category.value,
      image_url: image_url.value
    })
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    }
  
    fetch('http://localhost:8800/api/v1/products', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        alert(result.message)
        if (result.status === "ok") {
          router.push('/home-product')
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
  