// Base URL for API
const API_URL = 'http://localhost:5000/api/products';

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error fetching products');
    }
    const data = await response.json();
    return data;  // Returns an array of products
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Error adding product');
    }
    const data = await response.json();
    return data;  // Returns the added product
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Error updating product');
    }
    const data = await response.json();
    return data;  // Returns the updated product
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting product');
    }
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
