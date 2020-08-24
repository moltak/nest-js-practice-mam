import { ParentEntity } from '../entity/parent.entity';

export class ParentPayload {
  constructor(parent: ParentEntity) {
    this.description = parent.description;
    this.careAge = parent.careAge;
  }

  description: string;
  careAge: number;
}
