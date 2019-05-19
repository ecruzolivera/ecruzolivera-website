import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'gatsby'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {},
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  links: {
    display: 'flex',
  },
  link: {
    padding: theme.spacing.unit,
    '&:hover': {
      opacity: 0.8,
    },
  },
  socialLinks: {
    display: 'flex',
  },
})

const Header = ({ links, socialLinks, classes }) => (
  <header className={classes.root}>
    <AppBar position='static' color='default'>
      <Toolbar className={classes.toolbar}>
        <div className={classes.links}>
          {links.map(link => (
            <Link component={RouterLink} to={link.to} className={classes.link}>
              {link.text}
            </Link>
          ))}
        </div>
        <div className={classes.socialLinks}>
          {socialLinks.map(link => (
            <Link
              href={link.to}
              target='_blank'
              rel='noreferrer'
              className={classes.link}
            >
              <Icon
                component='icon'
                fontSize='large'
                className={clsx(classes.link, link.icon)}
              />
            </Link>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  </header>
)

Header.propTypes = {
  links: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default withStyles(styles)(Header)
