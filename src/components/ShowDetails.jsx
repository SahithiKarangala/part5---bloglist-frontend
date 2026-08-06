import { useState } from 'react'

const ShowDetails = ({ blog, handleLike = () => {} }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className = 'show-details'>
      <button onClick={handleShowDetails}>show details</button>
      {showDetails && (
        <div>
          <div className="blog-url">url: {blog.url}</div>
          <div className="blog-likes">likes: {blog.likes}</div>
          <button onClick={handleLike}>like</button>
        </div>
      )}
    </div>
  )
}

export default ShowDetails