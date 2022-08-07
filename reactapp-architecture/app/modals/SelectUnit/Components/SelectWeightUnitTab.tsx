import { AModalTab } from '@/components/AModalTab/AModalTab'
import { AModalTabButton } from '@/components/AModalTab/AModalTabButton'
import { AModalTabExpand } from '@/components/AModalTab/AModalTabExpand'
import { ARow } from '@/components/ARow/ARow'
import I18n from '@/i18n'
import * as React from 'react'

type Props = {
  value: string
  onSelect: (unit: string) => void
}

export const SelectWeightUnitTab: React.SFC<Props> = ({ value, onSelect }) => {
  return (
    <AModalTab title={I18n.t('selectUnit')}>
      <ARow>
        <AModalTabButton
          title={'Kilogram'}
          unit={'kg'}
          value={value}
          onSelect={onSelect}
        />
        <AModalTabButton
          title={'Gram'}
          unit={'gr'}
          value={value}
          onSelect={onSelect}
        />
      </ARow>

      <ARow>
        <AModalTabButton
          title={'Pound'}
          unit={'lb'}
          value={value}
          onSelect={onSelect}
        />
        <AModalTabButton
          title={'Ounce'}
          unit={'oz'}
          value={value}
          onSelect={onSelect}
        />
      </ARow>
    </AModalTab>
  )
}
