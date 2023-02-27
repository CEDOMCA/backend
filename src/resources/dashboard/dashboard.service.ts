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
    fonts.sort();
    const artworks = await this.artworkModel.aggregate([
      {
        $group: {
          _id: '$font',
          count: { $sum: 1 },
        },
      },
    ]);

    for (const font of artworks) {
      font._id = font._id.toLowerCase();
    }

    const reduced_artworks = artworks.reduce((acc, curr) => {
      if (acc[curr._id]) {
        acc[curr._id] += curr.count;
      } else {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    return fonts.map((font) => {
      return {
        font,
        count: reduced_artworks[font],
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
