import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'white';
}

const Logo = ({ variant = 'default' }: LogoProps) => {
  const logoSrc = variant === 'white' ? "/assets/logoWhite.svg" : "/assets/ojslogo.svg";

  return (
    <div className='flex items-center relative mx-3 md:mx-0 min-w-36'>
      <Link href="/">
        <Image 
          src={logoSrc} 
          alt="Logo" 
          width={160} 
          height={60} 
          priority 
          className="object-contain"
        />
      </Link>
    </div>
  )
}

export default Logo