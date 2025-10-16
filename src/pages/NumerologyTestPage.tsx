import { useState } from 'react';
import { calculateNumerologyData } from '@/utils/numerology';
import type { NumerologyData } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function NumerologyTestPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<NumerologyData | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!birthDate) {
      setError('Please enter a birth date');
      return;
    }

    try {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        setError('Invalid date format');
        return;
      }

      const calculatedData = calculateNumerologyData(name.trim(), date);
      setResult(calculatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  const wordCount = name.trim() ? name.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Numerology Calculation Test Page
            </CardTitle>
            <p className="text-purple-300/70 text-sm mt-2">
              Test numerology calculations for names with different word counts
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">
                Full Name {wordCount > 0 && <span className="text-purple-400">({wordCount} word{wordCount !== 1 ? 's' : ''})</span>}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name (e.g., John Michael Peter Smith)"
                className="mt-1 bg-purple-950/30 border-purple-500/30 text-white placeholder:text-purple-400/50"
              />
              {wordCount >= 5 && (
                <p className="text-yellow-400 text-sm mt-1">
                  Warning: 5+ word names may not be fully supported
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-purple-200">
                Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 bg-purple-950/30 border-purple-500/30 text-white"
              />
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Calculate Numbers
            </Button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">
                Calculation Results for: {result.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 text-sm">Birth Day</div>
                    <div className="text-white text-2xl font-bold">{result.birthDay}</div>
                  </div>
                  <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 text-sm">Date Value (Reduced)</div>
                    <div className="text-white text-2xl font-bold">{result.dateValue}</div>
                  </div>
                </div>

                {/* Diamond Values */}
                <div>
                  <h3 className="text-xl text-purple-300 mb-3">Diamond Values</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-950/30 rounded-lg border border-indigo-500/20">
                      <div className="text-indigo-400 text-sm">Upper Value</div>
                      <div className="text-white text-xl font-bold">{result.diamond_upper_value}</div>
                    </div>
                    <div className="p-4 bg-indigo-950/30 rounded-lg border border-indigo-500/20">
                      <div className="text-indigo-400 text-sm">Lower Value</div>
                      <div className="text-white text-xl font-bold">{result.diamond_lower_value.toString()}</div>
                    </div>
                  </div>
                </div>

                {/* Name Values */}
                <div>
                  <h3 className="text-xl text-purple-300 mb-3">Name Values (Each Word)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {result.nameValues.map((value, idx) => (
                      <div key={idx} className="p-3 bg-pink-950/30 rounded-lg border border-pink-500/20">
                        <div className="text-pink-400 text-xs">Word {idx + 1}</div>
                        <div className="text-white text-lg font-bold">{value.toString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mid Name Values */}
                {result.midNameValues.length > 0 && (
                  <div>
                    <h3 className="text-xl text-purple-300 mb-3">Middle Name Values</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {result.midNameValues.map((value, idx) => (
                        <div key={idx} className="p-3 bg-violet-950/30 rounded-lg border border-violet-500/20">
                          <div className="text-violet-400 text-xs">Middle {idx + 1}</div>
                          <div className="text-white text-lg font-bold">{value.toString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diamond Upper Mid */}
                <div>
                  <h3 className="text-xl text-purple-300 mb-3">Diamond Upper Mid</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {result.diamond_upper_mid.map((value, idx) => (
                      <div key={idx} className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20">
                        <div className="text-cyan-400 text-xs">Position {idx + 1}</div>
                        <div className="text-white text-lg font-bold">{value.toString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diamond Lower Mid */}
                <div>
                  <h3 className="text-xl text-purple-300 mb-3">Diamond Lower Mid</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {result.diamond_lower_mid.map((value, idx) => (
                      <div key={idx} className="p-3 bg-teal-950/30 rounded-lg border border-teal-500/20">
                        <div className="text-teal-400 text-xs">Position {idx + 1}</div>
                        <div className="text-white text-lg font-bold">{value.toString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Circle Values */}
                <div>
                  <h3 className="text-xl text-purple-300 mb-3">Circle Values</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                      <div className="text-emerald-400 text-sm">Upper Circle</div>
                      <div className="text-white text-xl font-bold">
                        {result.diamond_upper_circle.map(v => v.toString()).join(', ')}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                      <div className="text-emerald-400 text-sm">Lower Circle</div>
                      <div className="text-white text-xl font-bold">
                        {result.diamond_lower_circle.map(v => v.toString()).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lower Circle Values for Middle Names */}
                {result.diamond_upper_lower_circle.length > 0 && (
                  <div>
                    <h3 className="text-xl text-purple-300 mb-3">Middle Name Circle Values</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-lime-950/30 rounded-lg border border-lime-500/20">
                        <div className="text-lime-400 text-sm">Upper Lower Circle</div>
                        <div className="text-white text-xl font-bold">
                          {result.diamond_upper_lower_circle.map(v => v.toString()).join(', ')}
                        </div>
                      </div>
                      <div className="p-4 bg-lime-950/30 rounded-lg border border-lime-500/20">
                        <div className="text-lime-400 text-sm">Lower Lower Circle</div>
                        <div className="text-white text-xl font-bold">
                          {result.diamond_lower_lower_circle.map(v => v.toString()).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Birthday Interpretation */}
                {result.birthdayInterpretation && (
                  <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                    <h3 className="text-xl text-purple-300 mb-2">Birthday Planet</h3>
                    <div className="text-purple-400 text-lg font-semibold">
                      {result.birthdayInterpretation.planetName}
                    </div>
                    <div className="text-purple-300/80 text-sm mt-2">
                      {result.birthdayInterpretation.description}
                    </div>
                  </div>
                )}

                {/* Compound Numbers */}
                {result.compoundNumberInterpretations && result.compoundNumberInterpretations.length > 0 && (
                  <div>
                    <h3 className="text-xl text-purple-300 mb-3">Compound Number Interpretations</h3>
                    <div className="space-y-3">
                      {result.compoundNumberInterpretations.map((interp, idx) => (
                        <div key={idx} className="p-4 bg-fuchsia-950/30 rounded-lg border border-fuchsia-500/20">
                          <div className="text-fuchsia-400 font-semibold">
                            {interp.number} {interp.caption && `- ${interp.caption}`}
                          </div>
                          <div className="text-fuchsia-300/80 text-sm mt-1">
                            {interp.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
