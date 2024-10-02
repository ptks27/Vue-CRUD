<template>
    <div class="q-pa-md q-bg-purple-5 q-text-white">
      <div class="q-gutter-md" style="max-width: 400px; margin: auto;">
        <h2 class="text-center update-title">Update Product</h2>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input v-model="id" label="ID" readonly class="bg-white text-black" />
          <q-input v-model="name" label="Product Name" class="bg-white text-black" />
          <q-input v-model="description" label="Description" class="bg-white text-black" />
          <q-input v-model="price" label="Price" type="number" class="bg-white text-black" />
          <q-input v-model="category" label="Category" class="bg-white text-black" />
          <q-input v-model="image_url" label="Image URL" class="bg-white text-black" />
          <q-btn label="Update" type="submit" color="primary" class="full-width" />
        </q-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const id = ref(route.params.id);
  const name = ref('');
  const description = ref('');
  const price = ref('');
  const category = ref('');
  const image_url = ref('');
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8800/api/v1/products/" + id.value);
      const result = await response.json();
      name.value = result.name;
      description.value = result.description;
      price.value = result.price;
      category.value = result.category;
      image_url.value = result.image_url;
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();
  
  const onSubmit = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      name: name.value,
      description: description.value,
      price: parseFloat(price.value),
      category: category.value,
      image_url: image_url.value,
    });
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response = await fetch('http://localhost:8800/api/v1/products/' + id.value, requestOptions);
      const result = await response.json();
  
      alert(result.message);
      if (result.status === 'ok') {
        router.push('/home-product'); // Adjust the route as needed
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
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
  