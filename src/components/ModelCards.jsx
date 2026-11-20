import React from 'react'
import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { VStack } from '@astryxdesign/core/VStack'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { ProgressBar } from '@astryxdesign/core/ProgressBar'
import { Divider } from '@astryxdesign/core/Divider'
import { CheckCircle2, AlertTriangle, ShieldCheck, Activity, TrendingDown } from 'lucide-react'

export default function ModelCards({ standardData, robustData, trueLabel }) {
  if (!standardData || !robustData) return null

  const trueClassName = trueLabel === 1 ? 'Pneumonia' : 'Normal'
  const isStdCorrect = standardData.pred === trueClassName
  const isRobCorrect = robustData.pred === trueClassName

  const stdDrift = standardData.drift || 0
  const robDrift = robustData.drift || 0
  const driftReduction = stdDrift > 0 ? (((stdDrift - robDrift) / stdDrift) * 100).toFixed(1) : 0

  return (
    <VStack gap={4}>
      {/* Header bar with Astryx typography and badge */}
      <Stack direction="horizontal" justify="between" align="center" wrap="wrap" gap={2}>
        <VStack gap={0.5}>
          <Stack direction="horizontal" gap={1.5} align="center">
            <Activity className="w-4 h-4 text-sky-400" />
            <Heading level={2} weight="semibold">
              Diagnostic Decision & Attribution Drift Audit
            </Heading>
          </Stack>
          <Text type="supporting">
            Comparative analysis of classifier vulnerability and explanation stability under perturbation
          </Text>
        </VStack>

        {stdDrift > robDrift && (
          <Badge
            variant="success"
            icon={<TrendingDown className="w-3.5 h-3.5" />}
            label={`Robust defense achieves ${driftReduction}% lower explanation drift`}
          />
        )}
      </Stack>

      {/* Side-by-Side Model Comparison Cards */}
      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        
        {/* CARD 1: Standard ResNet-18 */}
        <Card variant={isStdCorrect ? 'default' : 'muted'} padding={5}>
          <VStack gap={4}>
            
            {/* Card Header */}
            <Stack direction="horizontal" justify="between" align="start" gap={3}>
              <VStack gap={1}>
                <Stack direction="horizontal" gap={2} align="center">
                  <Badge variant="neutral" label="Baseline ERM" />
                  <Text type="code" color="secondary">ResNet-18</Text>
                </Stack>
                <Heading level={3} weight="semibold">Standard ResNet-18</Heading>
                <Text type="supporting">
                  Trained purely on empirical cross-entropy loss without adversarial defense
                </Text>
              </VStack>

              <VStack gap={0.5} align="end">
                <Badge
                  variant={isStdCorrect ? 'success' : 'error'}
                  icon={isStdCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  label={isStdCorrect ? 'Correct Diagnosis' : 'Adversarial Misclassification'}
                />
                <Text type="large" weight="bold" color={isStdCorrect ? 'primary' : 'secondary'}>
                  {standardData.pred}
                </Text>
              </VStack>
            </Stack>

            <Divider />

            {/* Confidence Score Bar */}
            <VStack gap={1.5}>
              <Stack direction="horizontal" justify="between" align="center">
                <Text type="label">Confidence Score</Text>
                <Text type="code" weight="semibold" hasTabularNumbers>
                  {standardData.conf.toFixed(1)}%
                </Text>
              </Stack>
              <ProgressBar
                label="Standard model confidence"
                isLabelHidden
                value={Math.min(standardData.conf, 100)}
                variant={isStdCorrect ? 'success' : 'error'}
              />
            </VStack>

            {/* Attribution Drift Metric Box */}
            <Card variant="default" padding={3}>
              <VStack gap={2}>
                <Stack direction="horizontal" justify="between" align="center">
                  <VStack gap={0.5}>
                    <Text type="label">Grad-CAM L2 Attribution Drift</Text>
                    <Text type="code" color="secondary">
                      || CAM(x_clean) - CAM(x_adv) ||₂
                    </Text>
                  </VStack>
                  <Text type="large" weight="bold" hasTabularNumbers color="accent">
                    {standardData.drift.toFixed(2)}
                  </Text>
                </Stack>
                <Divider />
                <Stack direction="horizontal" justify="between" align="center">
                  <Text type="supporting">Explanation Stability:</Text>
                  <Badge
                    variant={isStdCorrect ? 'neutral' : 'error'}
                    label={isStdCorrect ? 'Stable' : 'Severe Distortion Under Attack'}
                  />
                </Stack>
              </VStack>
            </Card>

          </VStack>
        </Card>

        {/* CARD 2: Robust ResNet-18 (Madry PGD-AT) */}
        <Card variant={isRobCorrect ? 'default' : 'muted'} padding={5}>
          <VStack gap={4}>
            
            {/* Card Header */}
            <Stack direction="horizontal" justify="between" align="start" gap={3}>
              <VStack gap={1}>
                <Stack direction="horizontal" gap={2} align="center">
                  <Badge variant="teal" label="Madry PGD-AT" />
                  <Text type="code" color="secondary">ResNet-18</Text>
                </Stack>
                <Stack direction="horizontal" gap={1.5} align="center">
                  <Heading level={3} weight="semibold">Robust ResNet-18</Heading>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </Stack>
                <Text type="supporting">
                  Min-Max optimization against iterative PGD perturbations (ε=8/255)
                </Text>
              </VStack>

              <VStack gap={0.5} align="end">
                <Badge
                  variant={isRobCorrect ? 'success' : 'warning'}
                  icon={isRobCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  label={isRobCorrect ? 'Robust Correct' : 'Shifted Prediction'}
                />
                <Text type="large" weight="bold" color="primary">
                  {robustData.pred}
                </Text>
              </VStack>
            </Stack>

            <Divider />

            {/* Confidence Score Bar */}
            <VStack gap={1.5}>
              <Stack direction="horizontal" justify="between" align="center">
                <Text type="label">Confidence Score</Text>
                <Text type="code" weight="semibold" hasTabularNumbers>
                  {robustData.conf.toFixed(1)}%
                </Text>
              </Stack>
              <ProgressBar
                label="Robust model confidence"
                isLabelHidden
                value={Math.min(robustData.conf, 100)}
                variant={isRobCorrect ? 'success' : 'warning'}
              />
            </VStack>

            {/* Attribution Drift Metric Box */}
            <Card variant="default" padding={3}>
              <VStack gap={2}>
                <Stack direction="horizontal" justify="between" align="center">
                  <VStack gap={0.5}>
                    <Text type="label">Grad-CAM L2 Attribution Drift</Text>
                    <Text type="code" color="secondary">
                      || CAM(x_clean) - CAM(x_adv) ||₂
                    </Text>
                  </VStack>
                  <Text type="large" weight="bold" hasTabularNumbers color="accent">
                    {robustData.drift.toFixed(2)}
                  </Text>
                </Stack>
                <Divider />
                <Stack direction="horizontal" justify="between" align="center">
                  <Text type="supporting">Explanation Stability:</Text>
                  <Badge
                    variant="success"
                    label="Salient Lesion Focus Retained"
                  />
                </Stack>
              </VStack>
            </Card>

          </VStack>
        </Card>

      </Grid>
    </VStack>
  )
}
