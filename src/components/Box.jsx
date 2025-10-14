import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export function Box(props) {
    // Gives us direct access to THREE.Mesh object
    const ref = useRef();

    // Tracks hover and click state for events
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Subscribe this component to the update loop and rotate the mesh every frame
    useFrame((_state, delta) => (ref.current.rotation.x += delta));

    //
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => setClicked(!clicked)}
            onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
            onPointerOut={(event) => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )

}