require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: `ecruzolivera`,
    description: `Ernesto Cruz Olivera personal Website`,
    author: `Ernesto Cruz Olivera`,
    twitter: `ecruzolivera`,
    gitlab: `ecruzolivera`,
    linkedin: `ecruzolivera`,
    siteUrl: `https://ecruzolivera.tech/`,
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
        background_color: `#181A1B`,
        theme_color: `#181A1B`,
        display: `minimal-ui`,
        icon: `src/images/me.jpg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // query: `
        //   {
        //     site {
        //       siteMetadata {
        //         title
        //         description
        //         siteUrl
        //         site_url: siteUrl
        //       }
        //     }
        //   }
        // `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: `${site.siteMetadata.siteUrl}/${edge.node.frontmatter.slug}`,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              })
            },
            query: `
              {
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
                        slug
                      }
                      excerpt
                      timeToRead
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Ernesto's RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: '^/blog/',
            // optional configuration to specify external rss feed, such as feedburner
            // link: 'https://feeds.feedburner.com/gatsby/blog',
          },
        ],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    //`gatsby-plugin-offline`,
  ],
}
