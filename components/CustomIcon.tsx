import Image from 'next/image'

interface CustomIconProps {
  name: string
  size?: number
  className?: string
}

export default function CustomIcon({ name, size = 24, className = "" }: CustomIconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  )
} 