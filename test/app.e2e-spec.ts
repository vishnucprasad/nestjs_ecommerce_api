import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { AddProductDto, EditProductDto } from 'src/product/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    app.listen(3001);

    pactum.request.setBaseUrl('http://localhost:3001');

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'mail@jhondoe.com',
      password: 'jhondoe',
    };

    describe('Signup', () => {
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: '123456789',
          })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            enail: 'example@example.com',
          })
          .expectStatus(400);
      });

      it('should throw an error if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: '123456789',
          })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            enail: 'example@example.com',
          })
          .expectStatus(400);
      });

      it('should throw an error if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().get('/user').expectStatus(401);
      });

      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().patch('/user').expectStatus(401);
      });

      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Jhon',
          lastName: 'Doe',
        };

        return pactum
          .spec()
          .patch('/user')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      });
    });
  });

  describe('Product', () => {
    describe('Get empty products list', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().get('/product').expectStatus(401);
      });

      it('should get empty products list', () => {
        return pactum
          .spec()
          .get('/product')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Add new product', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().post('/product').expectStatus(401);
      });

      it('should add new product', () => {
        const dto: AddProductDto = {
          title: 'Iphone 14 Pro',
          price: 159900.0,
          images: [
            'https://images.pexels.com/photos/16005007/pexels-photo-16005007.jpeg',
            'https://images.pexels.com/photos/13939986/pexels-photo-13939986.jpeg',
          ],
        };

        return pactum
          .spec()
          .post('/product')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.price)
          .expectBodyContains(dto.images)
          .stores('productId', 'id');
      });
    });

    describe('Get product by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .get('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .expectStatus(401);
      });

      it('should get product by id', () => {
        return pactum
          .spec()
          .get('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{productId}');
      });
    });

    describe('Edit product by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .patch('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .expectStatus(401);
      });

      it('should edit product by id', () => {
        const dto: EditProductDto = {
          description:
            'The iPhone 14 Pro display has rounded corners that follow a beautiful curved design, and these corners are within a standard rectangle. When measured as a standard rectangular shape, the screen is 6.12 inches diagonally (actual viewable area is less).',
        };

        return pactum
          .spec()
          .patch('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete product by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .delete('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .expectStatus(401);
      });

      it('should delete product by id', () => {
        return pactum
          .spec()
          .delete('/product/{id}')
          .withPathParams({
            id: '$S{productId}',
          })
          .withBearerToken('$S{userAt}')
          .expectStatus(204)
          .expectBody('');
      });
    });
  });

  describe('Address', () => {
    describe('Get empty address list', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().get('/address').expectStatus(401);
      });

      it('should get empty address list', () => {
        return pactum
          .spec()
          .get('/address')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
