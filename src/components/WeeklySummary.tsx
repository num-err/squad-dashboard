'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, Clock } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

export function WeeklySummary() {
  const [summary, setSummary] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/summary')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setSummary(json.data.summary)
      setGeneratedAt(json.data.generatedAt)
    } catch (e) {
      setError('Failed to generate summary. Make sure ANTHROPIC_API_KEY is set.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="font-semibold text-white">Weekly AI Recap</h2>
          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">Claude Haiku</span>
        </div>
        <Button
          onClick={generate}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : summary ? 'Regenerate' : 'Generate Recap'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
      )}

      {!summary && !error && !loading && (
        <div className="py-8 text-center text-slate-500">
          <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-30" />
          <p className="text-sm">Click &ldquo;Generate Recap&rdquo; to get an AI summary of the past 7 days.</p>
        </div>
      )}

      {loading && (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Analyzing squad activity...</p>
        </div>
      )}

      {summary && !loading && (
        <div>
          <div className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{summary}</div>
          {generatedAt && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="h-3 w-3" />
              <span>Generated {new Date(generatedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
