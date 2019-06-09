import React from 'react'
import { Link as RouterLink } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => {
  return (
    <Layout>
      <SEO title='Home' />
      <article className='container max-w-xl mx-auto px-2 text-justify leading-loose'>
        <img src='../images/me.jpg' alt='Ernesto Cruz Olivera' />
        <p>
          I'm a Developer with 7 years of experience designing and implementing
          software for Embedded Systems.
        </p>
        <p>
          Colleagues know me as a highly creative engineer who can always be
          trusted to come up with a new approach. I spend a lot of time
          understanding the project requirements before start designing the
          solution. I can (and often do) work well alone, but I’m at my best
          collaborating with others.
        </p>
        <p>
          My areas of interest are not only restricted to Embedded Systems, it
          also cover the fields of Digital Signal Processing and Web
          Development. You can read my thoughts in my{' '}
          <RouterLink to={'/blog'} className='linkText'>
            blog
          </RouterLink>
          .
        </p>
      </article>
    </Layout>
  )
}

export default IndexPage
