import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && typeof error.code === 'number') {
          if (error.code === 11000) {
            throw new BadRequestException(
              `Pokemon exists in db ${JSON.stringify(error.message)}`,
            );
          }
          console.log(error);
          throw new InternalServerErrorException(
            'Cant create Pokemon - Check server logs',
          );
        }
      }
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // isNumber
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    else {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id ${term} not found `);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    await pokemon.updateOne(updatePokemonDto, { new: true });

    return {
      ...pokemon.toJSON(),
      ...updatePokemonDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
