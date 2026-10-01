const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset') 

        await request.post('http://localhost:3003/api/user', {
            data:{
                name: 'david david',
            username: 'david',
            password: 'david123'
            }
        })

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
    
        // await expect(page.getByText('david david logged in')).toBeVisible()
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


})