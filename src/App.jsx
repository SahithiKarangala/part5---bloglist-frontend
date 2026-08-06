import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser') 
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.tokenSetter(user.token)
    }
  },[])

  const handleLogin = async (event) =>{
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
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)
    }
  }

  const handleLogOut = ()=>{
    window.localStorage.removeItem('loggedBlogUser')
    blogService.tokenSetter(null)
    setUser(null)
  }

  const loginForm = ()=>{
    return(
      <div>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>username: 
            <input type="text" value={username} onChange={({target})=>setUserName(target.value)}></input>
            </label>
          </div>
          <div>
            <label>password: 
            <input type="password" value={password} onChange={({target})=>setPassword(target.value)}></input>
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

  const handleCreateBlog = async (newBlog) => {
    try{
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      console.log('success message', successMessage)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }catch{
      setErrorMessage('error creating blog')
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)
    }
  }

  const blogListForm = ()=>{
    return(
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{color:'red'}}>{errorMessage}</div>}
      {!(user) && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in !!!!!</p>
          <button onClick={handleLogOut}>Logout</button>
          <CreateBlogForm handleCreateBlog={handleCreateBlog} />
          {blogListForm()}
        </div>
        )
      }
    </div>
  )
}

export default App