import React, { useState, useEffect } from 'react';
import DraggableItem2D from './DraggableItem2D';
import './Container2D.css'; // Untuk styling
// import { ItemData2D, ContainerDimensions2D } from '../types'; // Jika pakai TypeScript

const Container2D = ({ initialItems, containerDimensions, backgroundImage, onItemsUpdate }) => {
  // State untuk daftar item yang ditempatkan, yang bisa berubah karena drag
  const [items, setItems] = useState(initialItems);

  // Update state 'items' jika initialItems dari prop berubah (misal, saat load awal)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleItemPositionChange = (itemId, newPosition) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => (item.id === itemId ? { ...item, position: newPosition } : item));
      // Panggil callback untuk mengirim update ke komponen induk (misal, App.jsx)
      if (onItemsUpdate) {
        onItemsUpdate(updatedItems);
      }
      return updatedItems;
    });
  };

  return (
    <div
      className="container-2d"
      style={{
        width: containerDimensions.width,
        height: containerDimensions.height,
        backgroundImage: `url(${backgroundImage})`, // Gambar kontainer sebagai background
        backgroundSize: '100% 100%', // Menyesuaikan gambar dengan ukuran div
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        zIndex: containerDimensions.zIndex
      }}
    >
      <div
        style={{
          left: '0px',
          top: containerDimensions.height / 2 + 'px',
          width: containerDimensions.height + 'px',
          height: '0px',
          zIndex: '9999999',
          position: 'absolute',
          border: '5px solid red',
          borderStyle: 'dotted none none none'
        }}
      ></div>
      <div
        style={{
          left: containerDimensions.width / 2 + 'px',
          top: '0px',
          width: '0px',
          height: containerDimensions.height + 'px',
          zIndex: '9999999',
          position: 'absolute',
          border: '5px solid red',
          borderStyle: 'none dotted none none'
        }}
      ></div>
      {items.map(item => (
        <DraggableItem2D key={item.id} itemData={item} containerDimensions={containerDimensions} onPositionChange={handleItemPositionChange} />
      ))}
    </div>
  );
};

export default Container2D;
