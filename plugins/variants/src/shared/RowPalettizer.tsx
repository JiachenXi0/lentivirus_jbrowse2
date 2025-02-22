import { set1 } from '@jbrowse/core/ui/colors'
import { Button } from '@mui/material'

import { randomColor } from '../util'

import type { Source } from '../types'

export default function RowPalettizer({
  setCurrLayout,
  currLayout,
}: {
  currLayout: Source[]
  setCurrLayout: (arg: Source[]) => void
}) {
  return (
    <div>
      Create color palette based on...
      {Object.keys(currLayout[0] ?? [])
        .filter(
          f =>
            f !== 'name' &&
            f !== 'color' &&
            f !== 'label' &&
            f !== 'id' &&
            f !== 'HP',
        )
        .map(r => (
          <Button
            key={r}
            variant="contained"
            color="inherit"
            onClick={() => {
              const map = new Map<string, number>()
              for (const row of currLayout) {
                const val = map.get(row[r] as string)
                if (!val) {
                  map.set(row[r] as string, 1)
                } else {
                  map.set(row[r] as string, val + 1)
                }
              }
              const ret = Object.fromEntries(
                [...map.entries()]
                  .sort((a, b) => a[1] - b[1])
                  .map((r, idx) => [r[0], set1[idx] || randomColor(r[0])]),
              )

              setCurrLayout(
                currLayout.map(row => ({
                  ...row,
                  color: ret[row[r] as string],
                })),
              )
            }}
          >
            {r}
          </Button>
        ))}
      <Button
        onClick={() => {
          setCurrLayout(
            currLayout.map(row => ({
              ...row,
              color: undefined,
            })),
          )
        }}
      >
        Clear colors
      </Button>
    </div>
  )
}
