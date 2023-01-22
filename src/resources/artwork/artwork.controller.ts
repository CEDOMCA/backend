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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FetchArtworksByAttributesDto } from '@/resources/artwork/dto/requests/fetch-artworks-by-attributes.dto';

import { ArtworkService } from './artwork.service';
import { ArtworkRoDto, CreateArtworkDto, QueryArtworkDto } from './dto';
import { Artwork } from './schema/artwork.schema';

@Controller()
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
  @Get('artworks')
  async getArtworks(@Query() queryArtworkDto: QueryArtworkDto) {
    const artwork = await this.artworkService.getArtworks(queryArtworkDto);

    return this.mapper.mapArrayAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Show one artwork.
   */
  @Get('artworks/:artwork_id')
  @ApiNotFoundResponse({ description: 'Obra não encontrada.' })
  async getOneArtwork(@Param('artwork_id') artworkId: string) {
    const artwork = await this.artworkService.getOneArtwork(artworkId);

    return this.mapper.mapAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Create a new artwork.
   */
  @Post('artworks')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConflictResponse({ description: 'Já existe uma obra com o código informado.' })
  async createArtwork(@Body() createArtworkDto: CreateArtworkDto, @UploadedFile() file) {
    const artwork = await this.artworkService.createArtwork(createArtworkDto, file);

    return this.mapper.mapAsync(artwork, Artwork, ArtworkRoDto);
  }

  /**
   * Update a given artwork.
   */
  @Put('artworks/:artwork_id')
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
  @Delete('artworks/:artwork_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Obra deletada com sucesso.' })
  async deleteFont(@Param('artwork_id') artworkId: string) {
    return this.artworkService.deleteArtwork(artworkId);
  }

  @Get('fonts/:font_name/artworks')
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async getArtworksByAttribute(
    @Param('font_name') fontName: string,
    @Query() fetchArtworksByAttributesDto: FetchArtworksByAttributesDto,
  ) {
    const artworks = await this.artworkService.fetchArtworksByAttributes(
      fontName,
      fetchArtworksByAttributesDto,
    );

    return this.mapper.mapArrayAsync(artworks, Artwork, ArtworkRoDto);
  }
}
