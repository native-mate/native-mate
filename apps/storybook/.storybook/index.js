import { getStorybookUI } from '@storybook/react-native'

import './preview'

require('../stories/Accordion.stories.tsx')
require('../stories/ActionSheet.stories.tsx')
require('../stories/Alert.stories.tsx')
require('../stories/Avatar.stories.tsx')
require('../stories/Badge.stories.tsx')
require('../stories/Button.stories.tsx')
require('../stories/Card.stories.tsx')
require('../stories/Checkbox.stories.tsx')
require('../stories/EmptyState.stories.tsx')
require('../stories/Input.stories.tsx')
require('../stories/Modal.stories.tsx')
require('../stories/OtpInput.stories.tsx')
require('../stories/Progress.stories.tsx')
require('../stories/Radio.stories.tsx')
require('../stories/Screen.stories.tsx')
require('../stories/Select.stories.tsx')
require('../stories/Sheet.stories.tsx')
require('../stories/Skeleton.stories.tsx')
require('../stories/Slider.stories.tsx')
require('../stories/Switch.stories.tsx')
require('../stories/Tabs.stories.tsx')
require('../stories/Tag.stories.tsx')
require('../stories/Textarea.stories.tsx')
require('../stories/Toast.stories.tsx')
require('../stories/Tooltip.stories.tsx')

const StorybookUIRoot = getStorybookUI({})

export default StorybookUIRoot
