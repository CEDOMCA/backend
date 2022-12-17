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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateFontDto, FontRoDto, UpdateFontDto } from './dto';
import { FontService } from './font.service';
import { Font } from './schema/font.schema';

@Controller('fonts')
@ApiTags('Fonts')
export class FontController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,

    private readonly fontService: FontService,
  ) {}

  /**
   * Show all informations of all fonts.
   */
  @Get()
  async showAllFonts(): Promise<FontRoDto[]> {
    const fonts = await this.fontService.showAllFonts();

    return this.mapper.mapArrayAsync(fonts, Font, FontRoDto);
  }

  /**
   * Show all informations of a given font.
   */
  @Get(':font_id')
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async showOneFont(@Param('font_id') fontId: string): Promise<FontRoDto> {
    const font = await this.fontService.showOneFont(fontId);

    return this.mapper.mapAsync(font, Font, FontRoDto);
  }

  /**
   * Create a new font.
   */
  @Post()
  @ApiConflictResponse({ description: 'Já existe uma fonte com o nome informado.' })
  @ApiBadRequestResponse({ description: 'Algum campo não segue suas restrições.' })
  async createFont(@Body() createFontDto: CreateFontDto) {
    const font = await this.fontService.createFont(createFontDto);

    return this.mapper.mapAsync(font, Font, FontRoDto);
  }

  /**
   * Replace all informations of a given font.
   */
  @Put(':font_id')
  @ApiConflictResponse({ description: 'Já existe uma fonte com o nome informado.' })
  @ApiBadRequestResponse({ description: 'Algum campo não segue suas restrições.' })
  @ApiNotFoundResponse({ description: 'Fonte não encontrada.' })
  async updateFont(@Param('font_id') fontId: string, @Body() updateFontDto: UpdateFontDto) {
    const font = await this.fontService.updateFont(fontId, updateFontDto);

    return this.mapper.mapAsync(font, Font, FontRoDto);
  }

  /**
   * Delete a given font. If the font does not exist, it is ignored.
   */
  @Delete(':font_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Fonte deletada com sucesso.' })
  async deleteFont(@Param('font_id') fontId: string) {
    return this.fontService.deleteFont(fontId);
  }
}
