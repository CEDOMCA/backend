import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ArtworkService } from './artwork.service';
import { ArtworkRoDto, CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork } from './schema/artwork.schema';

@Controller('artworks')
@ApiTags('Artwork')
export class ArtworkController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,

    private readonly artworkService: ArtworkService,
  ) {}

  /**
   * Show all artworks filtered by `font` param. If `undefined`, return all artworks.
   */
  @Get()
  async getArtworks(@Query() queryArtworkDto: QueryArtworkDto) {
    const artwork = await this.artworkService.getArtworks(queryArtworkDto);

    return this.mapper.mapArrayAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Show one artwork.
   */
  @Get(':artwork_id')
  @ApiNotFoundResponse({ description: 'Obra não encontrada.' })
  async getOneArtwork(@Param('artwork_id') artworkId: string) {
    const artwork = await this.artworkService.getOneArtwork(artworkId);

    return this.mapper.mapAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Create a new artwork.
   */
  @Post()
  @ApiConflictResponse({ description: 'Já existe uma obra com o código informado.' })
  async createArtwork(@Body() createArtworkDto: CreateArtworkDto) {
    const artwork = await this.artworkService.createArtwork(createArtworkDto);

    return this.mapper.mapAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Update a given artwork.
   */
  @Put(':artwork_id')
  @ApiConflictResponse({ description: 'Já existe uma obra com o código informado.' })
  async updateOneArtwork(
    @Param('artwork_id') artworkId: string,
    @Body() createArtworkDto: CreateArtworkDto,
  ) {
    const artwork = await this.artworkService.updateOneArtwork(artworkId, createArtworkDto);

    return this.mapper.mapAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Delete a given artwork. If the artwork does not exist, it is ignored.
   */
  @Delete(':artwork_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Obra deletada com sucesso.' })
  async deleteFont(@Param('artwork_id') artworkId: string) {
    return this.artworkService.deleteArtwork(artworkId);
  }
}
