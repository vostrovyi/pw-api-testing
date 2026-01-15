import articleRequestPayload from '../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';

export function getNetRandomArticle() {
    const articlePayload = structuredClone(articleRequestPayload)
    articlePayload.article.title = faker.lorem.sentence(5)
    articlePayload.article.description = faker.lorem.sentence(3)
    articlePayload.article.body = faker.lorem.paragraph(8)
    return articlePayload
}