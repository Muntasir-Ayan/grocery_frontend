import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; 

interface Product {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product_name, setProductName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/shop');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/shop', {
        product_name,
        quantity,
        price,
      });
      const newProduct: Product = response.data;
      setProducts([...products, newProduct]);
      setProductName('');
      setQuantity(0);
      setPrice(0);
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      const response = await axios.put(`http://localhost:8081/shop/${editingProduct.id}`, {
        product_name: editingProduct.product_name,
        quantity: editingProduct.quantity,
        price: editingProduct.price,
      });
      const updatedProduct: Product = response.data;
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'product_name' | 'quantity' | 'price'
  ) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [field]: field === 'quantity' || field === 'price' ? parseFloat(e.target.value) : e.target.value,
      });
    }
  };

  const renderProductForm = () => (
    <div className="popup">
      <form onSubmit={handleProductSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            value={product_name}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );

  return (
    <div>
      <h1>Products</h1>
      <div>
        <h2>Add Product</h2>
        <button onClick={toggleAddPopup}>Add Product</button>
        {showAddPopup && renderProductForm()}
      </div>
      <div>
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.product_name}
                      onChange={(e) => handleInputChange(e, 'product_name')}
                    />
                  ) : (
                    product.product_name
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => handleInputChange(e, 'quantity')}
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => handleInputChange(e, 'price')}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <button onClick={handleSaveEdit}>Save</button>
                  ) : (
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
