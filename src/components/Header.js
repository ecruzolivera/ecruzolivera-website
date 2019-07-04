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
            className='px-4 text-black border-b-2 hover:border-black'
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
            className='px-4 text-black border-b-2 hover:border-black'
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
