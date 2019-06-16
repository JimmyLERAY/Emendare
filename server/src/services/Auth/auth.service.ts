import { sign, verify } from 'jsonwebtoken'
import { IJWT } from 'src/../../interfaces'
import { Injectable } from '@nestjs/common'
import config from 'src/config'

@Injectable()
export class AuthService {
  public createToken(claims = {}, expiresIn = config.jwt.expire): string {
    const token = sign(claims, config.jwt.secret, { expiresIn })
    return token.toString()
  }

  public decodeToken(token: string): IJWT {
    try {
      return verify(token, config.jwt.secret)
    } catch (err) {
      return null
    }
  }

  public isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)

    if (!decoded) {
      return true
    }

    return Math.floor(Date.now() / 1000) >= decoded.exp
  }

  public isTokenValid(token: string): boolean {
    return Boolean(this.decodeToken(token))
  }
}
