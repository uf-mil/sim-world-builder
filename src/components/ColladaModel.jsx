import { useLoader } from '@react-three/fiber';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { MeshStandardMaterial, TextureLoader } from 'three';

import { useMemo } from 'react';

export function ColladaModel({ modelPath, texturePath, scale, position }) {
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

    return (
        <primitive
            object={texturedModel.scene}
            dispose={null}
            scale={scale}
            position={position}
        />
    )
}