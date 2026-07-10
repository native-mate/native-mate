'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { DatePicker } from '../../../../packages/registry/components/date-picker/date-picker'

export default function DatePickerPreview() {
  const [date1, setDate1] = useState(new Date())
  const [date2, setDate2] = useState(new Date())
  const [date3, setDate3] = useState(new Date())

  return (
    <div className="space-y-10">
      <Preview title="Date mode" minHeight={420} code={`import { DatePicker } from '~/components/ui/date-picker'

const [date, setDate] = useState(new Date())

<DatePicker value={date} onChange={setDate} mode="date" title="Select date" />`}>
        <View style={{ width: 320 }}>
          <DatePicker value={date1} onChange={setDate1} mode="date" title="Select date" />
        </View>
      </Preview>

      <Preview title="Time mode" minHeight={200} code={`<DatePicker value={date} onChange={setDate} mode="time" title="Select time" />`}>
        <View style={{ width: 320 }}>
          <DatePicker value={date2} onChange={setDate2} mode="time" title="Select time" />
        </View>
      </Preview>

      <Preview title="With confirm button and date range" minHeight={460} code={`<DatePicker
  value={date}
  onChange={setDate}
  mode="date"
  title="Book a stay"
  showConfirmButton
  confirmLabel="Confirm date"
  minimumDate={new Date()}
  maximumDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
/>`}>
        <View style={{ width: 320 }}>
          <DatePicker
            value={date3}
            onChange={setDate3}
            mode="date"
            title="Book a stay"
            showConfirmButton
            confirmLabel="Confirm date"
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
          />
        </View>
      </Preview>
    </div>
  )
}
