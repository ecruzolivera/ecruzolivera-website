import React from "react";
import PropTypes from "prop-types";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import Comments from "../components/Comments";

import "./BlogTemplate.css";

const BlogTemplate = ({ pageContext: { node } }) => (
  <Layout>
    <SEO title={`${node.frontmatter.title}`} description={`${node.excerp}`} />
    <article className="container max-w-3xl mx-auto px-2 text-justify leading-loose">
      <h1 className="text-2xl">{node.frontmatter.title}</h1>
      <p className="text-sm mb-8">
        <span>
          <i className="far fa-calendar" />
          <span className="ml-1 text-secondary">{node.frontmatter.date}</span>
        </span>
        <span className="ml-4">
          <i className="far fa-clock" />
          <span className="ml-1 text-secondary">{node.timeToRead} min</span>
        </span>
      </p>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: node.html }}
      />
    </article>
    <Comments />
  </Layout>
);

BlogTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export default BlogTemplate;
