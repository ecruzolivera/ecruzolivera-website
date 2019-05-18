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
    header
    main
    footer
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
  },
  footer: {
    gridArea: 'footer',
  },
})

const Layout = ({ children, classes }) => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Libraries />
      <Header
        className={{ root: classes.header }}
        siteTitle={data.site.siteMetadata.title}
      />
      <main className={{ root: classes.main }}>{children}</main>
      <Footer className={{ root: classes.footer }} />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withStyles(styles)(Layout)
