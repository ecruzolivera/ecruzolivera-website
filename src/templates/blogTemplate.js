import React from 'react'
import PropTypes from 'prop-types'

import SEO from '../components/seo'
import Layout from '../components/layout'

const BlogTemplate = ({pageContext: { node } }) => (
  <Layout>
    <SEO title={`${node.frontmatter.title}`} description={`${node.excerp}`} />
    <div>
      <p>{node.frontmatter.title}</p>
      <p>
        <i className='far fa-calendar' /> <span> {node.frontmatter.date}</span>
      </p>
      <p>
        <i className='far fa-clock' /> {node.timeToRead} min
      </p>
      <div dangerouslySetInnerHTML={{ __html: node.html }} />
    </div>
  </Layout>
)


BlogTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired,
}

export default BlogTemplate
