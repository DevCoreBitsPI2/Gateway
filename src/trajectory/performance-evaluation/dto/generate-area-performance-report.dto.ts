import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsInt, IsOptional } from 'class-validator';
import { ReportExportFormat } from './generate-consolidated-performance-report.dto';

export class GenerateAreaPerformanceReportDto {
  @ApiProperty({ example: 1, description: 'ID del área para generar el reporte' })
  @IsInt()
  @Type(() => Number)
  areaId: number;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Fecha inicial del rango de consulta' })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha final del rango de consulta' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({ enum: ReportExportFormat, default: ReportExportFormat.json, description: 'Formato de exportación' })
  @IsOptional()
  @IsEnum(ReportExportFormat)
  export?: ReportExportFormat;
}
