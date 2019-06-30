/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import Header from './Header'
import Footer from './Footer'
import Libraries from './Libraries'

import '../global.css'
import classes from './Layout.module.css'

const Layout = ({ children }) => {
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
    { text: 'Me', to: '/' },
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
      <Libraries />
      <header className={classes.header}>
        <Header menuLinks={links} socialLinks={socialLinks} />
      </header>
      <main className={`${classes.main} mx-4`}>{children}</main>
      <footer className={classes.footer}>
        <Footer />
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
