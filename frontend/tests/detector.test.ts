import { describe, expect, it } from 'vitest'
import { analyzeMessage, detectEntities } from '../src/services/detector'

describe('RAKSHAK detector', () => {
  it('detects guaranteed return claims as high risk indicators', () => {
    const result = analyzeMessage(
      'Invest ?5000 today and get guaranteed profit with no risk.',
    )

    expect(result.riskIndicator).toBe('high-risk-indicators')
    expect(result.redFlags.some((flag) => flag.id === 'guaranteed_returns')).toBe(true)
  })

  it('detects sensitive credential requests', () => {
    const result = analyzeMessage(
      'Send me your OTP to verify your investment account.',
    )

    expect(result.riskIndicator).toBe('high-risk-indicators')
    expect(result.redFlags.some((flag) => flag.id === 'credential_request')).toBe(true)
  })

  it('does not flag a message that warns users not to share OTP', () => {
    const result = analyzeMessage(
      'Never share your OTP, PIN or password with anyone.',
    )

    expect(
      result.redFlags.some((flag) => flag.id === 'credential_request'),
    ).toBe(false)
  })

  it('detects investment solicitation with financial context', () => {
    const result = analyzeMessage(
      'Join our investment scheme and send ?10000 to start earning.',
    )

    expect(
      result.redFlags.some((flag) => flag.id === 'investment_solicitation'),
    ).toBe(true)

    expect(result.riskIndicator).toBe('suspicious')
  })

  it('does not flag educational investment content as solicitation', () => {
    const result = analyzeMessage(
      'This course explains how to invest in stocks and manage investment risk.',
    )

    expect(
      result.redFlags.some((flag) => flag.id === 'investment_solicitation'),
    ).toBe(false)
  })

  it('detects suspicious URL structure', () => {
    const result = analyzeMessage(
      'Verify your account here: http://192.168.1.10/login',
    )

    expect(
      result.redFlags.some(
        (flag) => flag.id === 'suspicious_url_structure',
      ),
    ).toBe(true)

    expect(result.urlWarnings.length).toBeGreaterThan(0)
  })

  it('detects Hinglish urgency', () => {
    const result = analyzeMessage(
      'Abhi karo, limited slots hain. Aaj hi register karo.',
    )

    expect(
      result.redFlags.some((flag) => flag.id === 'urgency_pressure'),
    ).toBe(true)
  })

  it('detects secrecy pressure around an investment opportunity', () => {
    const result = analyzeMessage(
      "This investment opportunity is private. Don't tell anyone.",
    )

    expect(
      result.redFlags.some((flag) => flag.id === 'secrecy_pressure'),
    ).toBe(true)
  })

  it('returns low concern for an ordinary message with no configured warning pattern', () => {
    const result = analyzeMessage(
      'The college library will remain open until 8 PM today.',
    )

    expect(result.riskIndicator).toBe('low-concern')
    expect(result.redFlags).toHaveLength(0)
  })

  it('does not treat low concern as proof of safety', () => {
    const result = analyzeMessage(
      'Please review this message carefully.',
    )

    expect(result.riskIndicator).toBe('low-concern')
    expect(result.explanation.en).toContain(
      'does not mean the message is safe',
    )
  })
})

test('recognizes known entities', () => {
  const entities = detectEntities('SEBI and RBI are mentioned here.')

  expect(entities.map((entity) => entity.name)).toEqual(['SEBI', 'RBI'])
})

test('entity recognition does not reduce scam risk', () => {
  const result = analyzeMessage(
    'SEBI says send ?500 now and guaranteed 30% returns today.',
  )

  expect(result.entitiesRecognized?.some((entity) => entity.name === 'SEBI')).toBe(true)
  expect(result.riskIndicator).toBe('high-risk-indicators')
})

it('detects unrealistic income claims', () => {
  const result = analyzeMessage(
    'Earn ?50000 every day with our simple investment plan.',
  )

  expect(
    result.redFlags.some((flag) => flag.id === 'unrealistic_income'),
  ).toBe(true)
})

it('detects requests to move communication off platform', () => {
  const result = analyzeMessage(
    'For this investment opportunity, contact me privately on WhatsApp.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'off_platform_communication',
    ),
  ).toBe(true)
})

it('detects authority impersonation', () => {
  const result = analyzeMessage(
    'I am calling from SEBI. Send your account details immediately for verification.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'impersonation_authority',
    ),
  ).toBe(true)
})

it('detects KYC or account closure threats', () => {
  const result = analyzeMessage(
    'Your KYC will expire today and your account will be closed unless you verify now.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'kyc_account_threat',
    ),
  ).toBe(true)
})

it('detects advance fee requests', () => {
  const result = analyzeMessage(
    'Pay ?2000 processing fee first to receive your investment payout.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'advance_fee_request',
    ),
  ).toBe(true)
})

it('detects fake reward or prize claims', () => {
  const result = analyzeMessage(
    'Congratulations! You have won a cash prize. Pay the processing fee to claim your reward.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'fake_reward_prize',
    ),
  ).toBe(true)
})

it('detects crypto trading solicitation', () => {
  const result = analyzeMessage(
    'Join our crypto trading group and invest ?10000 for guaranteed trading profits.',
  )

  expect(
    result.redFlags.some(
      (flag) => flag.id === 'crypto_trading_solicitation',
    ),
  ).toBe(true)
})
