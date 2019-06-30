import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'gatsby'

const Header = ({ menuLinks, socialLinks }) => (
  <div className='flex justify-between max-w-2xl mx-auto my-4'>
    <ul className='flex'>
      {menuLinks.map(link => (
        <RouterLink to={link.to} key={link.to}>
          <li className='px-4 text-black border-black hover:border-b-2'>
            {link.text}
          </li>
        </RouterLink>
      ))}
    </ul>
    <ul className='flex'>
      {socialLinks.map(link => (
        <li key={link.to} className='px-4 text-black hover:opacity-50 text-xl'>
          <a href={link.to} target='_blank' rel='noopener noreferrer'>
            <i className={link.icon} />{' '}
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
