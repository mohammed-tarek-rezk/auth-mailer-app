import { motion } from "framer-motion";

function FloatingShapes({ color, top, left, delay, size }) {

  return <motion.dev
   className={`absolute rounded-full ${color} ${size} blur-xl opacity-20`}
    style={{top , left}}


   animate={{
    y: ["0%", "100%", "0%"],
    x: ["0%", "100%", "0%"],
    rotate: [0, 360],
    
  }}

  transition={{
    duration: 20,
    ease: "linear",
    repeat: Infinity,
    delay,
  }}
  aria-hidden='true'
   />


}

export default FloatingShapes;
