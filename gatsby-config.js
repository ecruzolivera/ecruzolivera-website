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
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
