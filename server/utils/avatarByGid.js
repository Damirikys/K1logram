export default (gid: number, modified?: number) => `/api/v1/user/${gid}/avatar?${modified || ''}`
