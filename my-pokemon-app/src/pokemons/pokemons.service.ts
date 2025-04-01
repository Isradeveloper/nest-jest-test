import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PokeapiResponse } from './interfaces/pokeapi.response';
import { Pokemon } from './entities/pokemon.entity';
import { PokeapiPokemonResponse } from './interfaces/pokeapi-pokemon.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonsCache = new Map<string, Pokemon[]>();

  create(createPokemonDto: CreatePokemonDto) {
    return `This action adds a ${createPokemonDto.name}`;
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    const cacheKey = `${limit}-${offset}`;
    if (this.paginatedPokemonsCache.has(cacheKey)) {
      return this.paginatedPokemonsCache.get(cacheKey)!;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokeapiResponse;

    const pokemonPromises = data.results.map((result) => {
      const id = result.url.split('/').at(-2)!;
      return this.getPokemonInformation(+id);
    });

    const pokemons = await Promise.all(pokemonPromises);

    this.paginatedPokemonsCache.set(cacheKey, pokemons);

    return pokemons;
  }

  findOne(id: number) {
    return this.getPokemonInformation(id);
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);

    if (response.status === 404)
      throw new NotFoundException(`Pokemon with id ${id} not found`);

    const data = (await response.json()) as PokeapiPokemonResponse;
    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
