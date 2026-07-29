import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface CinematicScrollProps {
  children: React.ReactNode
  intensity?: number
}

export const CinematicScroll: React.FC<CinematicScrollProps> = ({
  children,
  intensity = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Parallax effects - reduced on mobile
  const parallaxIntensity = isMobile ? 0.3 : intensity

  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300 * parallaxIntensity])
  const midLayerY = useTransform(scrollY, [0, 1000], [0, 200 * parallaxIntensity])
  const foregroundY = useTransform(scrollY, [0, 1000], [0, 100 * parallaxIntensity])

  // 3D camera effects
  const rotateX = useTransform(scrollY, [0, 2000], [0, 15 * parallaxIntensity])
  const rotateY = useTransform(scrollY, [0, 2000], [-5 * parallaxIntensity, 5 * parallaxIntensity])
  const scale = useTransform(scrollY, [0, 2000], [1, 1.05 * parallaxIntensity])

  // Fade and opacity effects
  const opacity = useTransform(scrollY, [0, 500], [1, 0.7])
  const blur = useTransform(scrollY, [0, 1000], [0, 5])

  return (
    <motion.div
      ref={containerRef}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        scale,
        opacity,
      }}
      className="w-full perspective"
    >
      {/* Background Layer - Slowest Movement */}
      <motion.div
        style={{
          y: backgroundY,
          filter: blur,
        }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-900" />
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Mid Layer - Medium Movement */}
      <motion.div
        style={{
          y: midLayerY,
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Foreground Layer - Fastest Movement */}
      <motion.div
        style={{
          y: foregroundY,
        }}
        className="relative z-20 pointer-events-none"
      >
        {/* Optional foreground elements */}
      </motion.div>

      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />
    </motion.div>
  )
}

/**
 * Scroll Progress Indicator Component
 * Shows user's scroll position in real-time
 */
const ScrollProgressIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="fixed bottom-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 origin-right z-50"
      style={{ scaleX }}
    />
  )
}

/**
 * Staggered Reveal Component
 * Elements fade and slide in on scroll with stagger effect
 */
interface StaggeredRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.75 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const directionMap = {
    up: { initial: { y: 40 }, animate: { y: 0 } },
    down: { initial: { y: -40 }, animate: { y: 0 } },
    left: { initial: { x: 40 }, animate: { x: 0 } },
    right: { initial: { x: -40 }, animate: { x: 0 } },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ ...directionMap[direction].initial, opacity: 0 }}
      animate={
        isInView
          ? { ...directionMap[direction].animate, opacity: 1 }
          : { ...directionMap[direction].initial, opacity: 0 }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier from spec
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Parallax Section Component
 * Enhanced parallax for specific sections
 */
interface ParallaxSectionProps {
  children: React.ReactNode
  offset?: number
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  offset = 50,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollY, [0, 1000], [0, offset])

  return (
    <motion.div ref={ref} style={{ y }} className="w-full">
      {children}
    </motion.div>
  )
}
