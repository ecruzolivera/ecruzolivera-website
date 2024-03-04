import { GetStaticPropsContext, InferGetStaticPropsType } from "next"

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>My Post: {props.source.slug}</div>
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{
    slug: string
  }>,
) {
  const { slug } = ctx.params!

  // retrieve the MDX blog post file associated
  // with the specified slug parameter
  const postFile = fs.readFileSync(`_posts/${slug}.mdx`)

  // read the MDX serialized content along with the frontmatter
  // from the .mdx blog post file
  const mdxSource = await serialize(postFile, { parseFrontmatter: true })
  return {
    props: {
      source: mdxSource,
    },
    // enable ISR
    revalidate: 60,
  }
}
