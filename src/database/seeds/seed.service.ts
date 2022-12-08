import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FontDocument } from '@/resources/font/schema/font.schema';

type AttributeDomain = {
  name: string;

  domain: string;

  schema?: {
    keys: Array<string>;

    domains: Array<string>;
  };
};

type Fonts = {
  name: string;

  description: string;

  attributes: Array<AttributeDomain>;
};

@Injectable()
export class SeedService {
  constructor(@InjectModel('Font') private readonly fontModel: Model<FontDocument>) {}

  async seedPredefinedFonts(): Promise<Fonts[]> {
    const fonts = readFileSync(resolve(__dirname, 'fonts.json'), {
      encoding: 'utf-8',
    });

    const parsedFonts: Fonts[] = JSON.parse(fonts);

    const fontsModel = await this.fontModel.create(parsedFonts);
    await this.fontModel.bulkSave(fontsModel);

    return fontsModel;
  }
}
