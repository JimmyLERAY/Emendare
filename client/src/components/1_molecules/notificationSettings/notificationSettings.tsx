/* eslint-disable jsx-a11y/label-has-for */

import React from 'react'
import { Box, Button, NotificationsContext } from '../../../components'
import { Socket } from '../../../services'
import { IUser } from '../../../../../interfaces'

const keys = ['newText', 'newAmend', 'amendAccepted', 'amendRefused']

const change = (key: string) => async () => {
  await Socket.fetch('toggleNotificationSetting', { key })
}

const mapKeyToTitle = (key: string) => {
  switch (key) {
    case 'newText':
      return 'Nouveau texte'
    case 'newAmend':
      return 'Nouvel amendement'
    case 'amendAccepted':
      return 'Amendement accepté'
    case 'amendRefused':
      return 'Amendement refusé'
    default:
      return 'Clé invalide'
  }
}

interface INotificationSettingsProps {
  user: IUser
}

export const NotificationSettings = (props: INotificationSettingsProps) => (
  <NotificationsContext.Consumer>
    {({ permission, requestPermission }) => (
      <Box>
        <p className="has-text-weight-semibold">Réglages des notifications</p>
        <br />
        {permission === 'default' && (
          <React.Fragment>
            <div>
              <Button className="is-success" onClick={requestPermission}>
                Activer les notifications
              </Button>
            </div>
            <br />
          </React.Fragment>
        )}
        {keys.map(key => (
          <div key={key} className="field">
            <input
              id={key}
              type="checkbox"
              name={key}
              className="switch is-rounded is-success"
              disabled={permission !== 'granted'}
              checked={(props.user.notifications as any)[key] as boolean}
              onChange={change(key)}
            />
            <label htmlFor={key}>{mapKeyToTitle(key)}</label>
          </div>
        ))}
      </Box>
    )}
  </NotificationsContext.Consumer>
)
