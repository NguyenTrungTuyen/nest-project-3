import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';

@Module({
  imports: [],
  controllers: [BookController],
  providers: [BookService],
})
export class AppModule {}
