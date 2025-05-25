import api from './axios'

export const getPostList = () => api.get('/post')
export const getPostDetail = (id) => api.get(`/post/${id}`)


export const createComment = (postId, content) =>
  api.post(`/comment`, { postId ,content })

export const removeComment = (commentId) =>
  api.delete(`/comment/${commentId}`)

export const updateComment = (commentId, content) =>
  api.patch(`/comment/${commentId}`, { content })

export const createPost = (formData) =>
  api.post('/post', formData)

export const deletePostById = (id) => api.delete(`/post/${id}`)
