import fs from "fs"
import matter from "gray-matter"
import path, { join } from "path"
import { remark } from "remark"
import remarkHTML from "remark-html"

export type Post = {
  slug: string
  title: string
  date: Date
  content: string
  excerpt: string
}

const postsDirectory = join(process.cwd(), "src/posts")

console.log(`Current directory: ${process.cwd()}`)

export function getPostsMarkdownFiles(): string[] {
  return fs
    .readdirSync(postsDirectory, { encoding: "utf-8", recursive: true })
    .filter((postFile) => path.extname(postFile) === ".md")
}

export function getPost(fileName: string): Post {
  const fullPath = join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  console.log("matter", JSON.stringify(data))

  return { ...data, content } as Post
}

export function getAllPosts(): Post[] {
  const files = getPostsMarkdownFiles()
  console.log(JSON.stringify(files))
  const posts = files.map((file) => getPost(file)).sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  console.log(JSON.stringify(files))
  return posts
}

export function markdown2Html(markdown: string): string {
  const html = remark().use(remarkHTML).processSync(markdown).toString()
  return html
}
