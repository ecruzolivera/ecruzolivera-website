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
        <h1 className='text-center text-2xl font-medium leading-none mb-8'>
          Blog
        </h1>
        <ul>
          {data.allMarkdownRemark.edges.map(edge => (
            <li
              key={edge.node.frontmatter.title}
              className='border-l-2 hover:border-black transition-400 mb-8 pl-2 '
            >
              <RouterLink
                to={edge.node.frontmatter.slug}
                key={edge.node.frontmatter.slug}
              >
                <h2 className='text-xl'>{edge.node.frontmatter.title}</h2>
                <p className='text-sm'>
                  <span>
                    <i className='far fa-calendar' />
                    <span className='ml-1 text-gray-700'>{edge.node.frontmatter.date}</span>
                  </span>
                  <span className='ml-4'>
                    <i className='far fa-clock' />
                    <span className='ml-1 text-gray-700'>{edge.node.timeToRead} min</span>
                  </span>
                </p>
                <p className='text-sm'>{edge.node.excerpt}</p>
              </RouterLink>
            </li>
          ))}
        </ul>
      </article>
    </Layout>
  )
}

export default Blog
