import { Storage } from '@google-cloud/storage';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CreateCommentDto } from '@/resources/artwork/dto/requests/create-comment.dto';
import { FetchArtworksByAttributesDto } from '@/resources/artwork/dto/requests/fetch-artworks-by-attributes.dto';
import { SessionData } from '@/resources/auth/auth.controller';
import { Roles } from '@/resources/user/user.constants';

import { CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork, ArtworkDocument } from './schema/artwork.schema';

@Injectable()
export class ArtworkService {
  constructor(
    @InjectModel('Artwork') private readonly artworkModel: Model<ArtworkDocument>,
    @Inject('STORAGE_CONNECTION') private readonly storage: Storage,
    private readonly configService: ConfigService,
  ) {}

  async getArtworks(queryArtworkDto: QueryArtworkDto) {
    const whenArtworks = this.artworkModel.find().sort({ title: 1 });
    if (queryArtworkDto.font) {
      whenArtworks.where('font').equals(queryArtworkDto.font.toLowerCase());
    }

    const artworks = await whenArtworks.exec();
    return artworks.map((artwork) => {
      return {
        id: artwork.id,
        code: artwork.code,
        title: artwork.title,
        font: artwork.font,
        filePath: artwork.filePath,
        attributes: artwork.attributes,
        comments: artwork.comments,
      };
    });
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
    return {
      id: artwork.id,
      code: artwork.code,
      title: artwork.title,
      font: artwork.font,
      filePath: artwork.filePath,
      attributes: artwork.attributes,
      comments: artwork.comments,
    };
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
        attributes: JSON.parse(createArtworkDto.attributes),
        font: createArtworkDto.font.toLowerCase(),
      });
      const savedArtwork = await artwork.save();
      if (file) this.saveArtworkFile(savedArtwork, file);
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
    artwork.filePath = this.configService.get('GOOGLE_CLOUD_STORAGE_URL') + '/' + filePath;
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
      .sort({ title: 1 })
      .exec();
  }

  async createComment(artworkId: string, createCommentDto: CreateCommentDto, session: SessionData) {
    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;
    artwork.comments.push({
      id: uuidv4(),
      comment: createCommentDto.comment,
      userId: user.id,
      fullName: user.fullName,
      createdAt: new Date(),
    });
    const savedArtwork = await artwork.save();
    return {
      id: savedArtwork.id,
      code: savedArtwork.code,
      title: savedArtwork.title,
      font: savedArtwork.font,
      filePath: savedArtwork.filePath,
      attributes: savedArtwork.attributes,
      comments: savedArtwork.comments,
    };
  }

  async deleteComment(artworkId: string, commentId: string, session: SessionData) {
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;

    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');

    const comment = artwork.comments.find((c) => c.id === commentId);
    if (!comment) throw new NotFoundException('Comentário não encontrado.');

    console.log(user);
    console.log(user.role !== Roles.visitor);
    if (comment.userId !== user.id || user.role !== Roles.visitor)
      throw new NotFoundException('Usuário não autorizado.');
    artwork.comments = artwork.comments.filter((c) => c.id !== commentId);

    const savedArtwork = await artwork.save();
    return {
      id: savedArtwork.id,
      code: savedArtwork.code,
      title: savedArtwork.title,
      font: savedArtwork.font,
      filePath: savedArtwork.filePath,
      attributes: savedArtwork.attributes,
      comments: savedArtwork.comments,
    };
  }

  async updateComment(
    artworkId: string,
    commentId: string,
    createCommentDto: CreateCommentDto,
    session: SessionData,
  ) {
    if (!session.passport) throw new NotFoundException('Usuário não encontrado.');
    const { user } = session.passport;

    const artwork = await this.artworkModel.findById(artworkId).exec();
    if (!artwork) throw new NotFoundException('Obra não encontrada.');

    const commentToUpdate = artwork.comments.find((c) => c.id === commentId);
    if (!commentToUpdate) throw new NotFoundException('Comentário não encontrado.');

    if (commentToUpdate.userId !== user.id) throw new NotFoundException('Usuário não autorizado.');

    artwork.comments.forEach((c) => {
      if (c.id === commentId) c.comment = createCommentDto.comment;
    });

    await artwork.updateOne(artwork);

    return {
      id: artwork.id,
      code: artwork.code,
      title: artwork.title,
      font: artwork.font,
      filePath: artwork.filePath,
      attributes: artwork.attributes,
      comments: artwork.comments,
    };
  }
}
