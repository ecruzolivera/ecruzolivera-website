import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'gatsby'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {},
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: theme.breakpoints.values['md'],
  },
  links: {
    display: 'flex',
  },
  link: {
    padding: theme.spacing(1),
    '&:hover': {
      opacity: 0.8,
    },
  },
  socialLinks: {
    display: 'flex',
  },
})

const Header = ({ links, socialLinks, classes }) => (
  <AppBar position='static' className={clsx(classes.root, classes.appBar)}>
    <Toolbar className={classes.toolbar}>
      <div className={classes.links}>
        {links.map(link => (
          <Link
            component={RouterLink}
            to={link.to}
            className={classes.link}
            key={link.to}
            color='inherit'
          >
            <Typography variant='h6'>{link.text} </Typography>
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
            key={link.to}
            color='inherit'
          >
            <Icon
              component='i'
              fontSize='inherit'
              className={clsx(classes.link, link.icon)}
            />
          </Link>
        ))}
      </div>
    </Toolbar>
  </AppBar>
)

Header.propTypes = {
  links: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default withStyles(styles)(Header)
