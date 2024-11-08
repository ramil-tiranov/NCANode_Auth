import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the API!';
  }

  getStatus(): { status: string } {
    return { status: 'API is running smoothly' };
  }
}
