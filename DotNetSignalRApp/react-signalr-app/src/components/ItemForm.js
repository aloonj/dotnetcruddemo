import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        quantity: item.quantity || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item,
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">{item?.id ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default ItemForm;