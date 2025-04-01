import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockedPokemons = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have called the service with correct parameters', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };
    jest.spyOn(service, 'findAll').mockImplementation();
    await controller.findAll(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should have called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockedPokemons));
    const pokemons = await controller.findAll(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto);

    expect(pokemons).toEqual(mockedPokemons);

    expect(pokemons.length).toBe(mockedPokemons.length);
  });

  it('should have the service with the correct id (findOne)', async () => {
    const id = 1;
    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockedPokemons[0]));

    const pokemon = await controller.findOne(id.toString());

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
    expect(pokemon).toEqual(mockedPokemons[0]);
  });

  it('should have the service with the correct id and data (update)', async () => {
    const spy = jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve('Pokemon updated'));

    const id = 1;
    const dto: UpdatePokemonDto = {};

    const result = await controller.update(id.toString(), dto);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id, dto);
    expect(result).toEqual('Pokemon updated');
  });

  it('should have the service with the correct id (delete)', async () => {
    const spy = jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve('Pokemon removed'));

    const id = 1;

    const result = await controller.remove(id.toString());

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
    expect(result).toEqual('Pokemon removed');
  });
});
