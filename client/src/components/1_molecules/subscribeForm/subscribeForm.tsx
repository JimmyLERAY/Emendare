import React, { useState, useCallback } from 'react'
// Components
import { Icon, Notification, PwdForm, useUser } from '../../../components'

interface ISubscribeFormProps {
  /** render props of the submit buttons */
  render: any
}

export const SubscribeForm = ({ render }: ISubscribeFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const [pwdSame, setPwdSame] = useState(false)
  const [pwdValid, setPwdValid] = useState(false)
  const [send] = useState(false)
  const { register, errorAuth } = useUser()

  const submit = (event: any) => {
    event.preventDefault()
    register(email, password)
  }

  const change = useCallback(
    (name: string, validInput?: boolean) => (event: any) => {
      switch (name) {
        case 'password':
          setPassword(event.target.value)
          setPwdValid(validInput ? validInput : false)
          break
        case 'checkPassword':
          setCheckPassword(event.target.value)
          setPwdSame(validInput ? validInput : false)
          break
        case 'email':
          setEmail(event.target.value)
      }
    },
    []
  )

  return (
    <form onSubmit={submit} style={{ width: '100%' }}>
      {!send && (
        <React.Fragment>
          <div className="field">
            <div className="control has-icons-left has-icons-right">
              <input
                autoFocus={true}
                placeholder="Email"
                value={email}
                onChange={change('email')}
                className="input"
                type="email"
                aria-label="email input"
              />
              <Icon name="fa-envelope" className="is-medium is-left" />
            </div>
          </div>
          <PwdForm
            change={change}
            password={password}
            checkPassword={checkPassword}
            pwdSame={pwdSame}
            pwdValid={pwdValid}
          />
          <div className="has-text-centered">
            {render(email, password, checkPassword, pwdValid, pwdSame)}
          </div>

          {errorAuth && (
            <React.Fragment>
              <br />
              <Notification className="is-danger has-text-centered">
                {errorAuth.message}
              </Notification>
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {send && (
        <Notification className="is-success has-text-centered">
          Vous allez recevoir dans quelques instants un email avec un lien pour
          activer votre compte. Pensez le cas échéant à vérifier vos spams.
        </Notification>
      )}
    </form>
  )
}
