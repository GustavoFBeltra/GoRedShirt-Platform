'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Activity,
  Trophy,
  TrendingUp,
  Timer,
  Target,
  Zap,
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  Flag,
  Footprints,
  Heart
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CombineMetrics {
  id: string
  sport: 'football' | 'soccer' | 'basketball'
  test_date: string
  forty_yard_dash?: number
  twenty_yard_shuttle?: number
  three_cone_drill?: number
  vertical_jump?: number
  broad_jump?: number
  bench_press_reps?: number
  bench_press_max?: number
  squat_max?: number
  mile_time?: string
  height_inches?: number
  weight_lbs?: number
  body_fat_percentage?: number
}

interface SportPerformance {
  id: string
  sport: 'football' | 'soccer' | 'basketball'
  session_date: string
  // Football
  passing_yards?: number
  passing_completions?: number
  passing_attempts?: number
  rushing_yards?: number
  receiving_yards?: number
  tackles?: number
  // Soccer
  goals_scored?: number
  assists?: number
  shots_on_target?: number
  distance_covered_km?: number
  // Basketball
  points_scored?: number
  field_goals_made?: number
  field_goals_attempted?: number
  rebounds_offensive?: number
  rebounds_defensive?: number
  assists_basketball?: number
  steals?: number
  blocks?: number
}

interface PerformanceGoal {
  id: string
  sport: string
  metric_name: string
  current_value: number
  target_value: number
  target_date: string
  achieved: boolean
}

