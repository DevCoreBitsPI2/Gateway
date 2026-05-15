import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsISO8601, IsInt, IsOptional } from 'class-validator';

export enum ReportExportFormat {
  json = 'json',
  csv = 'csv',
}

export class GenerateConsolidatedPerformanceReportDto {
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'IDs de empleados a incluir en el consolidado. Si se omite, toma todos los registros disponibles.',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  employeeIds?: number[];

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Fecha inicial del rango de consulta (ISO 8601).',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Fecha final del rango de consulta (ISO 8601).',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({
    example: ReportExportFormat.json,
    enum: ReportExportFormat,
    description: 'Formato de exportación. JSON por defecto; CSV devuelve una cadena lista para descargar.',
    default: ReportExportFormat.json,
  })
  @IsOptional()
  @IsEnum(ReportExportFormat)
  export?: ReportExportFormat = ReportExportFormat.json;
}
