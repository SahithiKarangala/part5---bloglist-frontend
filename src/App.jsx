import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    }
  },[])

  const handleLogin = async (event) =>{
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
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
      {!(user) && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in !!!!!</p>
          <button onClick={handleLogOut}>Logout</button>
          {blogListForm()}
        </div>
        )
      }
    </div>
  )
}

export default App