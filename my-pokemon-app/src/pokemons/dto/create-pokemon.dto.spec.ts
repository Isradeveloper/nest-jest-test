import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('CreatePokemonDto', () => {
  it('should validate with valid data', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.hp = 35;
    dto.sprites = ['sprite1.png', 'sprite2.png'];

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate with missing required fields', async () => {
    const dto = new CreatePokemonDto();

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate with invalid data types', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.hp = -10; // Invalid HP
    dto.sprites = ['sprite1.png'];

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate wihout optional fields', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'Electric';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if name is not present', async () => {
    const dto = new CreatePokemonDto();
    dto.type = 'Electric';
    dto.hp = 35;
    dto.sprites = ['sprite1.png', 'sprite2.png'];

    const errors = await validate(dto);
    const nameError = errors.find((error) => error.property === 'name');

    expect(nameError).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should hp must be a positive number', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.hp = -10; // Invalid HP
    dto.sprites = ['sprite1.png'];

    const errors = await validate(dto);
    const hpError = errors.find((error) => error.property === 'hp');

    expect(hpError).toBeDefined();
    expect(hpError?.constraints?.min).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });
});
