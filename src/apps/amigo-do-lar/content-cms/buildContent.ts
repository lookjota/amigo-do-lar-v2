import { postSchema } from '../admin/content/types/contracts'
import { generatedContent } from './generatedContent'
export const buildContentPosts = generatedContent.map((post) => postSchema.parse(post))
