"use client"

import Link from 'next/link'
import { ElementType } from 'react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubMenuItem {
  icon: ElementType | string
  label: string
  path: string
  inactiveColor?: string
  activeColor?: string
}

interface MenuItemProps {
  icon: ElementType | string
  label: string
  colorString?: string
  activeColorString?: string
  sizeString?: number
  path: string
  subMenuItems?: SubMenuItem[]
  onClose?: () => void
}

const SVGIcon = ({
  svg,
  size,
  color
}: {
  svg: string
  size?: number
  color: string
}) => {
  const coloredSVG = svg
    .replace(/fill="currentColor"/g, `fill="${color}"`)
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/stroke="#[^"]*"/g, `stroke="${color}"`)
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
    .replace(/(stroke-width="[^"]*")/, '$1')
    .replace(/(stroke-linecap="[^"]*")/, '$1')
    .replace(/(stroke-linejoin="[^"]*")/, '$1')
    .replace(/fill="none"/g, 'fill="none"')
    .replace(/<defs>[\s\S]*?<\/defs>/g, (match) => {
      return match.replace(/fill="[^"]*"/, 'fill="white"');
    });

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
      dangerouslySetInnerHTML={{
        __html: coloredSVG
      }}
    />
  );
};

export default function MenuItem({
  icon: Icon,
  label,
  colorString = 'black',
  activeColorString = '#37169C',
  sizeString = 24,
  path,
  subMenuItems,
  onClose,
}: MenuItemProps) {
  const pathname = usePathname()
  const isActive = pathname === path ||
    (subMenuItems?.some(item => pathname === item.path) ?? false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const hasSubMenu = subMenuItems && subMenuItems.length > 0

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault()
      setIsSubmenuOpen(!isSubmenuOpen)
    } else {
      onClose?.()
    }
  }

  const handleSubMenuClick = () => {
    onClose?.()
  }

  const renderIcon = (
    iconProp: ElementType | string,
    size: number,
    isActive: boolean,
    activeColor: string = activeColorString,
    inactiveColor: string = colorString
  ) => {
    if (typeof iconProp === 'string') {
      return (
        <SVGIcon
          svg={iconProp}
          size={size}
          color={isActive ? activeColor : inactiveColor}
        />
      )
    } else {
      const IconComponent = iconProp
      return (
        <IconComponent
          size={size}
          className={`shrink-0 transition-colors duration-200`}
          style={{ color: isActive ? activeColor : inactiveColor }}
          aria-hidden="true"
        />
      )
    }
  }

  return (
    <div className="w-full">
      <Link
        href={path}
        onClick={handleClick}
        className={`
          w-full flex items-center p-2 md:p-3 rounded-lg
          transition-colors duration-200 ease-in-out
          hover:bg-gray-100
          ${isActive ? 'bg-[#F3F2FF]' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <div
          className="flex items-center w-full relative"
          aria-label={label}
        >
          {Icon && renderIcon(Icon, sizeString, isActive)}

          <span
            className={cn(`
              block pl-2 text-sm font-medium flex-1
              transition-colors duration-200 
            `, isActive ? "text-[#37169C] font-semibold" : "text-black")}
          >
            {label}
          </span>

          {hasSubMenu && (
            <ChevronUp
              className={`
                w-5 h-5 transition-transform duration-200
                ${isSubmenuOpen ? 'rotate-180' : ''}
              `}
              style={{ color: isActive ? activeColorString : colorString }}
            />
          )}

          {label === 'Following' && (
            <span
              className="absolute top-0 right-0 bg-blue-700 text-white text-xs 
                       rounded-full px-2 py-0.5 hidden md:block"
              aria-label="New updates available"
            >
              New
            </span>
          )}
        </div>
      </Link>

      {hasSubMenu && (
        <div
          className={`
            pl-4 mt-1 space-y-1
            transition-all duration-200 ease-in-out
            ${isSubmenuOpen
              ? 'max-h-[10vh] lg:max-h-[15vh] opacity-100 overflow-y-auto'
              : 'max-h-0 opacity-0 overflow-hidden'
            }
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400
          `}
        >
          {subMenuItems.map((item, index) => {
            const isSubItemActive = pathname === item.path

            return (
              <Link
                key={index}
                href={item.path}
                onClick={handleSubMenuClick}
                className={`
                  flex items-center p-2 rounded-lg
                  transition-colors duration-200 ease-in-out
                  hover:bg-gray-100 text-black
                  ${isSubItemActive ? 'bg-[#F3F2FF]' : ''}
                `}
              >
                {renderIcon(
                  item.icon,
                  sizeString - 4,
                  isSubItemActive,
                  item.activeColor,
                  item.inactiveColor
                )}
                <span
                  className={cn(`
                    block pl-2 text-black text-sm font-medium
                    transition-colors duration-200
                  `, isSubItemActive ? "text-[#37169C] font-semibold" : "text-black")}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}