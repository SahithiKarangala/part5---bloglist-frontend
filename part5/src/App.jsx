import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.tokenSetter(user.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
      //setting the token once the user is logged in so that the user can create blogs.
      blogService.tokenSetter(user.token)
      // making the user persist in the local storage so that it is not lost when the page is refreshed
      window.localStorage.setItem('loggedBlogUser',JSON.stringify(user))

      setUser(user)
      setUserName('')
      setPassword('')
    }catch{
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.tokenSetter(null)
    setUser(null)
  }

  const loginForm = () => {
    return(
      <div>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>username:
              <input type="text" value={username} onChange={( { target }) => setUserName(target.value)}></input>
            </label>
          </div>
          <div>
            <label>password:
              <input type="password" value={password} onChange={({ target }) => setPassword(target.value)}></input>
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try{
      const newBlog = { title: blogTitle, author: blogAuthor, url: blogUrl }
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      setBlogAuthor('')
      setBlogTitle('')
      setBlogUrl('')
      console.log('created blog', createdBlog)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }catch(error){
      console.error('create blog failed:', error.response?.data || error.message)
      const msg = error.response?.data?.error || error.message || 'error creating blog'
      setErrorMessage(msg)
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }
  const handleLikeBlog = async (blog) => {
    try {
      // The backend requires title/url in the body, so we still spread the
      // whole blog — but we deliberately don't touch `user`. A like should
      // never change ownership, and findByIdAndUpdate only $sets keys that
      // are present, so omitting it leaves the stored reference untouched
      // no matter what shape blog.user happens to be.
      // eslint-disable-next-line no-unused-vars
      const { user , ...blogWithoutUser } = blog
      const updatedBlog = { ...blogWithoutUser, likes: blog.likes + 1 }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    } catch (error) {
      console.error('like failed:', error.response?.data || error.message)
      const msg = error.response?.data?.error || error.message || 'error updating likes'
      setErrorMessage(msg)
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }

  const handleRemoveBlog = async (blog) => {
    if (!window.confirm(`remove blog "${blog.title}" by ${blog.author}?`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      console.error('remove failed:', error.response?.data || error.message)
      const msg = error.response?.data?.error || error.message || 'error removing blog'
      setErrorMessage(msg)
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }

  const handleTitleChange = event => {
    setBlogTitle(event.target.value)
  }

  const handleAuthorChange = event => {
    setBlogAuthor(event.target.value)
  }

  const handleUrlChange = event => {
    setBlogUrl(event.target.value)
  }


  const createBlogForm = () => {
    return(
      <Togglable buttonLabel="Create Blog">
        <CreateBlogForm
          onSubmit = {handleCreateBlog}
          handleTitleChange = {handleTitleChange}
          handleAuthorChange={handleAuthorChange}
          handleUrlChange={handleUrlChange}
          title={blogTitle}
          author = {blogAuthor}
          url={blogUrl}/>
      </Togglable>
    )
  }

  const blogListForm = () => {
    // Array.prototype.sort mutates in place, and `blogs` is React state —
    // sorting it directly would mutate state outside of setBlogs, which
    // React doesn't expect. Sort a copy instead.
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return(
      <div>
        <h2>blogs</h2>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} onLike={handleLikeBlog} onRemove={handleRemoveBlog} loggedInUser={user.username}/>
        )}
      </div>
    )
  }

  return (
    <div>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red', borderStyle: 'solid' }}>{errorMessage}</div>}
      {!(user) && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in !!!!!</p>
          <button onClick={handleLogOut}>Logout</button>
          {createBlogForm()}
          {blogListForm()}
        </div>
      )
      }
    </div>
  )
}

export default App