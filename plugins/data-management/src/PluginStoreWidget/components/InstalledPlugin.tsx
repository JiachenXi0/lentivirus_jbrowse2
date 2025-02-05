import { lazy } from 'react'

import { getEnv, getSession } from '@jbrowse/core/util'
import { isSessionWithSessionPlugins } from '@jbrowse/core/util/types'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import { IconButton, ListItem, Tooltip, Typography } from '@mui/material'
import { observer } from 'mobx-react'
import { makeStyles } from 'tss-react/mui'

import type { PluginStoreModel } from '../model'
import type { BasePlugin } from '@jbrowse/core/util/types'

// lazies
const DeletePluginDialog = lazy(() => import('./DeletePluginDialog'))

const useStyles = makeStyles()(() => ({
  lockedPluginTooltip: {
    marginRight: '0.5rem',
  },
}))

function LockedPlugin() {
  const { classes } = useStyles()
  return (
    <Tooltip
      className={classes.lockedPluginTooltip}
      title="This plugin was installed by an administrator, you cannot remove it."
    >
      <LockIcon />
    </Tooltip>
  )
}

const InstalledPlugin = observer(function ({
  plugin,
  model,
}: {
  plugin: BasePlugin
  model: PluginStoreModel
}) {
  const { pluginManager } = getEnv(model)
  const session = getSession(model)
  const { jbrowse, adminMode } = session
  const isSessionPlugin = isSessionWithSessionPlugins(session)
    ? session.sessionPlugins.some(
        p => pluginManager.pluginMetadata[plugin.name]?.url === p.url,
      )
    : false

  return (
    <ListItem key={plugin.name}>
      {adminMode || isSessionPlugin ? (
        <IconButton
          data-testid={`removePlugin-${plugin.name}`}
          onClick={() => {
            session.queueDialog(onClose => [
              DeletePluginDialog,
              {
                plugin: plugin.name,
                onClose: (name?: string) => {
                  if (name) {
                    const pluginMetadata =
                      pluginManager.pluginMetadata[plugin.name]

                    if (adminMode) {
                      jbrowse.removePlugin(pluginMetadata)
                    } else if (isSessionWithSessionPlugins(session)) {
                      session.removeSessionPlugin(pluginMetadata)
                    }
                  }
                  onClose()
                },
              },
            ])
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : (
        <LockedPlugin />
      )}
      <Typography>{plugin.name}</Typography>
    </ListItem>
  )
})

export default InstalledPlugin
