import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('administrative-data/contracts')
export class ContractsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.client.send('createContract', createContractDto).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get()
  findAll() {
    return this.client.send('findAllContracts', {}).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('findOneContract', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.client.send('updateContract', { ...updateContractDto, id }).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('removeContract', id).pipe(
      catchError((err) => { throw new RpcException(err); }),
    );
  }
}
