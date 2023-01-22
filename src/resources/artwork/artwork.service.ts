import { Storage } from '@google-cloud/storage';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { FetchArtworksByAttributesDto } from '@/resources/artwork/dto/requests/fetch-artworks-by-attributes.dto';

import { CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork, ArtworkDocument } from './schema/artwork.schema';

@Injectable()
export class ArtworkService {
  constructor(
    @InjectModel('Artwork') private readonly artworkModel: Model<ArtworkDocument>,
    @Inject('STORAGE_CONNECTION') private readonly storage: Storage,
  ) {}

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

  async getArtworkFile(artwork: Artwork) {
    const bucket = this.storage.bucket('cedomca-bucket');
    const gcsFile = bucket.file(artwork.filePath);
    const file = await gcsFile.download();
    return file[0];
  }

  async createArtwork(createArtworkDto: CreateArtworkDto, file: Express.Multer.File) {
    try {
      const artwork = new this.artworkModel({
        ...createArtworkDto,
        font: createArtworkDto.font.toLowerCase(),
      });
      const savedArtwork = await artwork.save();
      this.saveArtworkFile(savedArtwork, file);
      return savedArtwork;
    } catch (err) {
      throw new ConflictException(
        `Já existe uma obra com o código '${createArtworkDto.code}' cadastrado.`,
      );
    }
  }

  async saveArtworkFile(artwork: Artwork, file: Express.Multer.File) {
    const bucket = this.storage.bucket('cedomca-bucket');
    const filePath = `artworks/${artwork.id}/${file.originalname}`;
    const gcsFile = bucket.file(filePath);
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.end(file.buffer);
    artwork.filePath = filePath;
    await artwork.save();
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

  async fetchArtworksByAttributes(
    fontName: string,
    fetchArtworksByAttributesDto: FetchArtworksByAttributesDto,
  ) {
    const names = !Array.isArray(fetchArtworksByAttributesDto.names)
      ? [fetchArtworksByAttributesDto.names]
      : fetchArtworksByAttributesDto.names;
    const values = !Array.isArray(fetchArtworksByAttributesDto.values)
      ? [fetchArtworksByAttributesDto.values]
      : fetchArtworksByAttributesDto.values;

    return this.artworkModel
      .find({
        font: fontName.toLowerCase(),
        'attributes.name': {
          $all: names,
        },
        'attributes.value': {
          $all: values,
        },
      })
      .exec();
  }
}
