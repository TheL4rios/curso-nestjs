import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(query: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = query;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v');

  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        no: term
      });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    } 

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim()
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con id, nombre o no "${ term }" no fue encontrado`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (!!updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      };
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount == 0) {
      throw new NotFoundException(`El pokemon con id "${ id }" no fue encontrado`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code == 11000) {
      throw new BadRequestException(`El pokemon ya existe ${ JSON.stringify(error.keyValue) }`);
    } else {
      console.log(error);
      throw new InternalServerErrorException('Algo salió mal, intentalo más tarde...');
    }
  }
}
