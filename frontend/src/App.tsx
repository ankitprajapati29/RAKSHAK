import { useEffect, useRef, useState } from 'react'
import { analyzeMessage } from './services/detector'
import { extractTextFromImage } from './services/input/ocr'
import {
  createVoiceRecognition,
  isVoiceInputSupported,
  type VoiceRecognitionController,
} from './services/input/voice'
import type { AnalysisInput, AnalysisResult, Language } from './types'
import {
  clearAnalysisHistory,
  getAnalysisHistory,
  saveAnalysisHistoryItem,
  type AnalysisHistoryItem,
} from './services/storage/history'
import './App.css'
import { RESULT_TRANSLATIONS } from './data/translations'

const flagNamesHi: Record<string, string> = {
  urgency_pressure: 'कृत्रिम जल्दबाजी',
  guaranteed_returns: 'गारंटीड रिटर्न का दावा',
  unrealistic_income: 'अवास्तविक आय का दावा',
  off_platform_communication: 'प्राइवेट चैनल पर जाने का अनुरोध',
  investment_solicitation: 'निवेश या भुगतान का अनुरोध',
  credential_request: 'संवेदनशील जानकारी का अनुरोध',
  impersonation_authority: 'प्राधिकरण का प्रतिरूपण',
  suspicious_url_structure: 'संदिग्ध URL संरचना',
  kyc_account_threat: 'KYC/खाता बंद करने की धमकी',
  advance_fee_request: 'अग्रिम शुल्क का अनुरोध',
  fake_reward_prize: 'फर्जी इनाम/पुरस्कार का दावा',
  crypto_trading_solicitation: 'क्रिप्टो/ट्रेडिंग का अनुरोध',
  secrecy_pressure: 'गोपनीयता का दबाव',
}

const severityHi: Record<string, string> = {
  low: 'कम',
  medium: 'मध्यम',
  high: 'उच्च',
  critical: 'गंभीर',
}

