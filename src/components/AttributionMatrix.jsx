import React, { useState } from 'react'
import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { VStack } from '@astryxdesign/core/VStack'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Divider } from '@astryxdesign/core/Divider'
import { Center } from '@astryxdesign/core/Center'
import { Layers, Maximize2 } from 'lucide-react'
import ZoomModal from './ZoomModal'

export default function AttributionMatrix({ standardMaps, robustMaps, attackType, eps }) {
  const [activeColIndex, setActiveColIndex] = useState(null)
  const [blendOverlay, setBlendOverlay] = useState(false)

  const columns = [
    {
      key: 'input',
      title: 'Perturbed Input',
      colormap: 'Grayscale',
      desc: 'Adversarial chest X-ray entering the convolutional backbone (x_adv = clip(x + δ)). High-frequency noise remains largely imperceptible to human eyes but completely derails the standard classifier.',
      mathFormula: 'x_adv = clip(x + δ, 0, 1)'
    },
    {
      key: 'gradcam',
      title: 'Grad-CAM',
      colormap: 'Jet Overlaid',
      desc: 'Gradient-weighted Class Activation Mapping extracted from layer4[-1]. Computes coarse anatomical feature localization decisive for prediction.',
      mathFormula: 'L_{Grad-CAM}^c = ReLU( ∑_k α_k^c A^k )'
    },
    {
      key: 'smoothgrad',
      title: 'SmoothGrad',
      colormap: 'Reds',
      desc: 'NoiseTunnel Saliency with 10 Gaussian perturbation passes (σ=0.1) to suppress noisy gradients and isolate sharp anatomical boundaries.',
      mathFormula: 'M_{SG}(x) = 1/n ∑ ∇_x S_c(x + N(0, σ²))'
    },
    {
      key: 'ig',
      title: 'Integrated Grads',
      colormap: 'Reds',
      desc: 'Path integral of gradients along a straight trajectory from baseline image to input over 20 discrete steps. Rigorously satisfies the Completeness Axiom.',
      mathFormula: 'IG_i(x) = (x_i - x\'_i) ∫_0^1 ∂F(x\'+α(x-x\'))/∂x_i dα'
    },
    {
      key: 'shap',
      title: 'SHAP (Gradient)',
      colormap: 'Coolwarm',
      desc: 'GradientShap expectation calculating Shapley game-theoretic attributions across 16 background reference chest radiographs from the test split.',
      mathFormula: 'φ_i(x) ≈ (x_i - E[x\'_i]) · E[ ∇F(x\'+α(x-x\'))_i ]'
    }
  ]

  return (
    <Card variant="default" padding={6}>
      <VStack gap={5}>
        
        {/* Header Bar */}
        <Stack direction="horizontal" justify="between" align="center" wrap="wrap" gap={3}>
          <VStack gap={1}>
            <Stack direction="horizontal" gap={2} align="center">
              <Badge variant="info" label="ATTRIBUTION LIGHTBOX" />
              <Text type="code" color="secondary">2 Architectures × 5 XAI Methods</Text>
            </Stack>
            <Heading level={2} weight="semibold">
              2×5 XAI Attribution Matrix
            </Heading>
            <Text type="supporting">
              Diagnostic visual proof comparing Standard vs Robust feature localization under {attackType.toUpperCase()} stress (ε = {eps}/255).
            </Text>
          </VStack>

          <Stack direction="horizontal" gap={2} align="center">
            <Button
              variant={blendOverlay ? 'primary' : 'secondary'}
              size="sm"
              icon={<Layers size={14} />}
              label={blendOverlay ? 'Soft Blend Active' : 'Heatmap Focus'}
              onClick={() => setBlendOverlay(!blendOverlay)}
            />
            <Text type="code" color="secondary" size="xs">
              Click tile to inspect
            </Text>
          </Stack>
        </Stack>

        <Divider />

        {/* Matrix Rows */}
        <VStack gap={6}>
          
          {/* ROW 1: Standard ResNet-18 */}
          <VStack gap={2.5}>
            <Stack direction="horizontal" justify="between" align="center">
              <Stack direction="horizontal" gap={2} align="center">
                <Badge variant="error" label="Row 1: Standard ResNet-18 (ERM)" />
                <Text type="label" color="secondary">Severe Attribution Drift</Text>
              </Stack>
              <Text type="supporting" size="xs">
                Attributions fragment onto non-pathological artifacts
              </Text>
            </Stack>

            <Grid columns={{ minWidth: 160, max: 5 }} gap={2}>
              {columns.map((col, idx) => {
                const imgSrc = standardMaps?.[col.key]
                return (
                  <Card
                    key={`std-${col.key}`}
                    variant="muted"
                    padding={2}
                    onClick={() => imgSrc && setActiveColIndex(idx)}
                  >
                    <VStack gap={1.5}>
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text type="label" size="xs" maxLines={1}>{col.title}</Text>
                        <Text type="code" size="3xs" color="secondary">{col.colormap}</Text>
                      </Stack>

                      <div className="relative w-full aspect-square rounded overflow-hidden flex items-center justify-center cursor-pointer group bg-black/40">
                        {imgSrc ? (
                          <>
                            <img
                              src={imgSrc}
                              alt={`Standard ${col.title}`}
                              className={`w-full h-full object-contain transition-opacity ${
                                blendOverlay ? 'opacity-80 mix-blend-screen' : 'opacity-100'
                              }`}
                              style={{ imageRendering: 'pixelated' }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <Text type="code" size="2xs" color="placeholder">Pending</Text>
                        )}
                      </div>

                      <Text type="code" size="3xs" color="secondary">
                        Standard • {col.key}
                      </Text>
                    </VStack>
                  </Card>
                )
              })}
            </Grid>
          </VStack>

          {/* Defense Contrast Divider */}
          <Center>
            <Badge variant="neutral" label="MIN-MAX PGD DEFENSE CONTRAST" />
          </Center>

          {/* ROW 2: Robust ResNet-18 */}
          <VStack gap={2.5}>
            <Stack direction="horizontal" justify="between" align="center">
              <Stack direction="horizontal" gap={2} align="center">
                <Badge variant="success" label="Row 2: Robust ResNet-18 (Madry PGD-AT)" />
                <Text type="label" color="accent">Preserved Clinical Salience</Text>
              </Stack>
              <Text type="supporting" size="xs">
                Suppresses adversarial gradient artifacts
              </Text>
            </Stack>

            <Grid columns={{ minWidth: 160, max: 5 }} gap={2}>
              {columns.map((col, idx) => {
                const imgSrc = robustMaps?.[col.key]
                return (
                  <Card
                    key={`rob-${col.key}`}
                    variant="muted"
                    padding={2}
                    onClick={() => imgSrc && setActiveColIndex(idx)}
                  >
                    <VStack gap={1.5}>
                      <Stack direction="horizontal" justify="between" align="center">
                        <Text type="label" size="xs" maxLines={1}>{col.title}</Text>
                        <Text type="code" size="3xs" color="secondary">{col.colormap}</Text>
                      </Stack>

                      <div className="relative w-full aspect-square rounded overflow-hidden flex items-center justify-center cursor-pointer group bg-black/40">
                        {imgSrc ? (
                          <>
                            <img
                              src={imgSrc}
                              alt={`Robust ${col.title}`}
                              className={`w-full h-full object-contain transition-opacity ${
                                blendOverlay ? 'opacity-80 mix-blend-screen' : 'opacity-100'
                              }`}
                              style={{ imageRendering: 'pixelated' }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <Text type="code" size="2xs" color="placeholder">Pending</Text>
                        )}
                      </div>

                      <Text type="code" size="3xs" color="secondary">
                        Robust • {col.key}
                      </Text>
                    </VStack>
                  </Card>
                )
              })}
            </Grid>
          </VStack>

        </VStack>
      </VStack>

      {/* Dual Comparative Zoom Modal */}
      <ZoomModal
        isOpen={activeColIndex !== null}
        onClose={() => setActiveColIndex(null)}
        activeColIndex={activeColIndex}
        onSelectColIndex={setActiveColIndex}
        columns={columns}
        standardMaps={standardMaps}
        robustMaps={robustMaps}
      />
    </Card>
  )
}
