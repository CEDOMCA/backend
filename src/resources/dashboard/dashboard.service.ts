import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ArtworkDocument } from '@/resources/artwork/schema/artwork.schema';
import { UserDocument } from '@/resources/user/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    @InjectModel('Artwork')
    private artworkModel: Model<ArtworkDocument>,
  ) {}

  async getHowManyUsers() {
    return {
      count: await this.userModel.countDocuments().exec(),
    };
  }

  async getHowManyArtworksByArtwork() {
    const artworks = await this.artworkModel.aggregate([
      {
        $group: {
          _id: '$font',
          count: { $sum: 1 },
        },
      },
    ]);

    return artworks.map((artwork) => ({
      font: artwork._id,
      count: artwork.count,
    }));
  }

  async getDashboard() {
    const users = await this.getHowManyUsers();
    const artworks = await this.getHowManyArtworksByArtwork();

    return {
      users,
      artworks,
    };
  }
}
