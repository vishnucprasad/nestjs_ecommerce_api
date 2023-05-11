import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { AddProductDto, EditProductDto } from '../src/product/dto';
import { AddAddressDto, EditAddressDto } from '../src/address/dto/';
import { CartDto } from '../src/cart/dto';
import { OrderDto } from 'src/order/dto';

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

      it('should throw an error if no body is provided', () => {
        return pactum
          .spec()
          .post('/product')
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
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

    describe('Add new address', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().post('/address').expectStatus(401);
      });

      it('should throw an error if no body is provided', () => {
        return pactum
          .spec()
          .post('/address')
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
      });

      it('should add new address', () => {
        const dto: AddAddressDto = {
          name: 'John Doe',
          phone: '9876543210',
          pinCode: 682030,
          locality: 'Kakkanad',
          street: 'Kakkanad',
          city: 'Kochi',
          district: 'Eranakulam',
          state: 'Kerala',
        };

        return pactum
          .spec()
          .post('/address')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.phone)
          .expectBodyContains(dto.pinCode)
          .expectBodyContains(dto.locality)
          .expectBodyContains(dto.street)
          .expectBodyContains(dto.city)
          .expectBodyContains(dto.district)
          .expectBodyContains(dto.state)
          .stores('addressId', 'id');
      });
    });

    describe('Get address by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .get('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .expectStatus(401);
      });

      it('should get address by id', () => {
        return pactum
          .spec()
          .get('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{addressId}');
      });
    });

    describe('Edit address by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .patch('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .expectStatus(401);
      });

      it('should edit address by id', () => {
        const dto: EditAddressDto = {
          landmark: 'Near infopark phase 2',
          alternativePhone: '8765432109',
        };

        return pactum
          .spec()
          .patch('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{addressId}')
          .expectBodyContains(dto.landmark)
          .expectBodyContains(dto.alternativePhone);
      });
    });

    describe('Delete address by id', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum
          .spec()
          .delete('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .expectStatus(401);
      });

      it('should delete address by id', () => {
        return pactum
          .spec()
          .delete('/address/{id}')
          .withPathParams({
            id: '$S{addressId}',
          })
          .withBearerToken('$S{userAt}')
          .expectStatus(204)
          .expectBody('');
      });
    });
  });

  describe('Cart', () => {
    it('should add a product to the database', () => {
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

    describe('Add to Cart', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().post('/cart').expectStatus(401);
      });

      it('should throw an error if no body is provided', () => {
        return pactum
          .spec()
          .post('/cart')
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
      });

      it('should throw an error if provided productId is invalid', () => {
        const dto: CartDto = {
          productId: -1,
        };

        return pactum
          .spec()
          .post('/cart')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(404);
      });

      it('should add product to cart', () => {
        const dto: CartDto = {
          productId: pactum.stash.getDataStore()['productId'],
        };

        return pactum
          .spec()
          .post('/cart')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('Get cart', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().get('/cart').expectStatus(401);
      });

      it('should get cart', () => {
        return pactum
          .spec()
          .get('/cart')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Remove from Cart', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().delete('/cart').expectStatus(401);
      });

      it('should throw an error if no body is provided', () => {
        return pactum
          .spec()
          .delete('/cart')
          .withBearerToken('$S{userAt}')
          .expectStatus(400);
      });

      it('should throw an error if provided productId is invalid', () => {
        const dto: CartDto = {
          productId: -1,
        };

        return pactum
          .spec()
          .delete('/cart')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(404);
      });

      it('should remove product from cart', () => {
        const dto: CartDto = {
          productId: pactum.stash.getDataStore()['productId'],
        };

        return pactum
          .spec()
          .delete('/cart')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains([]);
      });
    });
  });

  describe('Order', () => {
    it('should add an address to database', () => {
      const dto: AddAddressDto = {
        name: 'John Doe',
        phone: '9876543210',
        pinCode: 682030,
        locality: 'Kakkanad',
        street: 'Kakkanad',
        city: 'Kochi',
        district: 'Eranakulam',
        state: 'Kerala',
      };

      return pactum
        .spec()
        .post('/address')
        .withBearerToken('$S{userAt}')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.name)
        .expectBodyContains(dto.phone)
        .expectBodyContains(dto.pinCode)
        .expectBodyContains(dto.locality)
        .expectBodyContains(dto.street)
        .expectBodyContains(dto.city)
        .expectBodyContains(dto.district)
        .expectBodyContains(dto.state)
        .stores('addressId', 'id');
    });

    it('should add product to cart', () => {
      const dto: CartDto = {
        productId: pactum.stash.getDataStore()['productId'],
      };

      return pactum
        .spec()
        .post('/cart')
        .withBearerToken('$S{userAt}')
        .withBody(dto)
        .expectStatus(200);
    });

    describe('Get empty orders list', () => {
      it('should throw an error if no authorization token is provided', () => {
        return pactum.spec().get('/order').expectStatus(401);
      });

      it('should get empty orders list', () => {
        return pactum
          .spec()
          .get('/order')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Checkout cart', () => {
      it('should throw an error if no authorization bearer is provided', () => {
        return pactum.spec().post('/order').expectStatus(401);
      });

      it('should checkout the cart', () => {
        const dto: OrderDto = {
          addressId: pactum.stash.getDataStore()['addressId'],
        };

        return pactum
          .spec()
          .post('/order')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
  });
});
