import {
  Type,
  mixin,
  CallHandler,
  NestInterceptor,
  ExecutionContext
} from '@nestjs/common'
import { Observable } from 'rxjs'

export function FormDataBodyParserInterceptor(
  fields: string[]
): Type<NestInterceptor> {
  class FormDataBodyParserInterceptorClass implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest()

      if (request.body) {
        fields.forEach(field => {
          if (request.body[field]) {
            request.body[field] = JSON.parse(request.body[field])
          }
        })
      }
      return next.handle()
    }
  }
  const Interceptor = mixin(FormDataBodyParserInterceptorClass)
  return Interceptor as Type<NestInterceptor>
}
