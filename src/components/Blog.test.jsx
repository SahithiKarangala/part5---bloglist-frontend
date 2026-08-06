import { render, screen } from '@testing-library/react'
import Blog from './Blog' 

test('blog component renders title and author',()=>{
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


    expect(div).toHaveTextContent('Emotional Intelligence Daniel Goleman')
    //expect(div).toHaveTextContent('')

    
})