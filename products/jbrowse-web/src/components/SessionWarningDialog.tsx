import { pluginDescriptionString } from '@jbrowse/core/PluginLoader'
import { Dialog } from '@jbrowse/core/ui'
import WarningIcon from '@mui/icons-material/Warning'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material'

import type { PluginDefinition } from '@jbrowse/core/PluginLoader'

export default function SessionWarningDialog({
  onConfirm,
  onCancel,
  reason,
}: {
  onConfirm: () => void
  onCancel: () => void
  reason: PluginDefinition[]
}) {
  return (
    <Dialog open maxWidth="xl" title="Warning" onClose={onCancel}>
      <DialogContent>
        <WarningIcon fontSize="large" />
        <DialogContentText>
          This link contains a session that has the following unknown plugins:
          <ul>
            {reason.map(r => (
              <li key={JSON.stringify(r)}>{pluginDescriptionString(r)}</li>
            ))}
          </ul>
          Please ensure you trust the source of this session.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onConfirm()
          }}
        >
          Yes, I trust it
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            onCancel()
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
