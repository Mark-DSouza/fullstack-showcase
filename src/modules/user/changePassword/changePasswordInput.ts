import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  // Remember to add validation for this field
  password: string;
}
