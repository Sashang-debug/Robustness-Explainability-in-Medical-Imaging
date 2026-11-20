import React from 'react'
import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { VStack } from '@astryxdesign/core/VStack'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Divider } from '@astryxdesign/core/Divider'
import { X, Download, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ZoomModal({
  isOpen,
  onClose,
  activeColIndex,
  onSelectColIndex,
  columns,
  standardMaps,
  robustMaps
}) {
  if (!isOpen || activeColIndex === null || activeColIndex === undefined) return null

  const col = columns[activeColIndex]
  const stdImg = standardMaps?.[col.key]
  const robImg = robustMaps?.[col.key]

  const handlePrev = () => {
    onSelectColIndex((activeColIndex - 1 + columns.length) % columns.length)
  }

  const handleNext = () => {
    onSelectColIndex((activeColIndex + 1) % columns.length)
  }

  const handleDownload = (imgSrc, name) => {
    const a = document.createElement('a')
    a.href = imgSrc
    a.download = `${name}_${col.key}.png`
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        <Card variant="default" padding={5}>
          <VStack gap={4}>
            
            {/* Header */}
            <Stack direction="horizontal" justify="between" align="center" wrap="wrap" gap={3}>
              <VStack gap={0.5}>
                <Stack direction="horizontal" gap={2} align="center">
                  <Badge variant="info" label={`Column ${activeColIndex + 1} of ${columns.length}`} />
                  <Text type="code" color="secondary">{col.colormap} Colormap</Text>
                </Stack>
                <Heading level={2} weight="semibold">
                  {col.title} Attribution Comparison
                </Heading>
              </VStack>

              <Stack direction="horizontal" gap={1.5} align="center">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ChevronLeft size={16} />}
                  label="Previous"
                  onClick={handlePrev}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ChevronRight size={16} />}
                  label="Next"
                  onClick={handleNext}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  label="Close"
                  onClick={onClose}
                />
              </Stack>
            </Stack>

            <Divider />

            {/* Side-by-Side Dual Viewport */}
            <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
              
              {/* Standard Model Tile */}
              <Card variant="muted" padding={4}>
                <VStack gap={3}>
                  <Stack direction="horizontal" justify="between" align="center">
                    <Stack direction="horizontal" gap={1.5} align="center">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <Heading level={4} weight="semibold">Standard ResNet-18 (ERM)</Heading>
                    </Stack>
                    {stdImg && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download size={14} />}
                        label="Save"
                        onClick={() => handleDownload(stdImg, 'Standard')}
                      />
                    )}
                  </Stack>

                  <div className="relative aspect-square w-full rounded bg-black/60 overflow-hidden flex items-center justify-center p-2 border border-white/[0.08]">
                    {stdImg ? (
                      <img
                        src={stdImg}
                        alt={`Standard ${col.title}`}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <Text type="code" color="placeholder">No attribution map</Text>
                    )}
                  </div>

                  <Text type="supporting" size="xs">
                    Notice how gradient attribution disperses across non-pathological background areas under adversarial perturbation.
                  </Text>
                </VStack>
              </Card>

              {/* Robust Model Tile */}
              <Card variant="muted" padding={4}>
                <VStack gap={3}>
                  <Stack direction="horizontal" justify="between" align="center">
                    <Stack direction="horizontal" gap={1.5} align="center">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <Heading level={4} weight="semibold">Robust ResNet-18 (Madry PGD-AT)</Heading>
                    </Stack>
                    {robImg && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download size={14} />}
                        label="Save"
                        onClick={() => handleDownload(robImg, 'Robust')}
                      />
                    )}
                  </Stack>

                  <div className="relative aspect-square w-full rounded bg-black/60 overflow-hidden flex items-center justify-center p-2 border border-white/[0.08]">
                    {robImg ? (
                      <img
                        src={robImg}
                        alt={`Robust ${col.title}`}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <Text type="code" color="placeholder">No attribution map</Text>
                    )}
                  </div>

                  <Text type="supporting" size="xs">
                    Min-Max defense suppresses high-frequency noise gradients, focusing salience on genuine lung parenchyma opacities.
                  </Text>
                </VStack>
              </Card>

            </Grid>

            {/* Algorithmic Formulation Card */}
            <Card variant="default" padding={3}>
              <VStack gap={1.5}>
                <Stack direction="horizontal" justify="between" align="center" wrap="wrap" gap={2}>
                  <Text type="label">Methodology & Algorithmic Formulation</Text>
                  <Text type="code" color="accent" size="xs">{col.mathFormula}</Text>
                </Stack>
                <Text type="supporting" size="xs">{col.desc}</Text>
              </VStack>
            </Card>

            <Divider />

            {/* Bottom Method Selector Bar */}
            <Stack direction="horizontal" justify="between" align="center" wrap="wrap" gap={2}>
              <Stack direction="horizontal" gap={1.5} align="center" wrap="wrap">
                {columns.map((c, idx) => (
                  <Button
                    key={c.key}
                    variant={activeColIndex === idx ? 'primary' : 'ghost'}
                    size="sm"
                    label={c.title}
                    onClick={() => onSelectColIndex(idx)}
                  />
                ))}
              </Stack>
              <Text type="code" color="secondary" size="2xs">
                Use Previous / Next buttons to step through
              </Text>
            </Stack>

          </VStack>
        </Card>
      </div>
    </div>
  )
}
