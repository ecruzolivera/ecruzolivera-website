require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `ecruzolivera`,
    description: `Ernesto Cruz Olivera personal Website`,
    author: `Ernesto Cruz Olivera`,
    twitter: `ecruzolivera`,
    gitlab: `ecruzolivera`,
    linkedin: `ecruzolivera`,
    keywords: [
      `personal`,
      `blog`,
      `C`,
      `C/C++`,
      `embedded`,
      `microcontrollers`,
      `Real Time`,
      `State Machines`,
      `ReactJs`,
      `Javascript`,
    ],
  },
  plugins: [
    `gatsby-transformer-remark`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ecruzolivera`,
        short_name: `ecruzolivera`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/me.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
