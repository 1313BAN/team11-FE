import api from './axios'

// 사용자 정보 조회
export const fetchUserInfo = () => api.get('/user/me')

// 회원가입
export const signup = (payload) => api.post('/user/create', payload)

// 닉네임 수정
export const updateNickname = (nickname) =>
  api.patch('/user/nickname', { nickname })

// 비밀번호 수정
export const changePassword = (payload) =>
  api.patch('/user/password', payload)
// payload = { currentPassword: '', newPassword: '' }


// 계정 삭제
export const deleteAccount = () => api.delete('/user/me')
