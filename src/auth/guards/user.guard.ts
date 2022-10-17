// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';

// @Injectable()
// export class UserGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const id = request.params['id'];
//     console.log('REQUEST', request);
//     const currentUser = this.jwtService.decode(request.cookies['token'], {
//       json: true,
//     });
//     return id === currentUser['id'];
//   }
// }
