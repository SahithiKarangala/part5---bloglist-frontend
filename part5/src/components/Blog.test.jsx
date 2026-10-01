import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import ShowDetails from './ShowDetails'
import CreateBlogForm from './CreateBlogForm'
import { vi } from 'vitest'

test('blog component renders title and author',() => {
  const blog = {
    title: 'Emotional Intelligence',
    author: 'Daniel Goleman',
    url: 'https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X',
    likes: 10,
    user: {
      username: 'david',
      name: 'david david',
      id: '64a0f1e7c3b8f5d6e4a1b2c3'
    },
    id: '64a0f1e7c3b8f5d6e4a1b2c4'
  }

  const { container } = render(<Blog blog={blog}/>)

  //const element = screen.getByText('Emotional Intelligence Daniel Goleman')
  //expect(element).toBeDefined()
  const div = container.querySelector('.blog')

  screen.debug(div)

  // expect(div).toHaveTextContent('Emotional Intelligence Daniel Goleman')
  expect(div).toHaveTextContent('Emotional Intelligence')
  expect(div).toHaveTextContent('Daniel Goleman')

})

test('renders CreateBlogForm component',() => {
  const mockHandler = vi.fn()
  const { container } = render(<CreateBlogForm
    handleCreateBlog={mockHandler}/>)

  const div = container.querySelector('form')
  expect(div).toBeDefined()
})

test('<CreateBlogForm /> calls event handler when the form is submitted',async () => {
  const mockHandler = vi.fn()
  render(<CreateBlogForm
    handleCreateBlog={mockHandler}
  />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const createButton = screen.getByText('Create')
  const user = userEvent.setup()

  await user.type(titleInput,'Emotional Intelligence')
  await user.type(authorInput,'Daniel Goleman')
  await user.type(urlInput,'https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X')
  await user.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'Emotional Intelligence',
    author: 'Daniel Goleman',
    url: 'https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X'
  })
})

describe('<ShowDetails />',() => {
  const blog = {
    title: 'Emotional Intelligence',
    author: 'Daniel Goleman',
    url: 'https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X',
    likes: 10,
    user: {
      username: 'david',
      name: 'david david',
      id: '64a0f1e7c3b8f5d6e4a1b2c3'
    },
    id: '64a0f1e7c3b8f5d6e4a1b2c4'
  }

  let container = null
  const mockHandler = vi.fn()
  beforeEach(() => {
    // let container = null
    //const mockHandler = vi.fn()
    const rendered = render(<ShowDetails blog={blog} handleLike={mockHandler} />)
    container = rendered.container
  })

  test('renders its children',() => {
    const div = screen.getByText('show details')
    expect(div).toBeDefined()
  })

  test('at start the children are not displayed',() => {
    //const {container} = render(<ShowDetails blog={blog} />)
    const url_div1 = screen.queryByText('url: https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X')
    const likes_div2 = screen.queryByText('likes: 10')

    expect(url_div1).toBeNull()
    expect(likes_div2).toBeNull()

  })

  test('after clicking the button, children are displayed',async () => {
    //const {container} = render(<ShowDetails blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('show details')
    await user.click(button)

    const container_div = container.querySelector('.show-details')
    const url_div1 = screen.queryByText('url: https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X')
    const likes_div2 = screen.queryByText('likes: 10')

    expect(container_div).toBeDefined()
    expect(url_div1).toBeDefined()
    expect(likes_div2).toBeDefined()

    // const div = screen.queryByText('url: https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X')
    // expect(div).toBeDefined()
  })

  test('clicking the button calls the event handler once',async () => {
    const user = userEvent.setup()
    const showDetailsButton = screen.getByText('show details')
    await user.click(showDetailsButton)
    const likeButton = await screen.findByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})