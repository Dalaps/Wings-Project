import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = ({ activeUser }) => {
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                console.log('Fetched products:', data); // Log fetched data

                // Set products if data exists
                if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                    calculateStockData(data.products);
                } else {
                    setError('No products found');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products: ' + error.message);
            } finally {
                setLoading(false); // Set loading to false at the end of the fetch
            }
        };

        fetchProducts();
    }, []);

    const calculateStockData = (products) => {
        const totalQty = products.reduce((sum, product) => sum + product.quantity, 0);
        setTotalQuantity(totalQty);
        const lowStock = products.filter((product) => product.quantity < 5);
        setLowStockProducts(lowStock);
    };

    // Prepare data for the stock graph
    const chartData = {
        labels: products.map((product) => product.name),
        datasets: [
            {
                label: 'Quantity in Stock',
                data: products.map((product) => product.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Conditional rendering based on loading and error states
    if (loading) {
        return <div>Loading...</div>; // Show loading text while fetching
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Show error message if there's an error
    }

    if (products.length === 0) {
        return <div>No products available</div>; // Show a message if no products are found
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to Wings Cafe Inventory Management, {activeUser}</h1>
            <h2>Stock Summary</h2>
            <p>Total Products: {products.length}</p>
            <p>Total Stock Quantity: {totalQuantity}</p>
            <p>Low Stock Products:</p>
            <ul>
                {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                        <li key={product.id} style={{ color: 'red' }}>
                            {product.name} - Only {product.quantity} left
                        </li>
                    ))
                ) : (
                    <li>All products are adequately stocked!</li>
                )}
            </ul>
            <h2>Stock Quantity Chart</h2>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default Dashboard;