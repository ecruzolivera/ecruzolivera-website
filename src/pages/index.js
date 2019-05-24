import React from 'react'
import { Link as RouterLink } from 'gatsby'
import clsx from 'clsx'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'

import Layout from '../components/layout'
import SEO from '../components/seo'

const styles = theme => ({
  root: {
    maxWidth: '768px',
    margin: theme.spacing.unit,
    padding: 2 * theme.spacing.unit,
  },
})

const IndexPage = ({ classes }) => (
  <Layout>
    <SEO title='Home' />
    <Paper className={classes.root}>
      <Typography variant='body1' align='justify'>
        I'm a Developer with 7 years of experience designing and implementing
        software for Embedded Systems.
      </Typography>
      <Typography variant='body1' align='justify'>
        Colleagues know me as a highly creative engineer who can always be
        trusted to come up with a new approach. I spend a lot of time
        understanding the project requirements before start designing the
        solution. I can (and often do) work well alone, but I’m at my best
        collaborating with others.
      </Typography>
      <Typography variant='body1' align='justify'>
        My areas of interest are not only restricted to Embedded Systems, it
        also cover the fields of Digital Signal Processing and Web Development.
        You can read my thoughts in my{' '}
        <Link component={RouterLink} to={'/blog'} className={classes.link}>
          blog
        </Link>
        .
      </Typography>
    </Paper>
  </Layout>
)

export default withStyles(styles)(IndexPage)
