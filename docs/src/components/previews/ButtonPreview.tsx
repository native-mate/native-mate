'use client'
import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Preview } from './shared/Preview'
import { Button, ButtonGroup } from '../../../../packages/registry/components/button/button'

export default function ButtonPreview() {
  return (
    <div className="space-y-10">
      <Preview title="Variants" code={`import { Button } from '~/components/ui/button'

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="link">Link</Button>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link</Button>
        </View>
      </Preview>

      <Preview title="Sizes" code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </View>
      </Preview>

      <Preview title="Rounded (pill)" code={`<Button rounded>Rounded</Button>
<Button rounded variant="outline">Pill Outline</Button>
<Button rounded variant="destructive">Pill Delete</Button>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Button rounded>Rounded</Button>
          <Button rounded variant="outline">Pill Outline</Button>
          <Button rounded variant="destructive">Pill Delete</Button>
        </View>
      </Preview>

      <Preview title="Icon only" code={`<Button iconOnly iconLeft={<Ionicons name="add" size={20} color="#000" />} />
<Button iconOnly variant="outline" iconLeft={<Ionicons name="close" size={18} color="#fafafa" />} />
<Button iconOnly rounded iconLeft={<Ionicons name="heart" size={18} color="#000" />} />`}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button iconOnly iconLeft={<Ionicons name="add" size={20} color="#000" />} />
          <Button iconOnly variant="outline" iconLeft={<Ionicons name="close" size={18} color="#fafafa" />} />
          <Button iconOnly rounded iconLeft={<Ionicons name="heart" size={18} color="#000" />} />
          <Button iconOnly rounded variant="destructive" iconLeft={<Ionicons name="trash" size={18} color="#fff" />} />
        </View>
      </Preview>

      <Preview title="With icons" code={`<Button iconLeft={<Ionicons name="add" size={18} color="#000" />}>Add item</Button>
<Button variant="outline" iconRight={<Ionicons name="arrow-forward" size={16} color="#fafafa" />}>Next</Button>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Button iconLeft={<Ionicons name="add" size={18} color="#000" />}>Add item</Button>
          <Button variant="outline" iconRight={<Ionicons name="arrow-forward" size={16} color="#fafafa" />}>Next</Button>
        </View>
      </Preview>

      <Preview title="Custom colors" code={`<Button color="#6366f1">Indigo</Button>
<Button color="#10b981">Emerald</Button>
<Button color="#f59e0b" variant="outline">Amber outline</Button>`}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Button color="#6366f1">Indigo</Button>
          <Button color="#10b981">Emerald</Button>
          <Button color="#f59e0b" variant="outline">Amber outline</Button>
        </View>
      </Preview>

      <Preview title="ButtonGroup" code={`import { Button, ButtonGroup } from '~/components/ui/button'

<ButtonGroup fullWidth variant="outline">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button>Month</Button>
  <Button>Year</Button>
</ButtonGroup>`}>
        <View style={{ gap: 12, width: '100%', maxWidth: 320 }}>
          <ButtonGroup fullWidth>
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <ButtonGroup fullWidth variant="outline">
            <Button>Cancel</Button>
            <Button>Confirm</Button>
          </ButtonGroup>
        </View>
      </Preview>

      <Preview title="Full width" code={`<Button fullWidth>Full Width Button</Button>
<Button fullWidth variant="outline">Full Width Outline</Button>`}>
        <View style={{ gap: 10, width: '100%', maxWidth: 320 }}>
          <Button fullWidth>Full Width Button</Button>
          <Button fullWidth variant="outline">Full Width Outline</Button>
        </View>
      </Preview>

      <Preview title="Loading & disabled" code={`<Button loading>Saving...</Button>
<Button disabled>Disabled</Button>`}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button loading>Saving...</Button>
          <Button disabled>Disabled</Button>
        </View>
      </Preview>
    </div>
  )
}
