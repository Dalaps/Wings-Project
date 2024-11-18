import React, { useState, useEffect } from 'react';

const ProductManagement = ({ onProductsChange }) => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ name: '', desc: '', category: '', price: '', quantity: '' });
    const [message, setMessage] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [sellQuantity, setSellQuantity] = useState(1);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products.');
            }

            const productsList = await response.json();
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const addOrUpdateProduct = async (e) => {
        e.preventDefault();

        const updatedProduct = {
            ...product,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity, 10),
        };

        const method = editIndex === -1 ? 'POST' : 'PUT';
        const url = editIndex === -1 
            ? 'http://localhost:5000/api/products' 
            : `http://localhost:5000/api/products/${products[editIndex]?.id}`;

        console.log('Updating product at index', editIndex, 'with id', products[editIndex]?.id);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || 'Error adding/updating product.');
            }

            const newProduct = await response.json();
            const updatedProducts = [...products];

            if (editIndex === -1) {
                updatedProducts.push(newProduct);
                setMessage('Product added successfully!');
            } else {
                updatedProducts[editIndex] = newProduct;
                setMessage('Product updated successfully!');
                setEditIndex(-1);
            }

            setProducts(updatedProducts);
            onProductsChange(updatedProducts); // Notify about the product change
            setProduct({ name: '', desc: '', category: '', price: '', quantity: '' });
        } catch (error) {
            setMessage(error.message);
            console.error('Error adding/updating product:', error.message);
        }
    };

    const handleEdit = (index) => {
        setProduct(products[index]);
        setEditIndex(index);
    };

    const handleDelete = async (index) => {
        const token = localStorage.getItem('token');
        const productToDelete = products[index];

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting product.');
            }

            const updatedProducts = products.filter((_, i) => i !== index);
            setProducts(updatedProducts);
            onProductsChange(updatedProducts); // Notify about the product change
            setMessage('Product deleted successfully!');
        } catch (error) {
            setMessage(error.message);
            console.error('Error deleting product:', error.message);
        }
    };

    const sellProduct = async (index) => {
        const productToSell = products[index];
        const token = localStorage.getItem('token');

        if (sellQuantity <= 0) {
            setMessage('Please enter a valid quantity to sell.');
            return;
        }
        if (productToSell.quantity < sellQuantity) {
            setMessage('Not enough quantity to sell!');
            return;
        }

        const updatedProduct = { ...productToSell, quantity: productToSell.quantity - sellQuantity };

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productToSell.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error selling product: ${errorBody}`);
            }

            const updated = await response.json();
            const updatedProducts = [...products];
            updatedProducts[index] = updated;

            setProducts(updatedProducts);
            onProductsChange(updatedProducts); // Notify about the product change
            setMessage('Product sold successfully!');
            setSellQuantity(1);
        } catch (error) {
            setMessage(error.message);
            console.error('Error selling product:', error.message);
        }
    };

    return (
        <div>
            <h2>Product Management</h2>
            <form onSubmit={addOrUpdateProduct}>
                <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="text"
                    name="desc"
                    value={product.desc}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
                <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    required
                />
                <button type="submit">{editIndex === -1 ? 'Add Product' : 'Update Product'}</button>
            </form>

            {message && <p>{message}</p>}

            <h3>Product List</h3>
            <ul>
                {products.map((p, index) => (
                    <li key={p.id}>
                        {p.name} - {p.price} - {p.quantity} - {p.category}
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                        <button onClick={() => sellProduct(index)}>Sell</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManagement;