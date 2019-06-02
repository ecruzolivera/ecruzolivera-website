import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import { Typography, Container, Icon, Link } from '@material-ui/core'
import ReactMarkdown from 'markdown-to-jsx'

import SEO from '../components/seo'
import Layout from '../components/layout'

const styles = theme => ({
  root: {
    margin: theme.spacing(5, 2),
  },
  listItem: {
    marginTop: theme.spacing(1),
  },
})
const options = {
  overrides: {
    h1: {
      component: props => <Typography gutterBottom variant='h4' {...props} />,
    },
    h2: {
      component: props => <Typography gutterBottom variant='h6' {...props} />,
    },
    h3: {
      component: props => (
        <Typography gutterBottom variant='subtitle1' {...props} />
      ),
    },
    h4: {
      component: props => (
        <Typography gutterBottom variant='caption' paragraph {...props} />
      ),
    },
    p: { component: props => <Typography paragraph {...props} /> },
    a: {
      component: props => <Link target='_blank' rel='noreferrer' {...props} />,
    },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component='span' {...props} />
        </li>
      )),
    },
  },
}
const blogTemplate = ({ classes, pageContext: { node } }) => (
  <Layout>
    <SEO title={`${node.frontmatter.title}`} description={`${node.excerp}`} />
    <Container maxWidth='md' className={classes.root}>
      <Typography variant='h4' gutterBottom>
        {node.frontmatter.title}
      </Typography>
      <Typography variant='subtitle1'>
        <Icon component='i' fontSize='inherit' className='far fa-calendar' />{' '}
        {node.frontmatter.date}
      </Typography>
      <Typography variant='subtitle2' gutterBottom>
        <Icon component='i' fontSize='inherit' className='far fa-clock' />{' '}
        {node.timeToRead} min
      </Typography>
      <ReactMarkdown options={options}>{node.rawMarkdownBody}</ReactMarkdown>
    </Container>
  </Layout>
)

export default withStyles(styles)(blogTemplate)
