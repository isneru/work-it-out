import { AnimatePresence, motion } from "framer-motion"
import { createContext, ReactNode, useState } from "react"

interface ToastContextData {
  addToast: (message: string, timeout?: number) => void
  removeToast: () => void
}

export const ToastContext = createContext({} as ToastContextData)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState({ message: "" })
  const [isToastVisible, setIsToastVisible] = useState(false)

  function addToast(message: string, timeout?: number) {
    if (isToastVisible) return
    setToast({ message })
    setIsToastVisible(true)

    if (timeout) setTimeout(removeToast, timeout)
  }

  function removeToast() {
    setIsToastVisible(false)
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <AnimatePresence>
        {isToastVisible && (
          <motion.div
            initial={{
              bottom: -200,
              opacity: 0
            }}
            animate={{
              bottom: 20,
              opacity: 1
            }}
            exit={{
              bottom: -200,
              opacity: 0
            }}
            transition={{
              duration: 0.5,
              type: "tween"
            }}
            className="fixed left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 ring-1 ring-white/20">
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}
