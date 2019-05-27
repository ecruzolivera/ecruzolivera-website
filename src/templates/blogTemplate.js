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
    margin: theme.spacing.unit,
    padding: 2 * theme.spacing.unit,
  },
})

const blogTemplate = ({ classes }) => {
  const data = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                title
                description
                date(formatString: "DD MMMM YYYY")
                tags
              }
              excerpt
            }
          }
        }
      }
    `,
  )
  return (
    <Layout>
      <SEO title='Blog' />{' '}
      <Paper className={classes.root}>
        <Typography variant='h2' align='Center'>
          Blog 1
        </Typography>
      </Paper>
    </Layout>
  )
}

export default withStyles(styles)(blogTemplate)
