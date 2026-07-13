import React, { useState, useRef, useEffect } from 'react';
import './DraggableItem2D.css'; // Untuk styling

const DraggableItem2D = ({ itemData, containerDimensions, onPositionChange }) => {
  const itemRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset dari posisi mouse ke sudut kiri atas item

  // Set posisi awal item berdasarkan itemData
  const [currentPosition, setCurrentPosition] = useState({
    x: itemData.position.x,
    y: itemData.position.y
  });

  // Update posisi jika itemData.position berubah dari prop (misal, saat load awal)
  useEffect(() => {
    setCurrentPosition({ x: itemData.position.x, y: itemData.position.y });
  }, [itemData.position.x, itemData.position.y]);

  const handleMouseDown = e => {
    // Hanya izinkan drag jika itu klik kiri mouse
    if (e.button !== 0) return;

    setIsDragging(true);
    // Hitung offset dari posisi mouse ke sudut kiri atas item
    const rect = itemRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Hentikan event propagation agar tidak mengganggu event lain (misal, scroll)
    e.stopPropagation();
    e.preventDefault(); // Mencegah default drag browser
  };

  const handleMouseMove = e => {
    if (!isDragging) return;

    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    // console.log('X,', e);

    // Mendapatkan ukuran kontainer
    const containerRect = itemRef.current.parentElement.getBoundingClientRect();
    console.log('X,', e, offset.x);

    // Hitung posisi relatif terhadap kontainer
    const relativeX = newX - containerRect.left;
    const relativeY = newY - containerRect.top;

    // Batasi pergerakan di dalam kontainer
    const clampedX = Math.max(0, Math.min(relativeX, containerDimensions.width - itemData.width));
    const clampedY = Math.max(0, Math.min(relativeY, containerDimensions.height - itemData.height));

    setCurrentPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Panggil callback untuk memberitahu komponen induk tentang posisi baru
    //   if (onPositionChange) {
    //     onPositionChange(itemData.id, currentPosition);
    //   }
  };
  const isrunn = useRef(false);

  useEffect(() => {
    if (isrunn.current === false) {
      if (!isDragging) {
        if (onPositionChange) {
          onPositionChange(itemData.id, currentPosition);
        }
      }
    }
  }, [isDragging]);

  // Tambahkan event listener global untuk mousemove dan mouseup
  // Ini penting agar drag tetap berfungsi meskipun mouse keluar dari item
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // Bergantung pada isDragging

  return (
    <div
      id={itemData.id}
      ref={itemRef}
      className="draggable-item"
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: itemData.width,
        height: itemData.height,
        backgroundColor: itemData.color || 'lightblue',
        // Pastikan z-index lebih tinggi saat digeser agar terlihat di atas
        zIndex: isDragging ? 10000000 : itemData.zIndex // ID unik bisa jadi z-index dasar
      }}
      onMouseDown={handleMouseDown}
      {...itemData.Action}
    >
      {itemData.label}
    </div>
  );
};

export default DraggableItem2D;