export default function SportsPerformanceTracker() {
  const [selectedSport, setSelectedSport] = useState<'football' | 'soccer' | 'basketball'>('football')
  const [combineMetrics, setCombineMetrics] = useState<CombineMetrics[]>([])
  const [sportPerformance, setSportPerformance] = useState<SportPerformance[]>([])
  const [goals, setGoals] = useState<PerformanceGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'season'>('month')

  // Mock historical data for charts
  const historicalCombineData = [
    { date: 'Jan', fortyTime: 4.65, verticalJump: 33, benchPress: 18, broadJump: 118 },
    { date: 'Feb', fortyTime: 4.58, verticalJump: 34, benchPress: 20, broadJump: 121 },
    { date: 'Mar', fortyTime: 4.55, verticalJump: 35, benchPress: 21, broadJump: 123 },
    { date: 'Apr', fortyTime: 4.52, verticalJump: 35.5, benchPress: 22, broadJump: 124 }
  ]

  const getPerformanceScore = (metric: string, value: number, sport: string) => {
    const benchmarks = eliteBenchmarks[sport as keyof typeof eliteBenchmarks]
    const benchmark = benchmarks[metric as keyof typeof benchmarks]
    if (!benchmark || !value) return 0
    
    if (metric === 'forty_yard_dash' || metric === 'three_cone_drill' || metric === 'mile_time') {
      // Lower is better for time-based metrics
      if (value <= benchmark.excellent) return 100
      if (value <= benchmark.good) return 80
      if (value <= benchmark.average) return 60
      return Math.max(40, 100 - ((value - benchmark.average) / benchmark.average) * 100)
    } else {
      // Higher is better for other metrics
      if (value >= benchmark.excellent) return 100
      if (value >= benchmark.good) return 80
      if (value >= benchmark.average) return 60
      return Math.min(100, (value / benchmark.average) * 60)
    }
  }

  const latestCombine = combineMetrics[0]
  const latestPerformance = sportPerformance[0]

  const athleticProfileData = [
    { metric: 'Speed', value: getPerformanceScore('forty_yard_dash', latestCombine?.forty_yard_dash || 0, selectedSport), fullMark: 100 },
    { metric: 'Power', value: getPerformanceScore('vertical_jump', latestCombine?.vertical_jump || 0, selectedSport), fullMark: 100 },
    { metric: 'Strength', value: getPerformanceScore('bench_press_reps', latestCombine?.bench_press_reps || 0, selectedSport), fullMark: 100 },
    { metric: 'Explosiveness', value: getPerformanceScore('broad_jump', latestCombine?.broad_jump || 0, selectedSport), fullMark: 100 },
    { metric: 'Agility', value: getPerformanceScore('three_cone_drill', latestCombine?.three_cone_drill || 0, selectedSport), fullMark: 100 }
  ]

  const sportSpecificTrendData = selectedSport === 'football' ? [
    { month: 'Jan', passingYards: 2100, rushingYards: 280, tackles: 58 },
    { month: 'Feb', passingYards: 2350, rushingYards: 310, tackles: 64 },
    { month: 'Mar', passingYards: 2600, rushingYards: 285, tackles: 71 },
    { month: 'Apr', passingYards: 2800, rushingYards: 325, tackles: 78 }
  ] : selectedSport === 'soccer' ? [
    { month: 'Jan', goals: 8, assists: 5, distance: 10.2 },
    { month: 'Feb', goals: 12, assists: 7, distance: 10.8 },
    { month: 'Mar', goals: 15, assists: 9, distance: 11.1 },
    { month: 'Apr', goals: 18, assists: 12, distance: 11.4 }
  ] : [
    { month: 'Jan', points: 18.5, rebounds: 8.2, assists: 5.1 },
    { month: 'Feb', points: 20.3, rebounds: 8.8, assists: 5.7 },
    { month: 'Mar', points: 22.1, rebounds: 9.2, assists: 6.2 },
    { month: 'Apr', points: 24.0, rebounds: 9.5, assists: 6.8 }
  ]

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']

  // Elite benchmarks for each sport
  const eliteBenchmarks = {
    football: {
      forty_yard_dash: { excellent: 4.4, good: 4.6, average: 4.8 },
      vertical_jump: { excellent: 38, good: 34, average: 30 },
      bench_press_reps: { excellent: 25, good: 20, average: 15 },
      broad_jump: { excellent: 132, good: 120, average: 108 }
    },
    soccer: {
      mile_time: { excellent: 5.5, good: 6.0, average: 6.5 },
      forty_yard_dash: { excellent: 4.5, good: 4.7, average: 4.9 },
      vertical_jump: { excellent: 32, good: 28, average: 24 },
      beep_test: { excellent: 13, good: 11, average: 9 }
    },
    basketball: {
      vertical_jump: { excellent: 36, good: 32, average: 28 },
      forty_yard_dash: { excellent: 4.5, good: 4.7, average: 4.9 },
      bench_press_reps: { excellent: 18, good: 14, average: 10 },
      three_cone_drill: { excellent: 6.8, good: 7.1, average: 7.4 }
    }
  }

  useEffect(() => {
    fetchPerformanceData()
  }, [selectedSport, selectedPeriod])

  const fetchPerformanceData = async () => {
    setLoading(true)
    // In production, this would fetch from API
    // Simulating with mock data for now
    setTimeout(() => {
      setCombineMetrics([
        {
          id: '1',
          sport: selectedSport,
          test_date: new Date().toISOString(),
          forty_yard_dash: 4.52,
          vertical_jump: 35.5,
          bench_press_reps: 22,
          broad_jump: 124,
          three_cone_drill: 7.02,
          height_inches: 73,
          weight_lbs: 215,
          body_fat_percentage: 12.5
        }
      ])
      
      setSportPerformance([
        {
          id: '1',
          sport: selectedSport,
          session_date: new Date().toISOString(),
          // Mock data based on sport
          ...(selectedSport === 'football' ? {
            passing_yards: 285,
            passing_completions: 22,
            passing_attempts: 32,
            rushing_yards: 45,
            receiving_yards: 0,
            tackles: 7
          } : selectedSport === 'soccer' ? {
            goals_scored: 2,
            assists: 1,
            shots_on_target: 5,
            distance_covered_km: 11.2
          } : {
            points_scored: 24,
            field_goals_made: 9,
            field_goals_attempted: 15,
            rebounds_offensive: 3,
            rebounds_defensive: 7,
            assists_basketball: 6,
            steals: 2,
            blocks: 1
          })
        }
      ])

      setGoals([
        {
          id: '1',
          sport: selectedSport,
          metric_name: 'forty_yard_dash',
          current_value: 4.52,
          target_value: 4.40,
          target_date: '2024-12-31',
          achieved: false
        },
        {
          id: '2',
          sport: selectedSport,
          metric_name: 'vertical_jump',
          current_value: 35.5,
          target_value: 38,
          target_date: '2024-12-31',
          achieved: false
        }
      ])
      
      setLoading(false)
    }, 1000)
  }

  const getPerformanceRating = (metric: string, value: number, sport: string) => {
    const benchmarks = eliteBenchmarks[sport as keyof typeof eliteBenchmarks]
    const benchmark = benchmarks[metric as keyof typeof benchmarks]
    if (!benchmark) return 'average'
    
    if (metric === 'forty_yard_dash' || metric === 'three_cone_drill' || metric === 'mile_time') {
      // Lower is better for time-based metrics
      if (value <= benchmark.excellent) return 'excellent'
      if (value <= benchmark.good) return 'good'
      return 'average'
    } else {
      // Higher is better for other metrics
      if (value >= benchmark.excellent) return 'excellent'
      if (value >= benchmark.good) return 'good'
      return 'average'
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }


  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Sports Performance</h2>
          <p className="text-muted-foreground">Track your athletic performance and combine metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="season">This Season</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSport} onValueChange={(value: any) => setSelectedSport(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">🏈 Football</SelectItem>
              <SelectItem value="soccer">⚽ Soccer</SelectItem>
              <SelectItem value="basketball">🏀 Basketball</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>

      {/* Combine Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">40-Yard Dash</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCombine?.forty_yard_dash || '--'}s</div>
            {latestCombine?.forty_yard_dash && (
              <Badge className={`mt-2 ${getRatingColor(getPerformanceRating('forty_yard_dash', latestCombine?.forty_yard_dash || 0, selectedSport))}`}>
                {getPerformanceRating('forty_yard_dash', latestCombine?.forty_yard_dash || 0, selectedSport)}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vertical Jump</CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCombine?.vertical_jump || '--'}"</div>
            {latestCombine?.vertical_jump && (
              <Badge className={`mt-2 ${getRatingColor(getPerformanceRating('vertical_jump', latestCombine?.vertical_jump || 0, selectedSport))}`}>
                {getPerformanceRating('vertical_jump', latestCombine?.vertical_jump || 0, selectedSport)}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bench Press</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCombine?.bench_press_reps || '--'} reps</div>
            {latestCombine?.bench_press_reps && (
              <Badge className={`mt-2 ${getRatingColor(getPerformanceRating('bench_press_reps', latestCombine?.bench_press_reps || 0, selectedSport))}`}>
                {getPerformanceRating('bench_press_reps', latestCombine?.bench_press_reps || 0, selectedSport)}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Broad Jump</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCombine?.broad_jump || '--'}"</div>
            {latestCombine?.broad_jump && (
              <Badge className={`mt-2 ${getRatingColor(getPerformanceRating('broad_jump', latestCombine?.broad_jump || 0, selectedSport))}`}>
                {getPerformanceRating('broad_jump', latestCombine?.broad_jump || 0, selectedSport)}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Game Performance</TabsTrigger>
          <TabsTrigger value="combine">Combine Metrics</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        {/* Game Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Game Statistics</CardTitle>
              <CardDescription>
                Your performance metrics from recent games and training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSport === 'football' && latestPerformance && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">PASSING</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Yards</span>
                        <span className="font-bold">{latestPerformance.passing_yards}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion %</span>
                        <span className="font-bold">
                          {latestPerformance.passing_completions && latestPerformance.passing_attempts
                            ? `${((latestPerformance.passing_completions / latestPerformance.passing_attempts) * 100).toFixed(1)}%`
                            : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Attempts</span>
                        <span className="font-bold">{latestPerformance.passing_attempts}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">RUSHING</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Yards</span>
                        <span className="font-bold">{latestPerformance.rushing_yards}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">YPC</span>
                        <span className="font-bold">4.5</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">DEFENSE</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tackles</span>
                        <span className="font-bold">{latestPerformance.tackles}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSport === 'soccer' && latestPerformance && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">SCORING</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Goals</span>
                        <span className="font-bold">{latestPerformance.goals_scored}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Assists</span>
                        <span className="font-bold">{latestPerformance.assists}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Shots on Target</span>
                        <span className="font-bold">{latestPerformance.shots_on_target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">FITNESS</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Distance Covered</span>
                        <span className="font-bold">{latestPerformance.distance_covered_km} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSport === 'basketball' && latestPerformance && (
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">SCORING</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Points</span>
                        <span className="font-bold">{latestPerformance.points_scored}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">FG%</span>
                        <span className="font-bold">
                          {latestPerformance.field_goals_made && latestPerformance.field_goals_attempted
                            ? `${((latestPerformance.field_goals_made / latestPerformance.field_goals_attempted) * 100).toFixed(1)}%`
                            : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">REBOUNDS</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Offensive</span>
                        <span className="font-bold">{latestPerformance.rebounds_offensive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Defensive</span>
                        <span className="font-bold">{latestPerformance.rebounds_defensive}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">PLAYMAKING</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Assists</span>
                        <span className="font-bold">{latestPerformance.assists_basketball}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Steals</span>
                        <span className="font-bold">{latestPerformance.steals}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">DEFENSE</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Blocks</span>
                        <span className="font-bold">{latestPerformance.blocks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sport-Specific Performance Chart */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Performance Trends</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sportSpecificTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedSport === 'football' && (
                        <>
                          <Line type="monotone" dataKey="passingYards" stroke="#8884d8" name="Passing Yards" strokeWidth={2} />
                          <Line type="monotone" dataKey="rushingYards" stroke="#82ca9d" name="Rushing Yards" strokeWidth={2} />
                          <Line type="monotone" dataKey="tackles" stroke="#ffc658" name="Tackles" strokeWidth={2} />
                        </>
                      )}
                      {selectedSport === 'soccer' && (
                        <>
                          <Line type="monotone" dataKey="goals" stroke="#8884d8" name="Goals" strokeWidth={2} />
                          <Line type="monotone" dataKey="assists" stroke="#82ca9d" name="Assists" strokeWidth={2} />
                          <Line type="monotone" dataKey="distance" stroke="#ffc658" name="Distance (km)" strokeWidth={2} />
                        </>
                      )}
                      {selectedSport === 'basketball' && (
                        <>
                          <Line type="monotone" dataKey="points" stroke="#8884d8" name="Points" strokeWidth={2} />
                          <Line type="monotone" dataKey="rebounds" stroke="#82ca9d" name="Rebounds" strokeWidth={2} />
                          <Line type="monotone" dataKey="assists" stroke="#ffc658" name="Assists" strokeWidth={2} />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combine Metrics Tab */}
        <TabsContent value="combine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Athletic Testing Results</CardTitle>
              <CardDescription>
                Professional combine-style athletic performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestCombine && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Speed & Agility</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">40-Yard Dash</span>
                          <div className="text-right">
                            <div className="font-bold">{latestCombine?.forty_yard_dash || 0}s</div>
                            <Badge variant="outline" className="text-xs">
                              {getPerformanceRating('forty_yard_dash', latestCombine?.forty_yard_dash || 0, selectedSport)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">3-Cone Drill</span>
                          <div className="text-right">
                            <div className="font-bold">{latestCombine?.three_cone_drill || 0}s</div>
                            <Badge variant="outline" className="text-xs">Good</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Power & Strength</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Vertical Jump</span>
                          <div className="text-right">
                            <div className="font-bold">{latestCombine?.vertical_jump || 0}"</div>
                            <Badge variant="outline" className="text-xs">
                              {getPerformanceRating('vertical_jump', latestCombine?.vertical_jump || 0, selectedSport)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">Bench Press (225 lbs)</span>
                          <div className="text-right">
                            <div className="font-bold">{latestCombine?.bench_press_reps || 0} reps</div>
                            <Badge variant="outline" className="text-xs">
                              {getPerformanceRating('bench_press_reps', latestCombine?.bench_press_reps || 0, selectedSport)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Body Composition</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Height</span>
                        <div className="font-bold text-lg">{latestCombine?.height_inches || 0}"</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <div className="font-bold text-lg">{latestCombine?.weight_lbs || 0} lbs</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Body Fat %</span>
                        <div className="font-bold text-lg">{latestCombine?.body_fat_percentage || 0}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Athletic Profile Radar Chart */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Athletic Profile</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={athleticProfileData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <Radar
                        name="Performance Score"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Benchmark Comparison */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Elite Benchmark Comparison</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(eliteBenchmarks[selectedSport]).map(([metric, benchmarks]) => {
                    const currentValue = latestCombine?.[metric as keyof CombineMetrics] as number
                    if (!currentValue) return null
                    
                    const percentOfElite = metric.includes('time') || metric.includes('drill') 
                      ? (benchmarks.excellent / currentValue) * 100
                      : (currentValue / benchmarks.excellent) * 100
                    
                    return (
                      <div key={metric} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">
                            {metric.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {Math.round(percentOfElite)}% of elite
                          </span>
                        </div>
                        <Progress value={Math.min(percentOfElite, 100)} className="h-3 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current: {currentValue}{metric.includes('time') || metric.includes('drill') ? 's' : metric.includes('jump') ? '"' : ' reps'}</span>
                          <span>Elite: {benchmarks.excellent}{metric.includes('time') || metric.includes('drill') ? 's' : metric.includes('jump') ? '"' : ' reps'}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Track your improvements over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Trends Chart */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Combine Metrics Progress</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="h-64">
                    <h5 className="text-sm font-medium mb-2">Speed & Agility</h5>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalCombineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="fortyTime" stroke="#8884d8" name="40-Yard Dash (s)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-64">
                    <h5 className="text-sm font-medium mb-2">Power & Strength</h5>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalCombineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="verticalJump" fill="#82ca9d" name="Vertical Jump (in)" />
                        <Bar dataKey="benchPress" fill="#ffc658" name="Bench Press (reps)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{goal.metric_name.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        Target: {goal.target_value} by {format(parseISO(goal.target_date), 'MMM dd')}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current_value / goal.target_value) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Current: {goal.current_value}</span>
                      <span className={goal.achieved ? 'text-green-600' : 'text-muted-foreground'}>
                        {goal.achieved ? '✓ Achieved' : `${((goal.current_value / goal.target_value) * 100).toFixed(0)}% Complete`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>
                Set and track your athletic performance targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mb-4">
                <Target className="h-4 w-4 mr-2" />
                Set New Goal
              </Button>
              
              {/* Goal Progress Visualization */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Goal Achievement Overview</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Achieved', value: goals.filter(g => g.achieved).length },
                          { name: 'In Progress', value: goals.filter(g => !g.achieved).length }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <div className="font-medium capitalize">
                          {goal.metric_name.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Target: {goal.target_value} by {format(parseISO(goal.target_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{goal.current_value}</div>
                        <Badge variant={goal.achieved ? 'default' : 'outline'}>
                          {goal.achieved ? 'Achieved' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                    {/* Individual goal progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (goal.current_value / goal.target_value) * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}