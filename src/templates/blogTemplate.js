import React from 'react'
import { Link as RouterLink, useStaticQuery, graphql } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'

import Layout from '../components/layout'
import SEO from '../components/seo'

const styles = theme => ({
  root: {
    maxWidth: '768px',
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
})

const blogTemplate = ({ classes, pageContext: { node } }) => (
  <Layout>
    <SEO title={`${node.frontmatter.title}`} description={`${node.excerp}`} />
    <Paper className={classes.root}>
      <Typography variant='h4'>{node.frontmatter.title}</Typography>
      <Typography variant='subtitle1'>{node.frontmatter.date}</Typography>
      <Typography variant='subtitle2'>{node.timeToRead} min</Typography>
      <div dangerouslySetInnerHTML={{ __html: node.html }} />
    </Paper>
  </Layout>
)

export default withStyles(styles)(blogTemplate)
