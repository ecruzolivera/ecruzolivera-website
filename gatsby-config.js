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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-143250984-1',
        anonymize: true,
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        // develop: true, // Enable while using `gatsby develop`
        tailwind: true, // Enable tailwindcss support
        // whitelist: ['whitelist'], // Don't remove this selector
        ignore: ['prismjs/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      },
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-figure-caption`,
            options: {
              figureClassName: 'md-figure',
              captionClassName: 'md-figure-caption',
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'noreferrer',
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 750,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
          },
        ],
      },
    },
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
        name: `Ernesto Cruz Olivera Personal website`,
        short_name: `ecruzolivera`,
        start_url: `/`,
        background_color: `#F5F5F5`,
        theme_color: `#F5F5F5`,
        display: `minimal-ui`,
        icon: `src/images/me.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    //`gatsby-plugin-offline`,
  ],
}
