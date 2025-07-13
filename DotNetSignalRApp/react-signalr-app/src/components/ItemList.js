import React from 'react';

const ItemList = ({ items, onEdit, onDelete, canEdit = false, canDelete = false }) => {
  return (
    <div className="item-list">
      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            {(canEdit || canDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${item.price.toFixed(2)}</td>
              <td className={item.quantity < 10 ? 'low-stock' : ''}>{item.quantity}</td>
              {(canEdit || canDelete) && (
                <td>
                  {canEdit && (
                    <button onClick={() => onEdit(item)} className="edit-button">
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => onDelete(item.id)} className="delete-button">
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>No items found</p>}
    </div>
  );
};

export default ItemList;