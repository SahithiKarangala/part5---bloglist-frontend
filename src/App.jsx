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

  const handleLogin = async (event) =>{
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
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

  if(user === null){
    return(
      <div>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>username: </label>
            <input type="text" value={username} onChange={({target})=>setUserName(target.value)}></input>
          </div>
          <div>
            <label>password: </label>
            <input type="password" value={password} onChange={({target})=>setPassword(target.value)}></input>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

  return (
    <div>
        <h2>blogs</h2>
        <p>{user.name} logged in !!!!!</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )
}

export default App