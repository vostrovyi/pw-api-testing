import { test, expect } from '@playwright/test';

let authToken: string

test.beforeAll('run before all', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "no_krot@ukr.net", "password": "Qwerty@123" } }
  })
  const tokenResponseJSON = await tokenResponse.json()
  authToken = 'Token ' + tokenResponseJSON.user.token
})





test('GET Tags Test', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json()

  expect(tagsResponse.status()).toEqual(200)
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
});

test('GET Articles Test', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJSON = await articlesResponse.json()

  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJSON.articlesCount).toEqual(10)
})

test('CREATE And DELETE Articles Test', async ({ request }) => {

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "Test_No_krot",
        "description": "TestDescr1",
        "body": "TestBody1",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json()
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual('Test_No_krot')
  const slugId = newArticleResponseJSON.article.slug

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJSON = await articlesResponse.json()

  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles[0].title).toEqual('Test_No_krot')


  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
})

test('CREATE, UPDATE And DELETE Articles Test', async ({ request }) => {

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "Test_No_krot2",
        "description": "TestDescr1",
        "body": "TestBody1",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json()
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual('Test_No_krot2')
  const slugId = newArticleResponseJSON.article.slug


  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
      "article": {
        "title": "Test_No_krot_UPDATED",
        "description": "TestDescr1",
        "body": "TestBody1",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const updateArticleResponseJSON = await updateArticleResponse.json()
  expect(updateArticleResponse.status()).toEqual(200)
  const newslugId = updateArticleResponseJSON.article.slug


  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJSON = await articlesResponse.json()

  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles[0].title).toEqual('Test_No_krot_UPDATED')


  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newslugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
})
