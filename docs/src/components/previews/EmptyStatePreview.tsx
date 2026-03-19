'use client'
import React from 'react'
import { Preview } from './shared/Preview'
import { EmptyState } from '../../../../packages/registry/components/empty-state/empty-state'
import { Ionicons } from '@expo/vector-icons'

export default function EmptyStatePreview() {
  return (
    <div className="space-y-10">
      <Preview title="Default" code={`<EmptyState
  icon={<Ionicons name="search-outline" size={24} />}
  title="No results found"
  description="Try adjusting your search or filters."
  action={{ label: 'Clear filters', onPress: () => {} }}
  secondaryAction={{ label: 'Browse all', onPress: () => {} }}
/>`}>
        <EmptyState
          icon={<Ionicons name="search-outline" size={24} color="#71717a" />}
          title="No results found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={{ label: 'Clear filters', onPress: () => {} }}
          secondaryAction={{ label: 'Browse all items', onPress: () => {} }}
        />
      </Preview>

      <Preview title="Compact" code={`<EmptyState
  variant="compact"
  icon={<Ionicons name="mail-outline" size={20} />}
  title="No messages"
  description="Your inbox is empty."
  action={{ label: 'Compose', onPress: () => {}, variant: 'outline' }}
/>`}>
        <EmptyState
          variant="compact"
          icon={<Ionicons name="mail-outline" size={20} color="#71717a" />}
          title="No messages"
          description="Your inbox is empty. Messages you receive will appear here."
          action={{ label: 'Compose', onPress: () => {}, variant: 'outline' }}
        />
      </Preview>

      <Preview title="Illustration" code={`<EmptyState
  variant="illustration"
  icon={<Ionicons name="cloud-offline-outline" size={36} />}
  title="You're offline"
  description="Check your connection and try again."
  action={{ label: 'Retry', onPress: () => {} }}
/>`}>
        <EmptyState
          variant="illustration"
          icon={<Ionicons name="cloud-offline-outline" size={36} color="#6366f1" />}
          title="You're offline"
          description="Check your connection and try again."
          action={{ label: 'Retry', onPress: () => {} }}
        />
      </Preview>

      <Preview title="No icon" code={`<EmptyState
  title="Nothing here yet"
  description="Start by creating your first project."
  action={{ label: 'Create project', onPress: () => {} }}
/>`}>
        <EmptyState
          title="Nothing here yet"
          description="Start by creating your first project to get going."
          action={{ label: 'Create project', onPress: () => {} }}
        />
      </Preview>
    </div>
  )
}
