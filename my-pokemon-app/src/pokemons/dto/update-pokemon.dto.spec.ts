import { validate } from 'class-validator';
import { UpdatePokemonDto } from './update-pokemon.dto';

describe('UpdatePokemonDto', () => {
  it('should validate with valid data', async () => {
    const dto = new UpdatePokemonDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
