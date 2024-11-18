import React, { useState, useEffect } from 'react';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            // Simulate a call to API to get products
            const mockApiResponse = [
                { id: 1, name: 'Product A', quantity: 20, price: 15.5 },
                { id: 2, name: 'Product B', quantity: 5, price: 25.0 },
                { id: 3, name: 'Product C', quantity: 10, price: 8.0 },
            ];
            setProducts(mockApiResponse);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <h1>Stock Management</h1>
            <h3>Product List</h3>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <span>
                                {product.name} - Qty: {product.quantity} - Price: ${product.price.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default StockManagement;