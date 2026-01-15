import { test } from '..//utils/fixtures';
import { expect } from '../utils/custom-expect';
import { getNetRandomArticle } from '../utils/data-generator';


test('GET Articles Test', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    await expect(response).shouldMatchSchema('articles', 'GET_articles')
    expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldEqual(10)
})

test('GET Tags Test', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    await expect(response).shouldMatchSchema('tags', 'GET_tags', true)
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('CREATE And DELETE Articles Test', async ({ api }) => {
    const articlePayload = getNetRandomArticle()
    const articleResponse = await api
        .path('/articles')
        .body(articlePayload)
        .postRequest(201)

    await expect(articleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(articleResponse.article.title).shouldEqual(articlePayload.article.title)
    const slugId = articleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).shouldEqual(articlePayload.article.title)

    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articlePayload.article.title)
})

test('CREATE, UPDATE And DELETE Articles Test', async ({ api }) => {
    const articlePayload = getNetRandomArticle()
    const articleResponse = await api
        .path('/articles')
        .body(articlePayload)
        .postRequest(201)
    expect(articleResponse.article.title).shouldEqual(articlePayload.article.title)
    const slugId = articleResponse.article.slug


    const articlePayloadUpdated = getNetRandomArticle()
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body(articlePayloadUpdated)
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual(articlePayloadUpdated.article.title)
    const newSlugId = updateArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponse.articles[0].title).shouldEqual(articlePayloadUpdated.article.title)

    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articlePayloadUpdated.article.title)
})
