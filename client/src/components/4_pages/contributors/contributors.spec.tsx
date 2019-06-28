import * as React from 'react'
import enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({ adapter: new Adapter() })

import ContributorsPage from './contributors'

it('should render a ContributorsPage', () => {
  const component = shallow(<ContributorsPage />)
  expect(component).toBeTruthy()
})
