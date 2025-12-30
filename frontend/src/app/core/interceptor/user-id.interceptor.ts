import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { UserContextService } from "../user/user-context.service";

export const UserIdInterceptor: HttpInterceptorFn = (req, next) => {
  const userContext = inject(UserContextService);

  const userId = userContext.userId();
  if (userId) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-User-ID': userId
      }
    });
    return next(clonedReq);
  }
  return next(req);
};