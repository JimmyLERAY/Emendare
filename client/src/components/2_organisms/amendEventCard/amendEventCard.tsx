import React, { useContext } from 'react'

// Components
import {
  Icon,
  StopWatch,
  Vote,
  Columns,
  CountDown,
  DiffPreview,
  DataContext,
  CardLayout
} from '../../../components'

// Interfaces
import { IUser, IResponse, IText, IAmend } from '../../../../../interfaces'

// Services
import { Time } from '../../../services'

interface IAmendEventCardProps {
  /** Related event */
  target: IAmend
  /** user data */
  user: IUser | null
  measure: any
  /** Index of the card */
  index: number
}

export const AmendEventCard = ({
  target,
  user,
  measure
}: IAmendEventCardProps) => {
  const { get } = useContext(DataContext)
  const text: IResponse<IText> = get('text')(target.text)

  return (
    <CardLayout>
      <CardLayout.Icon>
        <Icon
          type={'light'}
          name="fa-plus"
          className="fa-2x has-text-primary is-large"
        />
      </CardLayout.Icon>
      <CardLayout.Description>
        <div>
          <p style={{ margin: 0 }}>
            <strong>Vote en cours</strong>
            {' - '}
            <small style={{ wordSpacing: 'normal' }}>
              <StopWatch date={target.created} />
            </small>
          </p>
          <p style={{ marginTop: '0.5em' }}>
            <span className="has-text-weight-semibold is-italic">
              {target.name}
            </span>
            <br />
            {target.description}
          </p>
          <div style={{ marginTop: '0.5em' }}>
            {target.closed ? (
              <span className="has-text-weight-ligh is-italic">
                Amendement terminé.
              </span>
            ) : (
              <React.Fragment>
                <span className="has-text-weight-ligh is-italic">
                  Temps restant :{' '}
                </span>
                <CountDown
                  date={Time.addTimeToDate(
                    target.created,
                    target.rules.delayMax
                  )}
                  className="has-text-weight-semibold"
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </CardLayout.Description>
      {text && text.data && target && (
        <CardLayout.Detail>
          <DiffPreview amend={target} text={text.data} measure={measure} />
        </CardLayout.Detail>
      )}
      <CardLayout.Footer>
        <div className="card-events-footer">
          <Columns className="is-mobile">
            {user && (
              <Vote
                amend={target}
                match={{ params: { id: target._id } }}
                user={user}
                withIcon={true}
              />
            )}
          </Columns>
        </div>
      </CardLayout.Footer>
    </CardLayout>
  )
}
