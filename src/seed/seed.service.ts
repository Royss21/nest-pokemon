import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axios: AxiosAdapter,
  ) {}

  async executedSeed() {
    await this.pokemonModel.deleteMany({});
    const { results } = await this.axios.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );
    const pokemonToInsert: { name: string; no: number }[] = [];

    results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return `Seed executed`;
  }
}
