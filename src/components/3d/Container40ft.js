import { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, ContactShadows, useGLTF, useCursor, Box, Html, Environment } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import { MeshBasicMaterial } from 'three';
// Reactive state model, using Valtio ...
const modes = ['translate', 'rotate', 'scale'];
const state = proxy({ current: null, mode: 0 });

function BoxItem({ position, size, color, name }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');

  return (
    <>
      <Box
        position={position}
        args={size}
        onPointerOver={e => {
          e.stopPropagation(); // Prevent event bubbling if necessary
          setShowTooltip(true);
          setTooltipContent(name);
        }}
        onPointerOut={() => {
          setShowTooltip(false);
          setTooltipContent('');
        }}
      >
        <meshStandardMaterial color={color} />
        {showTooltip && <Html position={[0, 0.7, 0]}>{tooltipContent}</Html>}
      </Box>
    </>
  );
}

function FortyFootContainer(props) {
  const { scene } = useGLTF('/shipping_container.glb');
  return <primitive object={scene} {...props} />;
}

const Container40ft = ({ containerItems, height }) => {
  const ActualSize = { PANJANG: 12000, LEBAR: 2340, TINGGI: 2280 };
  const KonversiSize = { PANJANG: 12000, LEBAR: 2340, TINGGI: 2280 };

  console.log(containerItems);
  return (
    <Canvas camera={{ position: [0, -50, 300] }} style={{ height: height }}>
      <Suspense fallback={null}>
        {/* <FortyFootContainer position={[50, -15, 0]} scale={[ResultSize.PANJANG, ResultSize.LEBAR, ResultSize.TINGGI]} /> */}
        <FortyFootContainer position={[0, -50, 320]} scale={[1, 1, 1]} />
        {containerItems.map((item, index) => {
          // if (item.id != 'LDXXX-1|1|10' && item.id != 'LDXXX-1|5|38') return <></>;
          // const calcX = parseFloat(item.x / 10) - parseFloat((2340 - item.x) / 234) + 56;
          const calcX = parseFloat(item.x / 31.5) - parseFloat((2340 - item.x) / 234) + parseFloat(item.width / 60) + 40.5;
          const calcY = parseFloat(item.y / 30) - parseFloat((12000 - item.y) / 1200) + parseFloat(item.length / 60) - 240;
          const calcZ = parseFloat(item.z / 24.2) - parseFloat((2280 - item.z) / 228) + parseFloat(item.height / 44) - 33;

          const calcWdth = parseFloat(item.length / 30);
          const calcLngth = parseFloat(item.width / 28);

          const position = [calcX, calcZ, calcY];
          const size = [calcLngth, item.height / 22, calcWdth];

          return (
            // <>
            //   <Box position={position} args={size} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            //     <meshStandardMaterial color={color} />
            //   </Box>
            //   {hovered && (
            //     <div
            //       style={{
            //         position: 'fixed',
            //         top: tooltipPosition.y,
            //         left: tooltipPosition.x,
            //         background: 'white',
            //         padding: '5px',
            //         borderRadius: '3px',
            //         pointerEvents: 'none', // Important for not interfering with 3D interactions
            //         zIndex: 1000
            //       }}
            //     >
            //       This is a Box!
            //     </div>
            //   )}
            // </>
            <BoxItem
              key={index}
              position={position}
              size={size}
              color={item.color} // Warna acak untuk setiap item
              name={item.name}
            />
          );
        })}
        <OrbitControls />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};
export default Container40ft;
