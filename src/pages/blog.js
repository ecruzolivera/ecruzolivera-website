import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import withRoot from '../utils/withRoot'

const blog = () => (
  <Layout>
    <SEO title='Blog' />
    <h1>Blog</h1>
  </Layout>
)

export default withRoot(blog)
