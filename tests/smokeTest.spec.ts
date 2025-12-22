import { test } from '..//utils/fixtures';
import { expect } from '@playwright/test';

let authToken: string

test.beforeAll('run before all', async ({ api }) => {

    const tokenResponse = await api
        .path('/users/login')
        .body({ "user": { "email": "no_krot@ukr.net", "password": "Qwerty@123" } })
        .postRequest(200)
    authToken = 'Token ' + tokenResponse.user.token
})




test('GET Articles Test', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)
})

test('GET Tags Test', async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags[0]).toEqual('Test')
    expect(response.tags.length).toBeLessThanOrEqual(10)
})

test('CREATE And DELETE Articles Test', async ({ api }) => {
    const articleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({ "article": { "title": "Test_No_krot", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .postRequest(201)
    expect(articleResponse.article.title).toEqual('Test_No_krot')
    const slugId = articleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).toEqual('Test_No_krot')

    await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.toEqual('Test_No_krot')
})

test('CREATE, UPDATE And DELETE Articles Test', async ({ api }) => {
    const articleResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .body({ "article": { "title": "NEW_Test_No_krot", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .postRequest(201)
    expect(articleResponse.article.title).toEqual('NEW_Test_No_krot')
    const slugId = articleResponse.article.slug

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({ "article": { "title": "Test_No_krot_UPDATED", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).toEqual('Test_No_krot_UPDATED')
    const newSlugId = updateArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).toEqual('Test_No_krot_UPDATED')

    await api
        .path(`/articles/${newSlugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.toEqual('Test_No_krot_UPDATED')
})
