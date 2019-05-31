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
  postList: {
    listStyleType: 'none',
  },
})

const blog = ({ classes }) => {
  const data = useStaticQuery(
    graphql`
      query {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 1000
        ) {
          edges {
            node {
              frontmatter {
                date(formatString: "DD MMMM YYYY")
                tags
                description
                title
              }
              excerpt
              timeToRead
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
          Blog
        </Typography>
        <ul className={classes.postList}>
          {data.allMarkdownRemark.edges.map(edge => (
            <li key={edge.node.frontmatter.title}>
              <Typography variant='h5'>
                {edge.node.frontmatter.title}
              </Typography>
              <Typography variant='subtitle1'>
                {edge.node.frontmatter.date}
              </Typography>
              <Typography variant='paragraph'>{edge.node.excerpt}</Typography>
            </li>
          ))}
        </ul>
      </Paper>
    </Layout>
  )
}

export default withStyles(styles)(blog)
