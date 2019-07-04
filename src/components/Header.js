import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

const Header = ({ menuLinks, socialLinks }) => (
  <div className='flex justify-between max-w-2xl mx-auto my-4'>
    <ul className='flex'>
      {menuLinks.map(link => (
        <li>
          <RouterLink
            to={link.to}
            key={link.to}
            className='px-2 pb-1 mx-1 text-black border-b-2 border-whitesmoke hover:border-black'
          >
            {link.text}
          </RouterLink>
        </li>
      ))}
    </ul>
    <ul className='flex'>
      {socialLinks.map(link => (
        <li key={link.to}>
          <OutboundLink
            href={link.to}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={link.label}
            className='text-lg px-2 pb-1 mx-1 text-black border-b-2 border-whitesmoke hover:border-black'
          >
            <i className={link.icon} />
          </OutboundLink>
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
