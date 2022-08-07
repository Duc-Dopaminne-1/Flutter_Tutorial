import { AModalTab } from '@/components/AModalTab/AModalTab'
import { AModalTabButton } from '@/components/AModalTab/AModalTabButton'
import { ARow } from '@/components/ARow/ARow'
import I18n from '@/i18n'
import * as React from 'react'

type Props = {
  value: string
  onSelect: (unit: string) => void
}

export const SelectUnitTab: React.SFC<Props> = ({ value, onSelect }) => {
  return (
    <AModalTab title={I18n.t('selectUnit')}>
      <ARow>
        <AModalTabButton
          title={'Millimeter'}
          unit={'mm'}
          value={value}
          onSelect={onSelect}
        />
        <AModalTabButton
          title={'Centimeter'}
          unit={'cm'}
          value={value}
          onSelect={onSelect}
        />
      </ARow>

      <ARow>
        <AModalTabButton
          title={'Meter'}
          unit={'m'}
          value={value}
          onSelect={onSelect}
        />
        <AModalTabButton
          title={'Inch'}
          unit={'in'}
          value={value}
          onSelect={onSelect}
        />
      </ARow>

      <ARow>
        <AModalTabButton
          title={'Feet'}
          unit={'Ft'}
          value={value}
          onSelect={onSelect}
        />
      </ARow>
    </AModalTab>
  )
}
