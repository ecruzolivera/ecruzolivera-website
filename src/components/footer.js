import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(5, 0, 10),
  },
})

const Footer = ({ classes }) => (
  <footer className={classes.root}>
    <Typography variant='subtitle2' align='center'>
      Ernesto Cruz Olivera ©{new Date().getFullYear()}
    </Typography>
  </footer>
)

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Footer)
