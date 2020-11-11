import mix from '../utils/mixins'

import ChartBase from './Base'
import Container from './Container'
import Data from './Data'
import Scale from './Scale'
import Event from './Event'

export default class Chart extends mix(
  ChartBase,
  Container,
  Scale,
  Data,
  Event
) {}
