import { useLoader } from '@react-three/fiber';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { MeshStandardMaterial, TextureLoader } from 'three';

import { useMemo } from 'react';

export function Buoy(props) {
    // Import custom model from public/models/
    const model = useLoader(ColladaLoader, '/models/buoy.dae');

    // Load texture file from public/textures/
    const texture = useLoader(TextureLoader, '/textures/buoy_texture.png');

    // useMemo only runs when the dependencies are updated which helps with performance
    const buoy = useMemo(() => {
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
            object={buoy.scene}
            {...props}
            dispose={null}
            scale={[5, 5, 5]}
        />
    )
}