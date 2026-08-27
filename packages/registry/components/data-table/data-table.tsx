// native-mate: data-table@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, ScrollView, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { DataTableProps, DataTableColumn, SortDirection } from './data-table.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: theme.typography.size.xs,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortIcon: {
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowStriped: {
    backgroundColor: theme.colors.background + '80',
  },
  rowPressed: {
    backgroundColor: theme.colors.primary + '08',
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  cellBordered: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  cellText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.foreground,
  },
  cellAlignCenter: {
    alignItems: 'center',
  },
  cellAlignRight: {
    alignItems: 'flex-end',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  loadingCell: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  skeleton: {
    height: 14,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
}))

function SkeletonRow<T>({
  columns,
  bordered,
  index,
  striped,
}: {
  columns: DataTableColumn<T>[]
  bordered: boolean
  index: number
  striped: boolean
}) {
  const styles = useStyles()
  const skeletonWidths = [60, 80, 45, 70, 55, 90]

  return (
    <Animated.View
      style={[
        styles.loadingRow,
        striped && index % 2 === 1 && styles.rowStriped,
      ]}
    >
      {columns.map((col, i) => (
        <View
          key={col.key}
          style={[
            styles.loadingCell,
            col.width != null ? { width: col.width } : { flex: col.flex ?? 1 },
            bordered && i < columns.length - 1 && styles.cellBordered,
          ]}
        >
          <View
            style={[
              styles.skeleton,
              { width: `${skeletonWidths[i % skeletonWidths.length]}%`, opacity: 0.5 },
            ]}
          />
        </View>
      ))}
    </Animated.View>
  )
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sortBy,
  sortDirection,
  onSort,
  onRowPress,
  stickyHeader = true,
  striped = false,
  bordered = false,
  loading = false,
  loadingRows = 5,
  emptyMessage = 'No data available',
  keyExtractor,
  haptic = true,
  style,
  ...rest
}: DataTableProps<T>) {
  const theme = useTheme()
  const styles = useStyles()

  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) return
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      const newDirection: SortDirection =
        sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc'
      onSort(key, newDirection)
    },
    [haptic, sortBy, sortDirection, onSort],
  )

  const handleRowPress = useCallback(
    (row: T, index: number) => {
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      onRowPress?.(row, index)
    },
    [haptic, onRowPress],
  )

  const renderHeaderCell = (column: DataTableColumn<T>, index: number) => {
    const isSorted = sortBy === column.key
    const isSortable = column.sortable && onSort != null

    // This sizing style must live on the cell's outermost element (the direct
    // child of headerRow's flex row), not on an inner wrapper — otherwise the
    // header column widths won't match the body cells' flex/width and the
    // columns misalign.
    const sizingStyle = [
      column.width != null ? { width: column.width } : { flex: column.flex ?? 1 },
      bordered && index < columns.length - 1 && styles.cellBordered,
    ]

    const cellContent = (
      <View
        style={[
          styles.headerCell,
          column.align === 'center' && { justifyContent: 'center' },
          column.align === 'right' && { justifyContent: 'flex-end' },
        ]}
      >
        <Text variant="caption" style={styles.headerText}>
          {column.title}
        </Text>
        {isSortable && (
          <View style={styles.sortIcon}>
            <Ionicons
              name={
                isSorted
                  ? sortDirection === 'asc'
                    ? 'caret-up'
                    : 'caret-down'
                  : 'swap-vertical-outline'
              }
              size={12}
              color={isSorted ? theme.colors.primary : theme.colors.muted}
            />
          </View>
        )}
      </View>
    )

    if (isSortable) {
      return (
        <Pressable
          key={column.key}
          onPress={() => handleSort(column.key)}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${column.title}`}
          style={sizingStyle}
        >
          {cellContent}
        </Pressable>
      )
    }

    return <View key={column.key} style={sizingStyle}>{cellContent}</View>
  }

  const renderRow = (row: T, rowIndex: number) => {
    const key = keyExtractor ? keyExtractor(row, rowIndex) : String(rowIndex)
    const isStriped = striped && rowIndex % 2 === 1

    const rowContent = (
      <View
        style={[
          styles.row,
          isStriped && styles.rowStriped,
        ]}
      >
        {columns.map((col, colIndex) => {
          const cellValue = row[col.key]
          const cellContent = col.render
            ? col.render(cellValue, row, rowIndex)
            : cellValue

          return (
            <View
              key={col.key}
              style={[
                styles.cell,
                col.width != null ? { width: col.width } : { flex: col.flex ?? 1 },
                col.align === 'center' && styles.cellAlignCenter,
                col.align === 'right' && styles.cellAlignRight,
                bordered && colIndex < columns.length - 1 && styles.cellBordered,
              ]}
            >
              {typeof cellContent === 'string' || typeof cellContent === 'number' ? (
                <Text variant="body" style={styles.cellText} numberOfLines={1}>
                  {String(cellContent)}
                </Text>
              ) : (
                cellContent
              )}
            </View>
          )
        })}
      </View>
    )

    if (onRowPress) {
      return (
        <Pressable
          key={key}
          onPress={() => handleRowPress(row, rowIndex)}
          accessibilityRole="button"
          accessibilityLabel={`Row ${rowIndex + 1}`}
          style={({ pressed }) => pressed && styles.rowPressed}
        >
          {rowContent}
        </Pressable>
      )
    }

    return <View key={key}>{rowContent}</View>
  }

  const header = (
    <View style={styles.headerRow}>
      {columns.map(renderHeaderCell)}
    </View>
  )

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="grid"
      accessibilityLabel="Data table"
      {...rest}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ minWidth: '100%' }}>
          <ScrollView
            showsVerticalScrollIndicator
            bounces
            stickyHeaderIndices={stickyHeader ? [0] : undefined}
          >
            {header}
            {loading ? (
              Array.from({ length: loadingRows }).map((_, i) => (
                <SkeletonRow
                  key={i}
                  columns={columns}
                  bordered={bordered}
                  index={i}
                  striped={striped}
                />
              ))
            ) : data.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="file-tray-outline"
                  size={32}
                  color={theme.colors.muted}
                  style={{ marginBottom: 8 }}
                />
                <Text variant="body" style={styles.emptyText}>
                  {emptyMessage}
                </Text>
              </View>
            ) : (
              data.map(renderRow)
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}
