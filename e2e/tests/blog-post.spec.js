const { test, expect, beforeEach, describe } = require('@playwright/test')
const{loginWith, getBlog, createBlog, likeBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
        const resetResponse = await request.post('http://localhost:3003/api/testing/reset') 
        console.log('reset:', resetResponse.status())

        const userResponse = await request.post('http://localhost:3003/api/users', {
            data:{
                name: 'david david',
                username: 'david',
                password: 'david123'
            }
        })
        console.log('create user:', userResponse.status(), await userResponse.text())

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Login to application')).toBeVisible()
        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
        await page.getByLabel('username').fill('david')
        await page.getByLabel('password').fill('david123')
        await page.getByRole('button', { name: 'login' }).click()
    
        await expect(page.getByText('david david logged in !!!!!')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
        await page.getByLabel('username').fill('david')
        await page.getByLabel('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()
    
        const errorDiv = page.getByText('wrong credentials')
        await expect(errorDiv).toBeVisible()
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    
        await expect(page.getByText('david david logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'david', 'david123')
            await expect(page.getByText('david david logged in !!!!!')).toBeVisible()
        })
    
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Playwright testing', 'Test Author', 'http://example.com')
            await expect(getBlog(page, 'Playwright testing')).toBeVisible()
        })
    
        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'Likeable blog', 'Test Author', 'http://example.com')
        
            const blog = getBlog(page, 'Likeable blog')
            await blog.getByRole('button', { name: 'show details' }).click()
            await expect(blog.getByText('likes: 0')).toBeVisible()
        
            await blog.getByRole('button', { name: 'like' }).click()
            await expect(blog.getByText('likes: 1')).toBeVisible()
        })
    
        test('the user who created a blog can delete it', async ({ page }) => {
            await createBlog(page, 'Blog to delete', 'Test Author', 'http://example.com')
        
            const blog = getBlog(page, 'Blog to delete')
            await blog.getByRole('button', { name: 'show details' }).click()
        
            // accept the window.confirm dialog
            page.once('dialog', dialog => dialog.accept())
            await blog.getByRole('button', { name: 'remove' }).click()
        
            await expect(getBlog(page, 'Blog to delete')).toHaveCount(0)
        })
    
        test('only the user who added the blog sees the remove button', async ({ page, request }) => {
            await createBlog(page, 'Owned blog', 'Test Author', 'http://example.com')
        
            // the creator sees the remove button
            const blog = getBlog(page, 'Owned blog')
            await blog.getByRole('button', { name: 'show details' }).click()
            await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()
        
            // create a second user and log in as them
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Another User',
                    username: 'another',
                    password: 'password'
                }
            })
            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page, 'another', 'password')
            await expect(page.getByText('Another User logged in')).toBeVisible()
        
            // the other user does not see the remove button
            const sameBlog = getBlog(page, 'Owned blog')
            await sameBlog.getByRole('button', { name: 'show details' }).click()
            await expect(sameBlog.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
    
        test('blogs are ordered by likes, most liked first', async ({ page }) => {
            await createBlog(page, 'First blog', 'Author A', 'http://a.com')
            await createBlog(page, 'Second blog', 'Author B', 'http://b.com')
            await createBlog(page, 'Third blog', 'Author C', 'http://c.com')
        
            await likeBlog(page, 'First blog', 1)
            await likeBlog(page, 'Second blog', 3)
            await likeBlog(page, 'Third blog', 2)
        
            const blogs = page.locator('.blog')
            await expect(blogs.nth(0)).toContainText('Second blog')
            await expect(blogs.nth(1)).toContainText('Third blog')
            await expect(blogs.nth(2)).toContainText('First blog')
        })
    })


})