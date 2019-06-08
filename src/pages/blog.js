import React from 'react'
import { Link as RouterLink, useStaticQuery, graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const Blog = ({ classes }) => {
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
                slug
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
      <SEO title='Blog' />
      <article className='container max-w-xl mx-auto px-2 text-justify leading-loose'>
        <h1 className='text-center text-2xl font-medium leading-none mb-8'>Blog</h1>
        <ul>
          {data.allMarkdownRemark.edges.map(edge => (
            <li key={edge.node.frontmatter.title} className='hover:text-black mb-8'>
              <RouterLink
                to={edge.node.frontmatter.slug}
                key={edge.node.frontmatter.slug}
              >
                <h2 className='text-2xl'>{edge.node.frontmatter.title}</h2>
                <p className='text-sm'>{edge.node.frontmatter.date}</p>
                <p>{edge.node.excerpt}</p>
              </RouterLink>
            </li>
          ))}
        </ul>
      </article>
    </Layout>
  )
}

export default Blog
