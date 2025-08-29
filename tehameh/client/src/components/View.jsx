import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const geometry = new THREE.SphereGeometry(0.1, 8, 8);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const maxStarCount = 2;
const star = new THREE.Object3D();
const starMeshDefault = new THREE.InstancedMesh(geometry, material, maxStarCount);
starMeshDefault.instanceMatrix.setUsage( THREE.DynamicDrawUsage );


export default function GalaxyScene() {
    const mountRef = useRef(null);
    const [hudData, setHudData] = useState({
        position: { x: 0, y: 0, z: 0 },
        zoom: 1,
        velocity: 0,
        direction: { x: 0, y: 0, z: -1 },
        up: { x: 0, y: 1, z: 0 },
    });

    const velocityRef = useRef(0);
    const pressedKeys = useRef({});

    useEffect(() => {
        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000000");

        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Add a test point at (0, 0, 0)
        // const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        // const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
        // const point = new THREE.Mesh(geometry, material);
        // point.position.set(0, 0, 0);
        // scene.add(point);

        // Orbit Controls (for mouse rotation + zoom)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxZoom = 1.1
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;

        // Keyboard Movement Config
        const speed = 0.1;

        const handleKeyDown = (e) => {
            pressedKeys.current[e.key.toLowerCase()] = true;
        };
        const handleKeyUp = (e) => {
            pressedKeys.current[e.key.toLowerCase()] = false;
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            fetch("http://localhost:5000/star")
                .then(res => res.json())
                .then(data => {
                    Array.from(data).forEach((body, i) => {
                        const { x, y, z } = body.coordinates;

                        // === CREATE A STAR (POINT) ===
                        star.position.set(x, y, z);
                        star.rotation.set(
                            Math.random() * Math.PI * 2,
                            Math.random() * Math.PI * 2,
                            Math.random() * Math.PI * 2
                        );
                        star.scale.set(1, 1, 1);
                        star.updateMatrix();
                        starMeshDefault.setMatrixAt(i, star.matrix);

                        // Optional: add a label
                        const spriteCanvas = document.createElement("canvas");
                        const ctx = spriteCanvas.getContext("2d");
                        ctx.font = "20px Arial";
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(data.name, 10, 20);

                        const texture = new THREE.CanvasTexture(spriteCanvas);
                        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                        const sprite = new THREE.Sprite(spriteMaterial);
                        const offset = 0.1
                        sprite.position.set(x, y + offset, z);
                        scene.add(sprite);
                    })
                });
            starMeshDefault.instanceMatrix.needsUpdate = true;
            scene.add(starMeshDefault);

            // Compute forward, right, and up vectors relative to camera
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);

            const right = new THREE.Vector3();
            right.crossVectors(forward, camera.up).normalize();

            const up = new THREE.Vector3();
            up.copy(camera.up).normalize();

            // Track velocity for HUD
            velocityRef.current = 0;

            // Arrow Keys for Translation
            if (pressedKeys.current["arrowup"]) {
                camera.position.add(forward.clone().multiplyScalar(speed));
                velocityRef.current = speed;
            }
            if (pressedKeys.current["arrowdown"]) {
                camera.position.add(forward.clone().multiplyScalar(-speed));
                velocityRef.current = speed;
            }
            if (pressedKeys.current["arrowleft"]) {
                camera.position.add(right.clone().multiplyScalar(-speed));
                velocityRef.current = speed;
            }
            if (pressedKeys.current["arrowright"]) {
                camera.position.add(right.clone().multiplyScalar(speed));
                velocityRef.current = speed;
            }

            if (pressedKeys.current["w"]) {
                camera.position.addScaledVector(up, speed);
                velocityRef.current = speed;
            }
            if (pressedKeys.current["s"]) {
                camera.position.addScaledVector(up, -speed);
                velocityRef.current = speed;
            }
            if (pressedKeys.current["a"]) {
                camera.position.addScaledVector(right, -speed);
                velocityRef.current = speed;
            }
            if (pressedKeys.current["d"]) {
                camera.position.addScaledVector(right, speed);
                velocityRef.current = speed;
            }

            // Update HUD data
            setHudData({
                position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
                zoom: controls.target.distanceTo(camera.position).toFixed(2),
                velocity: velocityRef.current,
                direction: { x: forward.x, y: forward.y, z: forward.z },
                up: { x: up.x, y: up.y, z: up.z },
            });

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <>
            <div
                ref={mountRef}
                style={{
                    width: "100vw",
                    height: "100vh"
                }}
            />

            // {/* HUD Overlay */}
            <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "5%",
                background: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "8px",
                fontSize: "14px",
                fontFamily: "monospace",
                display: "flex",
                justifyContent: "space-around"
            }}>
                <span>POS: ({hudData.position.x.toFixed(2)}, {hudData.position.y.toFixed(2)}, {hudData.position.z.toFixed(2)})</span>
                <span>ZOOM: {hudData.zoom}</span>
                <span>VEL: {hudData.velocity.toFixed(2)}</span>
                <span>DIR: ({hudData.direction.x.toFixed(2)}, {hudData.direction.y.toFixed(2)}, {hudData.direction.z.toFixed(2)})</span>
                <span>UP: ({hudData.up.x.toFixed(2)}, {hudData.up.y.toFixed(2)}, {hudData.up.z.toFixed(2)})</span>
            </div>
        </>
    )
}