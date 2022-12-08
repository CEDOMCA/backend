import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreateFontDto, UpdateFontDto } from './dto';
import { Font, FontDocument } from './schema/font.schema';

@Injectable()
export class FontService {
  constructor(@InjectModel('Font') private readonly fontModel: Model<FontDocument>) {}

  async createFont(createFontDto: CreateFontDto): Promise<Font> {
    try {
      const font = new this.fontModel(createFontDto);
      const savedFont = await font.save();
      return savedFont;
    } catch (error) {
      throw new ConflictException(
        `Já existe uma fonte com o nome '${createFontDto.name}' cadastrada.`,
      );
    }
  }

  async updateFont(fontId: string, updateFontDto: UpdateFontDto): Promise<Font> {
    const isValidId = isValidObjectId(fontId);

    if (!isValidId) {
      throw new NotFoundException('Fonte não encontrada.');
    }

    try {
      const font = await this.fontModel
        .findByIdAndUpdate(fontId, updateFontDto, { new: true })
        .exec();
      return font;
    } catch (error) {
      throw new ConflictException(
        `Já existe uma fonte com o nome '${updateFontDto.name}' cadastrada.`,
      );
    }
  }

  showAllFonts(): Promise<Font[]> {
    return this.fontModel.find().exec();
  }

  async showOneFont(fontId: string): Promise<Font> {
    const isValidId = isValidObjectId(fontId);

    if (!isValidId) {
      throw new NotFoundException('Fonte não encontrada.');
    }

    return this.fontModel.findById(fontId).exec();
  }
}
