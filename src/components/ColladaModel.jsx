import { useLoader } from '@react-three/fiber';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { MeshStandardMaterial, TextureLoader } from 'three';

import { useMemo, useState } from 'react';

export function ColladaModel({ modelPath, texturePath, scale, position, isProp = false }) {
    // Import custom model from public/models/
    const model = useLoader(ColladaLoader, modelPath);

    // Load texture file from public/textures/
    const texture = useLoader(TextureLoader, texturePath);

    // useMemo only runs when the dependencies are updated which helps with performance
    const texturedModel = useMemo(() => {
        // Create a custom material from the loaded texture
        const material = new MeshStandardMaterial({
            map: texture,
        });

        // Apply the custom material to each child mesh of the custom model
        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = material;

                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return model;
    }, [model, texture]);

    // Tracks hovering over movable models (props) to scale model on hover
    const [hovering, setHovering] = useState(false);
    const hoverScale = scale.map((num) => num * 1.25);

    return (
        <primitive
            object={texturedModel.scene}
            dispose={null}
            scale={(isProp && hovering) ? hoverScale : scale}
            position={position}
            onPointerOver={(_event) => {
                setHovering(true);
                if (isProp) document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(_event) => {
                setHovering(false);
                document.body.style.cursor = 'default';
            }}
        >
        </primitive >
    )
}