import { Event } from '../../entities'
import { ObjectType, Field } from 'type-graphql'
import { Response, pubSub } from '../../common'
import { Topic } from '../../common/topics'
import { IResponse } from '../../../../interfaces'
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql'
import { EventService } from '../../services'
import { EventsInputs } from './inputs'

// Responses Type
@ObjectType()
class EventResponse extends Response(Event) {}
@ObjectType()
class DataFromGetEventsByGroup {
  @Field(type => [Event], { nullable: true })
  events: Event[] | null
  @Field()
  hasNextPage: boolean
}
@ObjectType()
class EventsResponse extends Response(Event) {
  @Field(type => DataFromGetEventsByGroup, { nullable: true })
  data: DataFromGetEventsByGroup | null
}

@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(returns => EventResponse)
  async event(@Args('id') id: string): Promise<IResponse<Event>> {
    return await this.eventService.getEvent(id)
  }

  @Query(returns => EventsResponse)
  async events(
    @Args('data') data: EventsInputs
  ): Promise<IResponse<DataFromGetEventsByGroup>> {
    return this.eventService.getEventsByGroup(data.limit, data.lastEventDate)
  }

  @Subscription(returns => EventResponse, {
    nullable: true,
    resolve: payload => payload
  })
  newEvent() {
    return pubSub.asyncIterator(Topic.NewEvent)
  }

  @Subscription(returns => EventResponse, {
    nullable: true,
    resolve: payload => payload
  })
  deleteEvent() {
    return pubSub.asyncIterator(Topic.DeleteEvent)
  }
}
