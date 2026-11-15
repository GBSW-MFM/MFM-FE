// 편지 API (홈·수신함·보관함·편지 쓰기·상세가 함께 쓴다)
import { api } from '../../shared/api';

// 라우트 파라미터가 주소에 그대로 들어가 다른 API 경로로 새지 않도록 인코딩한다 (예: 딥링크로 들어온 '../users/me')
const enc = (id) => encodeURIComponent(String(id));

export const lettersApi = {
  /** box: sealed | opened | archived, from: self | friend | anyone | reply, 보관함만 q·sort */
  listReceived: ({ box, from, q, sort, limit = 20, offset = 0 }) => api.get('/letters/received', { query: { box, from, q, sort, limit, offset } }),
  listSent: ({ limit = 20, offset = 0 } = {}) => api.get('/letters/sent', { query: { limit, offset } }),
  get: (id) => api.get(`/letters/${enc(id)}`).then((d) => d.letter),
  create: (body) => api.post('/letters', body).then((d) => d.letter),
  update: (id, body) => api.patch(`/letters/${enc(id)}`, body).then((d) => d.letter),
  remove: (id) => api.del(`/letters/${enc(id)}`),
  reply: (id, body) => api.post(`/letters/${enc(id)}/reply`, body).then((d) => d.letter),
  setArchived: (id, archived) => api.patch(`/letters/${enc(id)}/archive`, { archived }),
  removeReceived: (id) => api.del(`/letters/${enc(id)}/received`),
  lookupUser: (handle) => api.get('/users/lookup', { query: { handle } }),
};
