import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface Hero3DProps {
  onLoadingComplete?: () => void
}

export const Hero3D: React.FC<Hero3DProps> = ({ onLoadingComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene Setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create 3D Geometry - Animated Cubes
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({
      color: 0x0ea5e9, // Cyan color from brand
      emissive: 0x06b6d4,
      shininess: 100,
      wireframe: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = 0.5
    mesh.rotation.y = 0.5
    scene.add(mesh)
    meshRef.current = mesh

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x0ea5e9, 1)
    pointLight.position.set(-5, -5, 5)
    scene.add(pointLight)

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1
      mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (meshRef.current) {
        // Auto rotation
        meshRef.current.rotation.x += 0.002
        meshRef.current.rotation.y += 0.003

        // Mouse-based rotation (subtle)
        meshRef.current.rotation.x += (mouseY.current * 0.5 - meshRef.current.rotation.x) * 0.05
        meshRef.current.rotation.y += (mouseX.current * 0.5 - meshRef.current.rotation.y) * 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    // Loading complete after brief delay
    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoadingComplete?.()
    }, 500)

    // Cleanup
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [onLoadingComplete])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden"
    >
      {/* 3D Canvas Container */}
      <div className="absolute inset-0" />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center px-6"
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Creative
            </span>
            <br />
            <span>3D Experiences</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade 3D web experiences that captivate, convert, and compel action
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
              Explore Portfolio
            </button>
            <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
              Schedule Call
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-cyan-400 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-cyan-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles background */}
      <FloatingParticles />
    </div>
  )
}

/**
 * Floating Particles Component
 * Creates animated background particles
 */
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
