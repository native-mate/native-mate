import { describe, it, expect } from 'vitest'
import { resolveTokens, zinc } from '../tokens'
import { makeStyles } from '../theme/makeStyles'

// makeStyles is a factory that returns a hook. We can't call hooks outside
// React, but we CAN verify the factory itself and the styles it produces.

describe('makeStyles', () => {
  it('returns a function (hook)', () => {
    const useStyles = makeStyles((theme) => ({
      container: { backgroundColor: theme.colors.background },
    }))
    expect(typeof useStyles).toBe('function')
  })

  it('factory receives a theme and returns style objects', () => {
    const theme = resolveTokens(zinc, 'dark')
    const factory = (t: typeof theme) => ({
      box: { padding: t.spacing.md, borderRadius: t.radius.md },
    })
    const styles = factory(theme)
    expect(styles.box.padding).toBe(12)
    expect(styles.box.borderRadius).toBe(10)
  })

  it('factory can access all token categories', () => {
    const theme = resolveTokens(zinc, 'dark')
    const factory = (t: typeof theme) => ({
      text: {
        color: t.colors.foreground,
        fontSize: t.typography.size.md,
        fontWeight: t.typography.weight.bold,
        lineHeight: t.typography.lineHeight.normal,
      },
      animated: {
        // animation tokens are accessible
        opacity: t.animation.speed.fast > 0 ? 1 : 0,
      },
    })
    const styles = factory(theme)
    expect(styles.text.color).toBe('#fafafa')
    expect(styles.text.fontSize).toBe(15)
    expect(styles.text.fontWeight).toBe('700')
    expect(styles.animated.opacity).toBe(1)
  })

  it('produces different styles for different presets', () => {
    const darkTheme = resolveTokens(zinc, 'dark')
    const lightTheme = resolveTokens(zinc, 'light')
    const factory = (t: typeof darkTheme) => ({
      bg: { backgroundColor: t.colors.background },
    })
    expect(factory(darkTheme).bg.backgroundColor).toBe('#070709')
    expect(factory(lightTheme).bg.backgroundColor).toBe('#ffffff')
  })
})
