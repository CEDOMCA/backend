import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ArtworkDocument } from '@/resources/artwork/schema/artwork.schema';
import { FontDocument } from '@/resources/font/schema/font.schema';
import { UserDocument } from '@/resources/user/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    @InjectModel('Artwork')
    private artworkModel: Model<ArtworkDocument>,
    @InjectModel('Font')
    private readonly fontModel: Model<FontDocument>,
  ) {}

  async getHowManyUsers() {
    return {
      count: await this.userModel.countDocuments().exec(),
    };
  }

  async getFonts() {
    const fonts = await this.fontModel.find().exec();
    return fonts.map((font) => font.name.toLowerCase());
  }

  async getHowManyArtworksByFont() {
    const fonts = await this.getFonts();
    const artworks = await this.artworkModel.aggregate([
      {
        $group: {
          _id: '$font',
          count: { $sum: 1 },
        },
      },
    ]);

    return fonts.map((font) => {
      const artwork = artworks.find((artwork) => artwork._id === font);
      return {
        font,
        count: artwork ? artwork.count : 0,
      };
    });
  }

  async getDashboard() {
    const users = await this.getHowManyUsers();
    const artworks = await this.getHowManyArtworksByFont();

    return {
      users,
      artworks,
    };
  }
}
