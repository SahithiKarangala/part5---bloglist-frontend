import ShowDetails from './ShowDetails'

const Blog = ({ blog }) => (
  <div className='blog'>
    <pre>Tite : {blog.title} by {blog.author}</pre>
    <ShowDetails blog={blog} />
  </div>
)

export default Blog