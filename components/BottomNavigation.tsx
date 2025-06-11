"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"

interface BottomNavigationProps {}

export default function BottomNavigation({}: BottomNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: "home",
      label: "Home",
      isCircular: true,
    },
    {
      href: "/cover-letter",
      icon: "cover-letter",
      label: "Cover letter",
      isCircular: false,
    },
    {
      href: "/my-space",
      icon: "my-space",
      label: "My Space",
      isCircular: false,
    }
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
              <div className="fixed bottom-0 left-0 right-0 px-4 pb-2 z-50 bg-transparent">
        {/* Navigation */}
        <div 
          className="p-[1px] rounded-[991.36px] inline-flex w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.2) 60%)',
          }}
        >
          <div 
            className="w-full p-2 bg-gradient-to-br from-white/10 via-gray-200/10 to-stone-300/10 rounded-[991.36px] shadow-[0px_1.982710838317871px_47.585060119628906px_-1.982710838317871px_rgba(0,0,0,0.18)] backdrop-blur-xl inline-flex justify-start items-center gap-1.5 overflow-hidden"
          >
            {navItems.map((item) => {
              const active = isActive(item.href)
              
              if (item.isCircular) {
                // Home button - circular design with active/inactive states
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-12 h-12 p-3 rounded-full flex justify-center items-center"
                    style={{
                      background: active 
                        ? 'linear-gradient(137deg, rgba(255, 255, 255, 0.77) 0%, rgba(113.69, 113.69, 113.69, 0.62) 95%)'
                        : 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                      boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                      borderRadius: '44.45px',
                      outline: active 
                        ? 'none'
                        : '1px rgba(255, 255, 255, 0.10) solid',
                      outlineOffset: active ? '-2px' : '-1px',
                      backdropFilter: 'blur(10.67px)',
                    }}
                  >
                    <CustomIcon name={item.icon} size={24} className="text-white" />
                  </Link>
                )
              } else {
                // Other buttons - rectangular design with active/inactive states
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex-1 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
                    style={{
                      background: active 
                        ? 'linear-gradient(137deg, rgba(255, 255, 255, 0.77) 0%, rgba(113.69, 113.69, 113.69, 0.62) 95%)'
                        : 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                      boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                      borderRadius: '44.45px',
                      outline: active 
                        ? 'none'
                        : '1px rgba(255, 255, 255, 0.10) solid',
                      outlineOffset: active ? '-2px' : '-1px',
                      backdropFilter: 'blur(10.67px)',
                    }}
                  >
                    <CustomIcon name={item.icon} size={24} className="text-white" />
                    <div 
                      className="text-center flex justify-center flex-col text-white"
                      style={{
                        fontSize: '14.43px',
                        fontWeight: '510',
                        lineHeight: '22.02px',
                      }}
                    >
                      {item.label}
                    </div>
                  </Link>
                )
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
} 