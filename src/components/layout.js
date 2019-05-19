/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'

import Header from './header'
import Footer from './footer'
import Libraries from './libraries'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `
    'header'
    'main'
    'footer'
    `,
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: 'auto',
    height: '100vh',
  },
  header: {
    gridArea: 'header',
  },
  main: {
    gridArea: 'main',
    margin: '0 auto',
  },
  footer: {
    gridArea: 'footer',
  },
})

const Layout = ({ children, classes }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            twitter
            gitlab
            linkedin
          }
        }
      }
    `,
  )
  const links = [
    { text: 'Home', to: '/' },
    { text: 'Blog', to: '/blog' },
    { text: 'CV', to: '/cv' },
  ]
  const socialLinks = [
    {
      icon: 'fab fa-twitter',
      to: `https://twitter.com/${site.siteMetadata.twitter}`,
    },
    {
      icon: 'fab fa-gitlab',
      to: `https://gitlab.com/${site.siteMetadata.gitlab}`,
    },
    {
      icon: 'fab fa-linkedin',
      to: `https://www.linkedin.com/in/${site.siteMetadata.linkedin}`,
    },
  ]
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Libraries />
      <Header
        links={links}
        socialLinks={socialLinks}
        className={{ root: classes.header }}
      />
      <main className={classes.main}>{children}</main>
      <Footer className={{ root: classes.footer }} />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withStyles(styles)(Layout)
