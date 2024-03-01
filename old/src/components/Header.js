import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'gatsby'

const Header = ({ menuLinks, socialLinks }) => (
  <div className='flex justify-between max-w-2xl mx-auto my-4'>
    <ul className='flex'>
      {menuLinks.map(link => (
        <li>
          <RouterLink
            to={link.to}
            key={link.to}
            className='px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary'
          >
            {link.text}
          </RouterLink>
        </li>
      ))}
    </ul>
    <ul className='flex'>
      {socialLinks.map(link => (
        <li key={link.to}>
          <a
            href={link.to}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={link.label}
            className='text-lg px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary'
          >
            <i className={link.icon} />
          </a>
        </li>
      ))}
    </ul>
  </div>
)

Header.propTypes = {
  menuLinks: PropTypes.array.isRequired,
  socialLinks: PropTypes.array.isRequired,
}

export default Header
