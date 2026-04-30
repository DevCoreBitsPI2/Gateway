import { SetMetadata } from '@nestjs/common';                                                                                                                                               
                                                            
export const POSITIONS_KEY = 'positions';
export const Positions = (...ids: number[]) => SetMetadata(POSITIONS_KEY, ids);
