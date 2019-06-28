/*
 * Page d'amendement
 * Le but de cette page est de permettre aux utilisateurs :
 * - de visualiser la version actuelle du texte
 * - d'éditer le texte et de visualiser les modification
 * - d'écrire un argumentaire pour défendre l'amendement
 * - de valider l'ajout de l'amendement à la liste du texte
 * - TODO : de mettre à jour l'amendement sur la dernière version du texte
 * - d'accéder au détail d'un amendement
 */

import React from 'react'
import ErrorPage from '../../4_pages/error/error'
import { DataContext, Edit, Page } from '../../../components'

const EditPage = (props: any) => {
  const data = React.useContext(DataContext)
  const text = data.get('text')(props.match.params.id)

  return text && text.data ? (
    <Page title={'Amendement de ' + text.data.name}>
      <Edit data={text.data} />
    </Page>
  ) : text && text.error ? (
    <ErrorPage error={text.error} />
  ) : null
}

export default EditPage
