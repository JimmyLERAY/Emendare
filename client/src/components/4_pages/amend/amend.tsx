/* eslint-disable sonarjs/cognitive-complexity */

/*
 * Page de détails d'un amendement
 * Le but de cette page est de permettre aux utilisateurs :
 * - d'accéder au détail d'un amendement
 * - TODO : de visualiser le vote de l'amendement
 * - TODO : de participer au vote sur l'amendement
 */

import React from 'react'
import {
  Amend,
  Box,
  Button,
  Buttons,
  Column,
  Columns,
  Hero,
  ErrorPage,
  Icon,
  Notification,
  Page,
  Results,
  DataContext,
  UserContext,
  CountDown
} from '../../../components'
import { Socket, Time } from '../../../services'
import { path } from '../../../config'

const isOutlined = 'is-outlined'

const vote = (user: any) => (amend: any) => (type: string) => (
  id: string
) => async () => {
  const textID = amend.text
  if (user.followedTexts.indexOf(textID) === -1) {
    await Socket.fetch('followText', { id: textID })
  }

  await Socket.fetch(type + 'VoteAmend', { id })
  Socket.emit('user')
}

export const AmendPage = ({ match }: any) => {
  const { get } = React.useContext(DataContext)
  const { user } = React.useContext(UserContext)

  const amend = get('amend')(match.params.id)
  const text = amend && amend.data && get('text')(amend.data.text)

  if (amend && amend.error) {
    return <ErrorPage error={amend.error} />
  }

  if (text && text.error) {
    return <ErrorPage error={text.error} />
  }

  if (amend && amend.data && text && text.data) {
    return (
      <Page
        title={
          text && text.data ? 'Amendement sur ' + text.data.name : 'Amendement'
        }
      >
        <Hero
          title={'Amendement sur ' + text.data.name}
          subtitle={amend.data.name}
        />
        <Buttons>
          <Button to={path.text(amend.data.text)}>
            <Icon type="fas fa-chevron-left" />
            <span>Retour au texte</span>
          </Button>
        </Buttons>
        <Columns>
          <Column>
            <Box>
              <Amend amend={amend.data} text={text.data} />
            </Box>
          </Column>
          <Column>
            <Box>
              <p className="is-size-4 has-text-centered has-text-weight-semibold">
                Scrutin {amend.data.closed ? 'clos' : 'en cours'} sur
                l'amendement
              </p>
              <p className="is-size-5 has-text-centered">
                Répartition des votes exprimés et participation
              </p>
              <br />

              <Results
                data={{
                  up: amend.data.results.upVotesCount,
                  down: amend.data.results.downVotesCount,
                  ind: amend.data.results.indVotesCount,
                  absent:
                    (amend.data.results.totalPotentialVotesCount
                      ? amend.data.results.totalPotentialVotesCount
                      : text.data.followersCount) -
                    (amend.data.results.upVotesCount +
                      amend.data.results.downVotesCount +
                      amend.data.results.indVotesCount)
                }}
              />

              <div
                className="has-text-centered is-hidden-mobile"
                style={{
                  position: 'relative',
                  top: '-82px',
                  marginBottom: '-72px'
                }}
              >
                {amend.data.closed ? (
                  <React.Fragment>
                    <p>Le scrutin est clos</p>
                    <p className="has-text-weight-semibold is-size-3">
                      {amend.data.accepted && !amend.data.conflicted
                        ? 'ACCEPTE'
                        : 'REFUSE'}
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>Temps restant</p>
                    <CountDown
                      date={Time.addTimeToDate(
                        amend.data.created,
                        amend.data.rules.delayMax
                      )}
                      className="has-text-weight-semibold is-size-3"
                    />
                  </React.Fragment>
                )}
              </div>

              {amend.data.closed && amend.data.conflicted && (
                <React.Fragment>
                  <br />
                  <p className="has-text-centered has-text-danger has-text-weight-semibold">
                    Des conflits ont été détectés à l'application de
                    l'amendement. Une nouvelle fonctionalité permettra
                    prochainement aux auteurs des amendements de corriger ces
                    conflits avant les scrutins.
                  </p>
                </React.Fragment>
              )}

              {user && (
                <React.Fragment>
                  <hr />
                  <Buttons
                    className="is-fullwidth"
                    style={{ marginBottom: '0px' }}
                  >
                    <Button
                      className={
                        'is-success ' +
                        (!user.upVotes.includes(amend.data._id)
                          ? isOutlined
                          : '')
                      }
                      disabled={amend.data.closed}
                      onClick={vote(user)(amend.data)('up')(match.params.id)}
                      style={{ flex: 1 }}
                      title="Vous êtes favorable à cet amendement"
                    >
                      Je soutiens cette modification
                    </Button>
                    <Button
                      className={
                        'is-danger ' +
                        (!user.downVotes.includes(amend.data._id)
                          ? isOutlined
                          : '')
                      }
                      disabled={amend.data.closed}
                      onClick={vote(user)(amend.data)('down')(match.params.id)}
                      style={{ flex: 1 }}
                      title="Vous êtes défavorable à cet amendement"
                    >
                      Je préfère la version actuelle
                    </Button>
                  </Buttons>
                  <Buttons className="is-fullwidth">
                    <Button
                      className={
                        'is-info ' +
                        (!user.indVotes.includes(amend.data._id)
                          ? isOutlined
                          : '')
                      }
                      disabled={amend.data.closed}
                      onClick={vote(user)(amend.data)('ind')(match.params.id)}
                      style={{ flex: 1 }}
                      title="Vous êtes indifférent au résultat de ce scrutin"
                    >
                      Je suis indifférent
                    </Button>
                    <Button
                      className={
                        'is-dark ' +
                        (user.upVotes.includes(amend.data._id) ||
                        user.downVotes.includes(amend.data._id) ||
                        user.indVotes.includes(amend.data._id)
                          ? isOutlined
                          : '')
                      }
                      disabled={amend.data.closed}
                      onClick={vote(user)(amend.data)('un')(match.params.id)}
                      style={{ flex: 1 }}
                      title="Vous ne souhaitez pas voter à ce scrutin"
                    >
                      Je m'abstiens
                    </Button>
                  </Buttons>
                </React.Fragment>
              )}
            </Box>

            {!amend.data.closed && (
              <Notification className="is-light">
                <p>
                  Le vote est{' '}
                  <span className="has-text-weight-semibold">
                    clos à la fin du temps maximum indiqué
                  </span>{' '}
                  OU dès lors qu'une{' '}
                  <span className="has-text-weight-semibold">
                    majorité absolue
                  </span>{' '}
                  est atteinte après un delai minimum d'une heure. Le{' '}
                  <span className="has-text-weight-semibold">
                    vote est liquide
                  </span>
                  , ce qui veut dire que vous pouvez changer votre vote jusqu'à
                  la fin du scrutin.
                </p>
              </Notification>
            )}
          </Column>
        </Columns>
      </Page>
    )
  }

  return null
}
