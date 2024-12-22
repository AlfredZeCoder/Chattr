import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AddUserDto } from 'src/dtos/add-user.dto';
import { LogInDto } from 'src/dtos/login.dto';
import { AddRoleDto } from 'src/dtos/add-role.dto';
import { Role } from 'src/models/role.enum';

const mockAuthService = {
    addUser: jest.fn(),
    login: jest.fn(),
    loginWithToken: jest.fn(),
    addRole: jest.fn(),
};

const mockJwtService = {
    signAsync: jest.fn(),
};

const mockUserService = {
    findOneByEmail: jest.fn(),
};

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addUser', () => {
        it('should create a user and return a token', async () => {
            const addUserDto: AddUserDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            };

            const user = { id: 1, ...addUserDto };
            const token = 'test-token';

            mockAuthService.addUser.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue(token);

            const result = await authController.addUser(addUserDto);

            expect(result).toEqual({ token });
            expect(mockAuthService.addUser).toHaveBeenCalledWith(addUserDto);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                expect.any(Object),
                { secret: process.env.JWT_SECRET },
            );
        });
    });

    describe('login', () => {
        it('should authenticate a user and return a token', async () => {
            const loginDto: LogInDto = {
                email: 'john.doe@example.com',
                password: 'password123',
            };

            const user = { id: 1, email: 'john.doe@example.com' };
            const token = 'test-token';

            mockAuthService.login.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue(token);

            const result = await authController.login(loginDto);

            expect(result).toEqual({ token });
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                expect.any(Object),
                { secret: process.env.JWT_SECRET },
            );
        });
    });

    describe('loginWithToken', () => {
        it('should validate a token and return a new token', async () => {
            const tokenPayload = { token: 'test-token' };
            const user = { id: 1, email: 'john.doe@example.com' };
            const newToken = 'new-test-token';

            mockAuthService.loginWithToken.mockResolvedValue(tokenPayload);
            mockUserService.findOneByEmail.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue(newToken);

            const result = await authController.loginWithToken(tokenPayload);

            expect(result).toEqual({ token: newToken });
            expect(mockAuthService.loginWithToken).toHaveBeenCalledWith(tokenPayload);
            expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(user.email);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                expect.any(Object),
                { secret: process.env.JWT_SECRET },
            );
        });
    });

    describe('addRole', () => {
        it('should add a role to a user and return a token', async () => {
            const addRoleDto: AddRoleDto = { userId: 1, role: Role.Admin };
            const user = { id: 1, email: 'john.doe@example.com', roles: ['USER', 'ADMIN'] };
            const token = 'test-token';

            mockAuthService.addRole.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue(token);

            const result = await authController.addRole(addRoleDto);

            expect(result).toEqual({ token });
            expect(mockAuthService.addRole).toHaveBeenCalledWith(addRoleDto);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                expect.any(Object),
                { secret: process.env.JWT_SECRET },
            );
        });
    });
});