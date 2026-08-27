import { apiClient, authenticatedApiClient } from '../../../api/apiClient'
import { postListSchema, postSchema, publicPostResponseSchema, type ContentPost, type PostInput, type PostStatus } from '../types/contracts'
export interface PostFilters { page: number; limit: number; search?: string; status?: PostStatus; contentType?: string; author?: string; category?: string; service?: string; area?: string; sort?: string; order?: string }
function path(filters: PostFilters) { const params = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)) }); return `/content/posts?${params}` }
export async function listPosts(filters: PostFilters, signal?: AbortSignal) { return postListSchema.parse(await authenticatedApiClient.get<unknown>(path(filters), { signal })) }
export async function getPost(id: string, signal?: AbortSignal) { return postSchema.parse(await authenticatedApiClient.get<unknown>(`/content/posts/${encodeURIComponent(id)}`, { signal })) }
export async function createPost(input: PostInput) { return postSchema.parse(await authenticatedApiClient.post<unknown>('/content/posts', input)) }
export async function updatePost(id: string, input: Partial<PostInput>) { return postSchema.parse(await authenticatedApiClient.patch<unknown>(`/content/posts/${encodeURIComponent(id)}`, input)) }
export async function transitionPost(id: string, status: PostStatus) { return postSchema.parse(await authenticatedApiClient.patch<unknown>(`/content/posts/${encodeURIComponent(id)}/status`, { status })) }
export async function deletePost(id: string) { await authenticatedApiClient.delete(`/content/posts/${encodeURIComponent(id)}`) }
export async function listPublicPosts(page: number, signal?: AbortSignal) { return postListSchema.parse(await apiClient.get<unknown>(`/content/public/posts?page=${page}&limit=12`, { signal })) }
export async function getPublicPost(slug: string, signal?: AbortSignal): Promise<{ post: ContentPost; redirect: boolean }> { return publicPostResponseSchema.parse(await apiClient.get<unknown>(`/content/public/posts/${encodeURIComponent(slug)}`, { signal })) }
