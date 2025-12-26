import { test } from '..//utils/fixtures';
import { expect } from '../utils/custom-expect';
import { validateSchema } from '../utils/schema-validator';


test('GET Articles Test', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)
})

test('GET Tags Test', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    await validateSchema('tags', 'GET_tags')
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('CREATE And DELETE Articles Test', async ({ api }) => {
    const articleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Test_No_krot", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .postRequest(201)
    expect(articleResponse.article.title).shouldEqual('Test_No_krot')
    const slugId = articleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).shouldEqual('Test_No_krot')

    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual('Test_No_krot')
})

test('CREATE, UPDATE And DELETE Articles Test', async ({ api }) => {
    const articleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "NEW_Test_No_krot", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .postRequest(201)
    expect(articleResponse.article.title).shouldEqual('NEW_Test_No_krot')
    const slugId = articleResponse.article.slug

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body({ "article": { "title": "Test_No_krot_UPDATED", "description": "TestDescr1", "body": "TestBody1", "tagList": [] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual('Test_No_krot_UPDATED')
    const newSlugId = updateArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).shouldEqual('Test_No_krot_UPDATED')

    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual('Test_No_krot_UPDATED')
})
