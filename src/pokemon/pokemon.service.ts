import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { DeleteResult, isValidObjectId, Model } from 'mongoose';
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
      this.handleExceptions(error as Error);
    }
  }

  findAll() {
    return this.pokemonModel.find().lean().exec();
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

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error) {
      this.handleExceptions(error as Error);
    }
    return {
      ...pokemon.toJSON(),
      ...updatePokemonDto,
    };
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // esto elimina pero si viene un id no existente no es tan recomendable
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) throw new BadRequestException('Pokemon not found');
  }

  private handleExceptions(error: Error) {
    if (error instanceof Error) {
      if ('code' in error && typeof error.code == 'number') {
        if (error.code === 11000) {
          throw new BadRequestException(
            `$Pokemon already exists in db ${JSON.stringify(error.message)}`,
          );
        }
      }
    }
    throw new InternalServerErrorException(' Check server logs');
  }
}
