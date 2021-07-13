export interface DefaultResponsePayload {
  success: boolean
  message?: string
}

export interface QueryPayload {
  [key: string]: string | number | boolean
}
