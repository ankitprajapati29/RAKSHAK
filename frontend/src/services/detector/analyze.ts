import { RESULT_TRANSLATIONS } from '../../data/translations'

import type { AnalysisResult, DetectedRedFlag } from '../../types'
import { detectRedFlags } from './rules'
import { analyzeUrls } from './urlAnalyzer'
import { detectEntities } from './entities'

function calculateRisk(
  redFlags: DetectedRedFlag[],
): AnalysisResult['riskIndicator'] {
  const criticalCount = redFlags.filter(
    (flag) => flag.severity === 'critical',
  ).length

  const highCount = redFlags.filter(
    (flag) => flag.severity === 'high',
  ).length

  const mediumCount = redFlags.filter(
    (flag) => flag.severity === 'medium',
  ).length

  if (criticalCount >= 1) {
    return 'high-risk-indicators'
  }

  if (highCount >= 2) {
    return 'suspicious'
  }

  if (highCount === 1) {
    return 'suspicious'
  }

  if (mediumCount >= 2) {
    return 'suspicious'
  }

  return 'low-concern'
}

function buildExplanation(
  riskIndicator: AnalysisResult['riskIndicator'],
  redFlags: DetectedRedFlag[],
): AnalysisResult['explanation'] {
  if (riskIndicator === 'high-risk-indicators') {
    return {
      en: `The message contains one or more critical warning signs. Review the highlighted evidence carefully before taking action.`,
      hi: `इस संदेश में एक या अधिक गंभीर चेतावनी संकेत हैं। कार्रवाई करने से पहले हाइलाइट किए गए सबूतों की ध्यान से समीक्षा करें।`,
    }
  }

  if (riskIndicator === 'suspicious') {
    return {
      en: `The message contains multiple warning signs that deserve additional verification.`,
      hi: `इस संदेश में कई चेतावनी संकेत हैं जिनकी अतिरिक्त पुष्टि करना उचित है।`,
    }
  }

  if (redFlags.length > 0) {
    return {
      en: `The message contains some warning signs, but the current rule set does not classify it as suspicious.`,
      hi: `इस संदेश में कुछ चेतावनी संकेत हैं, लेकिन वर्तमान नियम इसे संदिग्ध के रूप में वर्गीकृत नहीं करते।`,
    }
  }

  return {
    en: `No configured warning pattern was detected in this message. This does not mean the message is safe, legitimate, or verified.`,
    hi: RESULT_TRANSLATIONS.lowConcernExplanation,
  }
}

function buildSafeNextSteps(
  riskIndicator: AnalysisResult['riskIndicator'],
): AnalysisResult['safeNextSteps'] {
  if (riskIndicator === 'high-risk-indicators') {
    return {
      en: [
        'Do not send money or sensitive credentials based only on this message.',
        'Verify the sender through an official channel you find independently.',
        'Do not click suspicious links or download unexpected files.',
      ],
      hi: [
        'इस संदेश के आधार पर पैसे या संवेदनशील जानकारी साझा न करें।',
        'प्रेषक और दावे की स्वतंत्र आधिकारिक स्रोत से पुष्टि करें।',
        'संदिग्ध लिंक पर क्लिक न करें और अनपेक्षित फ़ाइल डाउनलोड न करें।',
      ],
    }
  }

  if (riskIndicator === 'suspicious') {
    return {
      en: [
        'Verify the sender and claim through an independent official source.',
        'Avoid sending money or sensitive information until verified.',
        'Review the highlighted warning signs before taking action.',
      ],
      hi: [
        RESULT_TRANSLATIONS.safeSteps[0],
        RESULT_TRANSLATIONS.safeSteps[1],
        RESULT_TRANSLATIONS.safeSteps[2],
      ],
    }
  }

  return {
    en: [
      'Verify important claims through an independent official source.',
      'Do not share sensitive credentials through unsolicited messages.',
      'Remember that Low Concern does not mean safe, legitimate, or verified.',
    ],
    hi: [
      'महत्वपूर्ण दावों की स्वतंत्र आधिकारिक स्रोत से पुष्टि करें।',
      'सत्यापन होने तक पैसे या संवेदनशील जानकारी साझा न करें।',
      'कार्रवाई करने से पहले हाइलाइट किए गए चेतावनी संकेतों की समीक्षा करें।',
    ],
  }
}

export function analyzeMessage(text: string): AnalysisResult {
  const redFlags = detectRedFlags(text)
  const urlAnalysis = analyzeUrls(text)
  const entities = detectEntities(text)

  if (
    urlAnalysis.suspicious &&
    !redFlags.some((flag) => flag.id === 'suspicious_url_structure')
  ) {
    redFlags.push({
      id: 'suspicious_url_structure',
      name: 'Suspicious URL Structure',
      severity: 'medium',
      explanation: {
        en: 'This URL has a structural warning sign. Verify the destination before clicking or entering information.',
        hi: RESULT_TRANSLATIONS.urlWarningExplanation,
      },
      evidence: urlAnalysis.warnings[0] ?? '',
    })
  }

  const riskIndicator = calculateRisk(redFlags)

  return {
    riskIndicator,
    redFlags,
    explanation: buildExplanation(riskIndicator, redFlags),
    safeNextSteps: buildSafeNextSteps(riskIndicator),
    urlWarnings: urlAnalysis.warnings,
    entitiesRecognized: entities,
  }
}
