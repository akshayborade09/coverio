"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:rounded-xl group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/90",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-red-500",
          cancelButton:
            "group-[.toast]:bg-red-600 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
