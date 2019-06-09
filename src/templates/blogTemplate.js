import React from 'react'
import PropTypes from 'prop-types'

import SEO from '../components/seo'
import Layout from '../components/layout'

const BlogTemplate = ({ pageContext: { node } }) => (
  <Layout>
    <SEO title={`${node.frontmatter.title}`} description={`${node.excerp}`} />
    <article className='container max-w-xl mx-auto px-2 text-justify leading-loose'>
      <h1 className='text-black text-2xl'>{node.frontmatter.title}</h1>
      <p className='text-sm mb-8'>
        <span>
          <i className='far fa-calendar' />
          <span className='ml-1 text-gray-700'>{node.frontmatter.date}</span>
        </span>
        <span className='ml-4'>
          <i className='far fa-clock' />
          <span className='ml-1 text-gray-700'>{node.timeToRead} min</span>
        </span>
      </p>
      <div dangerouslySetInnerHTML={{ __html: node.html }} />
    </article>
  </Layout>
)

BlogTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired,
}

export default BlogTemplate
