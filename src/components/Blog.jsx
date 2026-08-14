import ShowDetails from './ShowDetails'

const Blog = ({ blog, onLike, onRemove, loggedInUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div className='blog' style={blogStyle}>
      <pre>Tite : {blog.title} by {blog.author}</pre>
      <ShowDetails blog={blog} onLike={onLike} onRemove={onRemove} loggedInUser={loggedInUser}/>
    </div>
  )
}

export default Blog