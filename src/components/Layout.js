/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./Header";
import Footer from "./Footer";
import Libraries from "./Libraries";

import "../global.css";
import classes from "./Layout.module.css";

const Layout = ({ children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            github
            gitlab
            linkedin
          }
        }
      }
    `
  );
  const links = [
    { text: "Me", to: "/" },
    { text: "Blog", to: "/blog" },
    { text: "CV", to: "/cv" }
  ];
  const socialLinks = [
    {
      icon: "fab fa-github",
      to: `https://github.com/${site.siteMetadata.github}`,
      label: "Contact me on github"
    },
    {
      icon: "fab fa-gitlab",
      to: `https://gitlab.com/${site.siteMetadata.gitlab}`,
      label: "My gitlab repositories"
    },
    {
      icon: "fab fa-linkedin",
      to: `https://www.linkedin.com/in/${site.siteMetadata.linkedin}`,
      label: "Contact me on linkedin"
    },
    {
      icon: "fas fa-envelope",
      to: `mailto:ecruzolivera@gmail.com?subject=Reaching%20Out&body=How%20are%20you`,
      label: "Contact me via email"
    },
    {
      icon: "fas fa-rss",
      to: `${site.siteMetadata.siteUrl}/rss.xml`,
      label: "RSS feed"
    }
  ];
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
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
