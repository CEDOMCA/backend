import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateArtworkDto, QueryArtworkDto } from './dto';
import { ArtworkDocument } from './schema/artwork.schema';

@Injectable()
export class ArtworkService {
  constructor(@InjectModel('Artwork') private readonly artworkModel: Model<ArtworkDocument>) {}

  getArtworks(queryArtworkDto: QueryArtworkDto) {
    const { font } = queryArtworkDto;

    if (font) {
      return this.artworkModel
        .find({
          font: font.toLowerCase(),
        })
        .exec();
    }

    return this.artworkModel.find().exec();
  }

  async getOneArtwork(artworkId: string) {
    const isValidId = isValidObjectId(artworkId);

    if (!isValidId) {
      throw new NotFoundException('Obra não encontrada.');
    }

    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (artwork === null) {
      throw new NotFoundException('Obra não encontrada.');
    }
    return artwork;
  }

  async createArtwork(createArtworkDto: CreateArtworkDto) {
    try {
      const artwork = new this.artworkModel({
        ...createArtworkDto,
        font: createArtworkDto.font.toLowerCase(),
      });
      const savedArtwork = await artwork.save();
      return savedArtwork;
    } catch (err) {
      throw new ConflictException(
        `Já existe uma obra com o código '${createArtworkDto.code}' cadastrado.`,
      );
    }
  }

  async updateOneArtwork(artworkId: string, createArtworkDto: CreateArtworkDto) {
    const isValidId = isValidObjectId(artworkId);

    if (!isValidId) {
      throw new NotFoundException('Obra não encontrada.');
    }

    try {
      const artwork = await this.artworkModel
        .findByIdAndUpdate(artworkId, createArtworkDto, { new: true })
        .exec();
      return artwork;
    } catch (err) {
      throw new ConflictException(
        `Já existe uma obra com o código '${createArtworkDto.code}' cadastrado.`,
      );
    }
  }

  deleteArtwork(artworkId: string) {
    return this.artworkModel.findByIdAndDelete(artworkId).exec();
  }
}
