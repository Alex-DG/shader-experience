import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Mesh, MeshStandardMaterial } from 'three'

import vertexShader from './shaders/particles/vertex.glsl'
import fragmentShader from './shaders/particles/fragment.glsl'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 30
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0xff0000 })
// )
// scene.add(cube)

/**
 * Torus
 */
// const geometry = new THREE.TorusKnotBufferGeometry(10, 3, 100, 16)
const geometry = new THREE.IcosahedronGeometry(4, 21)
// const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8)
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const geometry = new THREE.OctahedronGeometry(6, 20)
// const geometry = new THREE.IcosahedronGeometry(7, 14)
// const geometry = new THREE.BufferGeometry()
const count = 5000 * 3 // geometry.attributes.position.count
const positions = new Float32Array(geometry.attributes.position.count * 3)

for (let i = 0; i < geometry.attributes.position.count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 1))

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
})
// const material = new THREE.MeshBasicMaterial({ color: 'pink' })
// const material = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true, // add perspective if particles are far from the camera they will look smal, if close they will look bigger
//   color: new THREE.Color('#ff88cc'),
// })

const points = new THREE.Points(geometry, material)
points.scale.multiplyScalar(1.2)
scene.add(points)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

  // Update controls
  controls.update()

  // Update points
  // points.position.z = Math.sin(elapsedTime) * 2
  // points.rotation.y = elapsedTime
  //   points.rotation.x = elapsedTime * 0.05
  //   points.rotation.z = elapsedTime * 0.05

  // Update material
  material.uniforms.uTime.value = elapsedTime * 0.25

  //   for (let i = 0; i < count; i++) {
  //     const i3 = i * 3 // <=> particlesCount

  //     const x = geometry.attributes.position.array[i3]
  //     // const y =  particlesGeometry.attributes.array[i3 + 1]
  //     // const z =  particlesGeometry.attributes.array[i3 + 2]
  //     // geometry.attributes.position.array[i3] = Math.sin(elapsedTime + x)
  //     // geometry.attributes.position.array[i3 + 2] = Math.sin(elapsedTime + x)
  //   }

  //   geometry.attributes.position.needsUpdate = true

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
