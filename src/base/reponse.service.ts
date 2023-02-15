import { Injectable } from '@nestjs/common';

@Injectable()
export class ReponseService {
  customResponeHttp(
    statusData: boolean,
    message: string,
    data: any,
    pathUrl: string,
  ) {
    return {
      statusCode: statusData || true,
      message: message || '',
      data: data || null,
      timestamp: Date.now(),
      path: pathUrl || '/api/docs',
    };
  }
}
