import { ApiProperty } from '@nestjs/swagger';

export class CreateConnectionDto {
    @ApiProperty()
    userId: string;

    @ApiProperty({ required: false })
    pairingCode?: string;
}

export class SendMessageDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    to: string;

    @ApiProperty()
    content: string;
}

export class GeneratePairingCodeDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    phoneNumber: string;
}
