import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @Length(5, 40)
  title: string;

  @MaxLength(250, {
    message: 'Viet dai rua',
  })
  description: string;
}
