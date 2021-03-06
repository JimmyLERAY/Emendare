import { InputType, Field } from 'type-graphql'
import { TokenInput } from '../../../common'

@InputType()
export class PostArgumentInputs extends TokenInput {
  @Field()
  text: string
  @Field()
  type: string
  @Field()
  amendID: string
}
