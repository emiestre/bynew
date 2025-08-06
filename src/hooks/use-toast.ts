import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const toast = React.useCallback(({ title, description, variant = "default" }: ToastProps) => {
    // Simple toast implementation using browser alert for demo
    // In a real app, you'd use a proper toast library like sonner or react-hot-toast
    const message = `${title}${description ? `\n${description}` : ''}`
    
    if (variant === "destructive") {
      console.error(message)
      alert(`Error: ${message}`)
    } else {
      console.log(message)
      alert(message)
    }
  }, [])

  return { toast }
}