import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
        throw new InternalServerErrorException('User not found (request)');
    }

    let dataToReturn = user;

    if (!!data) {
        dataToReturn = user[data];
    } 

    if (!dataToReturn) {
        throw new InternalServerErrorException('Param not found (request)');
    }

    return dataToReturn;
});