import { SitterEntity } from '../entity/sitter.entity';

export class SitterPayload {
  constructor(sitter: SitterEntity) {
    this.selfIntroduction = sitter.selfIntroduction;
    this.minimumCareAge = sitter.minimumCareAge;
  }

  selfIntroduction: string;
  minimumCareAge: number;
}
