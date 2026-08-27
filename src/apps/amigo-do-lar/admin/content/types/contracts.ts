import { z } from 'zod'
export const contentTypeSchema = z.enum(['ARTICLE', 'GUIDE', 'CASE_STUDY', 'BEFORE_AFTER', 'LOCAL_PAGE'])
export const postStatusSchema = z.enum(['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'])
const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('PARAGRAPH'), text: z.string() }).strict(), z.object({ type: z.literal('HEADING'), level: z.union([z.literal(2), z.literal(3)]), text: z.string() }).strict(),
  z.object({ type: z.literal('BULLET_LIST'), items: z.array(z.string()) }).strict(), z.object({ type: z.literal('NUMBERED_LIST'), items: z.array(z.string()) }).strict(),
  z.object({ type: z.literal('IMAGE'), mediaId: z.string() }).strict(), z.object({ type: z.literal('GALLERY'), mediaIds: z.array(z.string()) }).strict(),
  z.object({ type: z.literal('VIDEO_EMBED'), url: z.string() }).strict(), z.object({ type: z.literal('QUOTE'), text: z.string(), attribution: z.string().optional() }).strict(), z.object({ type: z.literal('CALLOUT'), text: z.string() }).strict(),
])
const mediaSchema = z.object({ id: z.string(), postId: z.string(), originalName: z.string(), mimeType: z.string(), sizeBytes: z.number(), altText: z.string(), caption: z.string().nullable(), width: z.number().nullable(), height: z.number().nullable(), createdAt: z.string(), url: z.string().optional() }).passthrough()
const relationSchema = z.object({ id: z.string(), name: z.string(), slug: z.string().optional() }).passthrough()
export const postSchema = z.object({ id: z.string(), title: z.string(), slug: z.string(), excerpt: z.string(), contentType: contentTypeSchema, contentVersion: z.number(), content: z.array(blockSchema), status: postStatusSchema, authorId: z.string(), author: relationSchema, updatedAt: z.string(), createdAt: z.string(), publishedAt: z.string().nullable(), coverMediaId: z.string().nullable(), primaryCategoryId: z.string().nullable(), serviceId: z.string().nullable(), serviceAreaId: z.string().nullable(), seoTitle: z.string().nullable(), seoDescription: z.string().nullable(), canonicalUrl: z.string().nullable(), ogTitle: z.string().nullable(), ogDescription: z.string().nullable(), ogMediaId: z.string().nullable(), robotsIndex: z.boolean(), robotsFollow: z.boolean(), categories: z.array(z.object({ category: relationSchema }).passthrough()), tags: z.array(z.object({ tag: relationSchema }).passthrough()), media: z.array(mediaSchema), service: relationSchema.nullable(), serviceArea: relationSchema.nullable() }).passthrough()
export const postListSchema = z.object({ data: z.array(postSchema), pagination: z.object({ page: z.number(), limit: z.number(), total: z.number(), totalPages: z.number() }) })
export const publicPostResponseSchema = z.object({ post: postSchema, redirect: z.boolean() })
export type ContentBlock = z.infer<typeof blockSchema>
export type ContentPost = z.infer<typeof postSchema>
export type ContentType = z.infer<typeof contentTypeSchema>
export type PostStatus = z.infer<typeof postStatusSchema>
export type PostInput = Pick<ContentPost, 'title' | 'slug' | 'excerpt' | 'contentType' | 'content' | 'contentVersion' | 'robotsIndex' | 'robotsFollow'> & Partial<Pick<ContentPost, 'coverMediaId' | 'primaryCategoryId' | 'serviceId' | 'serviceAreaId' | 'seoTitle' | 'seoDescription' | 'canonicalUrl' | 'ogTitle' | 'ogDescription' | 'ogMediaId'>> & { categoryIds: string[]; tagIds: string[]; expectedUpdatedAt?: string }
