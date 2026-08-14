import { useState } from 'react'

const ShowDetails = ({ blog, onLike, onRemove, loggedInUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = () => {
    onLike(blog)
  }

  const handleRemove = () => {
    onRemove(blog)
  }

  // blog.user is `null` or a populated { id, username, name } object;
  // loggedInUser is the logged-in user's username string — compare on
  // username since it's the one stable identifier present on both sides.
  const isOwner = blog.user?.username === loggedInUser


  const onShowDetails = { display : showDetails ? '' : 'none' }
  const onHideDetails = { display: showDetails ? 'none' : '' }
  const removeButtonStyle = { backgroundColor: 'blue', color: 'white' }

  return (
    <div className = 'show-details'>
      <div style={onHideDetails}>
        <button onClick={handleShowDetails}>show details</button>
      </div>
      <div style={onShowDetails}>
        <button onClick={handleShowDetails}>hide details</button>
      </div>
      {showDetails && (
        <div>
          <div className="blog-url">url: {blog.url}</div>
          <div className="blog-likes">likes: {blog.likes}
            <button onClick={handleLike}>like</button></div>
          {isOwner && <div><button onClick={handleRemove} style={removeButtonStyle}>Remove</button></div>}
        </div>
      )}
    </div>
  )
}

export default ShowDetails