function App() {
  const [message, setMessage] = useState('')
  const [inputType, setInputType] = useState<AnalysisInput['inputType']>('text')
  const [language, setLanguage] = useState<Language>('en')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([])

  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const [ocrError, setOcrError] = useState('')

  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const voiceControllerRef =
    useRef<VoiceRecognitionController | null>(null)

  useEffect(() => {
    setHistory(getAnalysisHistory())
  }, [])

  const handleAnalyze = () => {
    if (!message.trim()) {
      setResult(null)
      return
    }

    const analysisResult = analyzeMessage(message)
    setResult(analysisResult)

    const input: AnalysisInput = {
      text: message,
      inputType,
      language,
      timestamp: Date.now(),
    }

    saveAnalysisHistoryItem({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      input,
      result: analysisResult,
    })

    setHistory(getAnalysisHistory())
  }

  const handleHistorySelect = (item: AnalysisHistoryItem) => {
    setMessage(item.input.text)
    setLanguage(item.input.language)
    setResult(item.result)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleClearHistory = () => {
    clearAnalysisHistory()
    setHistory([])
  }

  const getHistoryRiskLabel = (
    risk: AnalysisResult['riskIndicator'],
  ): string => {
    if (risk === 'high-risk-indicators') {
      return language === 'hi' ? 'उच्च जोखिम संकेतक' : 'High Risk Indicators'
    }

    if (risk === 'suspicious') {
      return language === 'hi' ? 'संदिग्ध' : 'Suspicious'
    }

    return language === 'hi' ? 'कम चिंता' : 'Low Concern'
  }

  const getHistoryRiskClass = (
    risk: AnalysisResult['riskIndicator'],
  ): string => {
    if (risk === 'high-risk-indicators') return 'risk-high'
    if (risk === 'suspicious') return 'risk-medium'
    return 'risk-low'
  }

  const getHistoryInputTypeLabel = (inputType: AnalysisInput['inputType']): string => {
    if (inputType === 'image') return language === 'hi' ? 'OCR' : 'OCR'
    if (inputType === 'voice') return language === 'hi' ? 'आवाज़' : 'Voice'
    return language === 'hi' ? 'टेक्स्ट' : 'Text'
  }

  const formatHistoryDate = (timestamp: number): string => {
    try {
      return new Date(timestamp).toLocaleString(
        language === 'hi' ? 'hi-IN' : 'en-IN',
        {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      )
    } catch {
      return ''
    }
  }

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setOcrError('')
    setResult(null)
    setIsOcrProcessing(true)

    try {
      const ocrResult = await extractTextFromImage(file)

      if (!ocrResult.text.trim()) {
        setOcrError(
          language === 'hi'
            ? 'इमेज से कोई टेक्स्ट नहीं मिला। साफ इमेज के साथ फिर प्रयास करें।'
            : 'No readable text was found in the image. Try a clearer image.',
        )
        return
      }

      setMessage(ocrResult.text)
      setInputType('image')
    } catch (error) {
      console.error('OCR failed:', error)

      setOcrError(
        language === 'hi'
          ? 'इमेज पढ़ने में समस्या हुई। कृपया दोबारा प्रयास करें।'
          : 'Could not read the image. Please try again.',
      )
    } finally {
      setIsOcrProcessing(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleVoiceToggle = () => {
    setVoiceError('')

    if (isListening) {
      voiceControllerRef.current?.stop()
      return
    }

    if (!isVoiceInputSupported()) {
      setVoiceError(
        language === 'hi'
          ? 'इस ब्राउज़र में Voice Input उपलब्ध नहीं है। कृपया टेक्स्ट इनपुट का उपयोग करें।'
          : 'Voice input is not supported in this browser. Please use text input instead.',
      )
      return
    }

    const controller = createVoiceRecognition(
      language,
      (voiceResult) => {
        setMessage(voiceResult.text)
        setInputType('voice')
        setResult(null)
      },
      (errorMessage) => {
        console.error(errorMessage)

        setVoiceError(
          language === 'hi'
            ? 'Voice Input में समस्या हुई। कृपया दोबारा प्रयास करें।'
            : 'Voice input failed. Please try again.',
        )

        setIsListening(false)
      },
      () => {
        setIsListening(false)
        voiceControllerRef.current = null
      },
    )

    voiceControllerRef.current = controller
    setIsListening(true)
    controller.start()
  }

  const getRiskLabel = (
    risk: AnalysisResult['riskIndicator'],
  ): string => {
    if (risk === 'high-risk-indicators') {
      return language === 'hi' ? 'उच्च जोखिम संकेतक' : 'High Risk Indicators'
    }

    if (risk === 'suspicious') {
      return language === 'hi' ? 'संदिग्ध' : 'Suspicious'
    }

    return language === 'hi' ? 'कम चिंता' : 'Low Concern'
  }

  const getRiskClass = (
    risk: AnalysisResult['riskIndicator'],
  ): string => {
    if (risk === 'high-risk-indicators') return 'risk-high'
    if (risk === 'suspicious') return 'risk-medium'
    return 'risk-low'
  }

  const getFlagName = (id: string, name: string): string => {
    if (language === 'hi') {
      return flagNamesHi[id] ?? name
    }

    return name
  }

  const getSeverity = (severity: string): string => {
    if (language === 'hi') {
      return severityHi[severity] ?? severity
    }

    return severity
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="brand">RAKSHAK</p>

          <h1>
            {language === 'hi'
              ? 'निवेश धोखाधड़ी की पहचान'
              : 'Investment Scam Detection'}
          </h1>

          <p className="subtitle">
            {language === 'hi'
              ? 'संदिग्ध निवेश संदेशों की जांच करें और कार्रवाई करने से पहले चेतावनी संकेत समझें।'
              : 'Analyze suspicious investment messages before taking action.'}
          </p>
        </div>

        <div className="language-switcher">
          <button
            type="button"
            className={language === 'en' ? 'active' : ''}
            onClick={() => setLanguage('en')}
          >
            English
          </button>

          <button
            type="button"
            className={language === 'hi' ? 'active' : ''}
            onClick={() => setLanguage('hi')}
          >
            हिन्दी
          </button>
        </div>
      </header>

      <section className="analysis-card">
        <label htmlFor="message">
          {language === 'hi'
            ? 'संदिग्ध संदेश यहाँ पेस्ट करें'
            : 'Paste the suspicious message'}
        </label>

        <textarea
          id="message"
          value={message}
          onChange={(event) => { setMessage(event.target.value); setInputType('text') }}
          placeholder={
            language === 'hi'
              ? 'उदाहरण: आज ही निवेश करें और गारंटीड रिटर्न पाएं...'
              : 'Example: Invest today and get guaranteed returns...'
          }
          rows={8}
        />

        <div className="input-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            hidden
          />

          <button
            type="button"
            className="analyze-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isOcrProcessing || isListening}
          >
            {isOcrProcessing
              ? language === 'hi'
                ? 'इमेज पढ़ी जा रही है...'
                : 'Reading image...'
              : language === 'hi'
                ? '📷 इमेज से टेक्स्ट पढ़ें'
                : 'Read Text from Image'}
          </button>

          <button
            type="button"
            className="analyze-button"
            onClick={handleVoiceToggle}
            disabled={isOcrProcessing}
          >
            {isListening
              ? language === 'hi'
                ? '⏹️ Voice रोकें'
                : 'â¹ï¸ Stop Voice'
              : language === 'hi'
                ? '🎙️ Voice से बोलें'
                : 'Speak by Voice'}
          </button>
        </div>

        {ocrError && (
          <p className="error-message" role="alert">
            {ocrError}
          </p>
        )}

        {voiceError && (
          <p className="error-message" role="alert">
            {voiceError}
          </p>
        )}

        <button
          type="button"
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={!message.trim() || isOcrProcessing || isListening}
        >
          {language === 'hi' ? 'संदेश जांचें' : 'Analyze Message'}
        </button>
      </section>

      {result && (
        <section className="result-card">
          <div
            className={`risk-indicator ${getRiskClass(
              result.riskIndicator,
            )}`}
          >
            <span>
              {language === 'hi' ? 'जोखिम संकेतक' : 'Risk Indicator'}
            </span>

            <strong>{getRiskLabel(result.riskIndicator)}</strong>
          </div>

          <div className="result-section">
            <h2>
              {language === 'hi' ? 'व्याख्या' : 'Explanation'}
            </h2>

            <p>
              {language === 'hi'
                ? result.explanation.hi
                : result.explanation.en}
            </p>
          </div>

          {result.redFlags.length > 0 && (
            <div className="result-section">
              <h2>
                {language === 'hi'
                  ? 'चेतावनी संकेत'
                  : 'Warning Signs'}
              </h2>

              <div className="red-flags">
                {result.redFlags.map((flag) => (
                  <article className="red-flag" key={flag.id}>
                    <div className="red-flag-header">
                      <strong>
                        {getFlagName(flag.id, flag.name)}
                      </strong>

                      <span
                        className={`severity severity-${flag.severity}`}
                      >
                        {getSeverity(flag.severity)}
                      </span>
                    </div>

                    <p>
                      {language === 'hi'
                        ? flag.explanation.hi
                        : flag.explanation.en}
                    </p>

                    {flag.evidence && (
                      <blockquote>{flag.evidence}</blockquote>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="result-section">
            <h2>
              {language === 'hi'
                ? 'सुरक्षित अगले कदम'
                : 'Safe Next Steps'}
            </h2>

            <ul className="next-steps">
              {(language === 'hi'
                ? result.safeNextSteps.hi
                : result.safeNextSteps.en
              ).map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          {result.urlWarnings && result.urlWarnings.length > 0 && (
            <div className="result-section">
              <h2>
                {language === 'hi'
                  ? 'URL चेतावनी'
                  : 'URL Warnings'}
              </h2>

              <ul className="next-steps">
                {result.urlWarnings.map((warning) => (
                  <li key={warning}>
                    {language === 'hi'
                      ? RESULT_TRANSLATIONS.urlWarnings[
                          warning as keyof typeof RESULT_TRANSLATIONS.urlWarnings
                        ] ?? warning
                      : warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="result-card">
          <div className="history-header">
            <div>
              <h2>
                {language === 'hi'
                  ? 'हाल की जांच'
                  : 'Recent Analyses'}
              </h2>

              <p className="subtitle">
                {language === 'hi'
                  ? 'पिछली जांच इसी डिवाइस पर स्थानीय रूप से सहेजी गई हैं।'
                  : 'Previous analyses are stored locally on this device.'}
              </p>
            </div>

            <button
              type="button"
              className="analyze-button"
              onClick={handleClearHistory}
            >
              {language === 'hi'
                ? 'इतिहास साफ करें'
                : 'Clear History'}
            </button>
          </div>

          <div className="red-flags">
            {history.map((item) => (
              <article
                className="red-flag"
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleHistorySelect(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleHistorySelect(item)
                  }
                }}
              >
                <div className="red-flag-header">
                  <strong>
                    {item.input.text.length > 100
                      ? `${item.input.text.slice(0, 100)}...`
                      : item.input.text}
                  </strong>

                  <span
                    className={`severity ${getHistoryRiskClass(
                      item.result.riskIndicator,
                    )}`}
                  >
                    {getHistoryRiskLabel(
                      item.result.riskIndicator,
                    )}
                  </span>
                </div>

                <p>
                  {getHistoryInputTypeLabel(item.input.inputType)} · {formatHistoryDate(item.input.timestamp)}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="app-footer">
        <p>
          {language === 'hi'
            ? 'RAKSHAK नियम-आधारित चेतावनी संकेत प्रदान करता है। Low Concern का अर्थ सुरक्षित, वास्तविक या सत्यापित होना नहीं है।'
            : 'RAKSHAK provides rule-based warning indicators. Low Concern does not mean safe, legitimate, or verified.'}
        </p>
      </footer>
    </main>
  )
}

export default App
