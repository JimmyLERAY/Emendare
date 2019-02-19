import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { isUndefined } from 'lodash'
import { Crypto, Mail } from '../../services'
import { activation, reset } from '../../emails'

const model = mongoose.model(
  'User',
  new mongoose.Schema({
    activated: {
      type: Boolean,
      default: process.env.NODE_ENV !== 'production'
    },
    password: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: Date, default: Date.now },
    lastEventDate: { type: Date, default: Date.now },
    token: { type: String, default: null },
    activationToken: { type: String, default: null },
    followedTexts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Text' }],
      default: []
    },
    amends: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amend' }],
      default: []
    },
    upVotes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amend' }],
      default: []
    },
    downVotes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amend' }],
      default: []
    },
    indVotes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amend' }],
      default: []
    },
    notifications: {
      newText: { type: Boolean, default: true },
      newAmend: { type: Boolean, default: true },
      amendAccepted: { type: Boolean, default: true },
      amendRefused: { type: Boolean, default: true }
    }
  })
)

export class User {
  public static get model(): any {
    return model
  }

  public static async login(
    email: string,
    password: string,
    token: string
  ): Promise<any> {
    if (email && password) {
      const user = await this.model.findOne({ email })
      if (user) {
        if (user.activated) {
          if (bcrypt.compareSync(password, user.password)) {
            user.token = Crypto.getToken()
            await user.save()
            return { data: user }
          } else {
            return {
              error: { code: 405, message: 'Le mot de passe est invalide' }
            }
          }
        } else {
          return {
            error: { code: 405, message: "Votre compte n'est pas activé" }
          }
        }
      } else {
        return { error: { code: 405, message: "L'email est invalide" } }
      }
    } else if (token) {
      const user = await this.model.findOne({ token })
      if (user) {
        return { data: user }
      } else {
        return {
          error: {
            code: 405,
            message: 'Le token est invalide'
          }
        }
      }
    } else {
      return {
        error: {
          code: 405,
          message: 'Vous devez spécifier un mot de passe et un email'
        }
      }
    }
  }

  public static async subscribe(email: string, password: string): Promise<any> {
    if (await this.model.findOne({ email })) {
      return {
        error: {
          code: 405,
          message:
            "Cet email est déjà utilisé. Si il s'agit de votre compte, essayez de vous y connecter directement."
        }
      }
    } else {
      const hash = bcrypt.hashSync(password, 10)
      const activationToken = Crypto.getToken()
      await new this.model({
        email,
        password: hash,
        activationToken
      }).save()

      if (Mail) {
        Mail.send({
          to: email,
          subject: activation.subject,
          html: activation.html(activationToken)
        })
          .then(() => {
            return
          })
          .catch(error => {
            console.error(error)
            return {
              error: { code: 500, message: "Erreur dans l'envoi du mail" }
            }
          })
      } else {
        return {
          error: {
            code: 500,
            message: "Les mails ne sont activés qu'en production"
          }
        }
      }
    }
  }

  public static async logout(token: string): Promise<any> {
    const user = await this.model.findOne({ token })
    if (user) {
      user.token = null
      await user.save()
    }
    return
  }

  public static async activateUser(activationToken: string): Promise<any> {
    const user = await this.model.findOne({ activationToken })
    if (user) {
      if (!user.activated) {
        user.activated = true
        await user.save()
        return
      } else {
        return {
          error: { code: 405, message: 'Ce compte est déjà activé' }
        }
      }
    } else {
      return {
        error: {
          code: 405,
          message: 'Votre token est invalide'
        }
      }
    }
  }

  public static async resetPassword(email: string): Promise<any> {
    const user = await this.model.findOne({ email })
    if (!user) {
      return {
        error: {
          code: 405,
          message: "Cet email n'existe pas."
        }
      }
    } else {
      // Generate a new Password
      const newPassword = Crypto.getToken(16)
      // Update the user password
      const hash = bcrypt.hashSync(newPassword, 10)
      user.password = hash
      await user.save()

      if (Mail) {
        Mail.send({
          to: email,
          subject: reset.subject,
          html: reset.html(newPassword)
        })
          .then(() => {
            return
          })
          .catch((error: any) => {
            console.error(error)
            return {
              error: {
                code: 500,
                message: "Erreur lors de l'envoi du mail"
              }
            }
          })
      } else {
        return {
          error: {
            code: 500,
            message: "Les mails ne sont activés qu'en production"
          }
        }
      }
    }
  }

  public static async updatePassword(password: string, token: string) {
    const user = await this.model.findOne({ token })
    if (!user) {
      return {
        error: {
          code: 405,
          message: 'Token invalide'
        }
      }
    } else {
      const hash = bcrypt.hashSync(password, 10)
      user.password = hash
      await user.save()
      // send the user updated
      return { data: user }
    }
  }

  public static async updateEmail(email: string, token: string) {
    if (await this.model.findOne({ email })) {
      return {
        error: {
          code: 405,
          message: 'Cet email est déjà utilisée'
        }
      }
    } else {
      const user = await this.model.findOne({ token })
      if (!user) {
        return {
          error: {
            code: 405,
            message: 'Token invalide'
          }
        }
      } else {
        // Set the new email and the token for the activation
        const activationToken = Crypto.getToken()
        user.activationToken = activationToken
        user.email = email
        user.activated = false
        user.token = null
        await user.save()
        if (Mail) {
          Mail.send({
            to: email,
            subject: activation.subject,
            html: activation.html(activationToken)
          })
            .then(() => {
              // deconnect the user
              return
            })
            .catch(error => {
              console.error(error)
            })
        } else {
          return {
            error: {
              code: 500,
              message: "Les mails ne sont activés qu'en production"
            }
          }
        }
      }
    }
  }

  public static async updateLastEventDate(token: string) {
    const user = await this.model.findOne({ token })
    if (user) {
      user.lastEventDate = new Date()
      await user.save()
      return { data: user }
    } else {
      return {
        error: { code: 401, message: "Cet utilisateur n'est pas connecté" }
      }
    }
  }

  public static async toggleNotificationSetting(key: any, token: string) {
    const user = await User.model.findOne({ token })
    if (user) {
      if (!isUndefined(user.notifications[key])) {
        user.notifications[key] = !user.notifications[key]
        await user.save()
        return { data: user }
      } else {
        return {
          error: { code: 405, message: 'Cette clé de requête est invalide' }
        }
      }
    } else {
      return {
        error: { code: 401, message: "Cet utilisateur n'est pas connecté" }
      }
    }
  }
}
