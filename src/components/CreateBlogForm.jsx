const CreateBlogForm = ({ onSubmit, handleTitleChange, handleAuthorChange, handleUrlChange, title, author, url }) => {

  return (

    <div>
      <h2>Create Blog</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
              title:
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
              author:
            <input
              type="text"
              value={author}
              onChange={handleAuthorChange}
            />
          </label>
        </div>
        <div>
          <label>
              url:
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm