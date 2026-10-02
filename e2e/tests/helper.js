const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const getBlog = (page, title) => {
  return page.locator('.blog').filter({ hasText: title })
}

const createBlog = async (page, title, author, url) => {
  const openFormButton = page.getByRole('button', { name: 'Create Blog', exact: true })
  const titleInput = page.getByLabel('title')
  // wait until either the button or the open form is on the page
  await openFormButton.or(titleInput).first().waitFor()

  // open the form only if the button is visible
  if (await openFormButton.isVisible()) {
    await openFormButton.click()
  }

  await titleInput.fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  // wait until the new blog is rendered before continuing
  await getBlog(page, title).waitFor()
}

const likeBlog = async (page, title, times) => {
  const blog = getBlog(page, title)
  await blog.getByRole('button', { name: 'show details' }).click()
  for (let i = 1; i <= times; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
    // wait for the like to be saved and rendered before clicking again
    await expect(blog.getByText(`likes: ${i}`)).toBeVisible()
  }
}

module.exports = { loginWith, getBlog, createBlog, likeBlog }