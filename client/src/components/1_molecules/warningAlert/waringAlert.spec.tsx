import * as React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

import { WarningAlert } from './warinigAlert'

it('should render a EarlyAlert', () => {
  const component = shallow(
    <WarningAlert message={test} onClick={() => console.log('close')} />
  )
  expect(component).toBeTruthy()
})
