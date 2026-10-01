import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const tokenSetter = (newToken) => {
  token = `Bearer ${newToken}`
}

// The Blog schema stores `user` as an array (0 or 1 refs), and every route
// populates it, so the backend always sends `user` as `[]` or
// `[{ id, username, name }]`. Unwrap that here, at the one place blog data
// enters the app, so every component can just treat blog.user as `null` or
// a single user object without knowing about the array on the wire.
const normalizeBlog = (blog) => ({
  ...blog,
  user: Array.isArray(blog.user) ? (blog.user[0] ?? null) : (blog.user ?? null)
})

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data.map(normalizeBlog))
}

const create = async(newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return normalizeBlog(response.data)
}

const update = async (id, blog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, blog, config)
  return normalizeBlog(response.data)
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll , create, update, remove, tokenSetter }