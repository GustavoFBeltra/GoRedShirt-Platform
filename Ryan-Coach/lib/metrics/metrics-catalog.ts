export interface MetricDefinition {
  id: string
  name: string
  sport: string
  category: 'speed' | 'strength' | 'agility' | 'endurance' | 'skill' | 'body_composition'
  unit: string
  data_type: 'number' | 'time' | 'percentage' | 'count'
  higher_is_better: boolean
  description: string
  instructions?: string
  elite_benchmarks?: {
    male?: { excellent: number; good: number; average: number }
    female?: { excellent: number; good: number; average: number }
  }
}

// Comprehensive metrics catalog for GoRedShirt platform
export const METRICS_CATALOG: MetricDefinition[] = [
  // Universal Athletic Metrics
  {
    id: 'forty_yard_dash',
    name: '40-Yard Dash',
    sport: 'universal',
    category: 'speed',
    unit: 'seconds',
    data_type: 'time',
    higher_is_better: false,
    description: 'Sprint 40 yards as fast as possible',
    instructions: 'Start from a 3-point stance, run 40 yards in a straight line',
    elite_benchmarks: {
      male: { excellent: 4.4, good: 4.6, average: 4.8 },
      female: { excellent: 4.8, good: 5.0, average: 5.2 }
    }
  },
  {
    id: 'vertical_jump',
    name: 'Vertical Jump',
    sport: 'universal',
    category: 'strength',
    unit: 'inches',
    data_type: 'number',
    higher_is_better: true,
    description: 'Maximum height jumped from standing position',
    instructions: 'Stand with feet shoulder-width apart, jump as high as possible',
    elite_benchmarks: {
      male: { excellent: 38, good: 34, average: 30 },
      female: { excellent: 30, good: 26, average: 22 }
    }
  },
  {
    id: 'broad_jump',
    name: 'Standing Broad Jump',
    sport: 'universal',
    category: 'strength',
    unit: 'inches',
    data_type: 'number',
    higher_is_better: true,
    description: 'Maximum horizontal distance jumped from standing position',
    instructions: 'Stand with toes at starting line, jump forward as far as possible',
    elite_benchmarks: {
      male: { excellent: 132, good: 120, average: 108 },
      female: { excellent: 108, good: 96, average: 84 }
    }
  },
  {
    id: 'three_cone_drill',
    name: '3-Cone Drill',
    sport: 'universal',
    category: 'agility',
    unit: 'seconds',
    data_type: 'time',
    higher_is_better: false,
    description: 'Agility drill around three cones in L-shape',
    instructions: 'Sprint to first cone (5 yards), touch and return, sprint to second cone (10 yards), weave around cones',
    elite_benchmarks: {
      male: { excellent: 6.8, good: 7.1, average: 7.4 },
      female: { excellent: 7.2, good: 7.5, average: 7.8 }
    }
  },
  {
    id: 'twenty_yard_shuttle',
    name: '20-Yard Shuttle',
    sport: 'universal',
    category: 'agility',
    unit: 'seconds',
    data_type: 'time',
    higher_is_better: false,
    description: 'Run 5 yards in one direction, 10 yards back, 5 yards to finish',
    instructions: 'Start at middle line, sprint 5 yards right, touch line, sprint 10 yards left, touch line, sprint 5 yards right to finish'
  },
  {
    id: 'bench_press_reps',
    name: 'Bench Press (225 lbs)',
    sport: 'universal',
    category: 'strength',
    unit: 'reps',
    data_type: 'count',
    higher_is_better: true,
    description: 'Maximum repetitions at 225 pounds',
    instructions: 'Bench press 225 lbs for as many repetitions as possible with proper form',
    elite_benchmarks: {
      male: { excellent: 25, good: 20, average: 15 },
      female: { excellent: 15, good: 10, average: 5 }
    }
  },
  {
    id: 'bench_press_max',
    name: 'Bench Press (1RM)',
    sport: 'universal',
    category: 'strength',
    unit: 'lbs',
    data_type: 'number',
    higher_is_better: true,
    description: 'One repetition maximum bench press',
    instructions: 'Maximum weight you can bench press for one repetition with proper form'
  },

  // Football-Specific Metrics
  {
    id: 'football_passing_yards',
    name: 'Passing Yards',
    sport: 'football',
    category: 'skill',
    unit: 'yards',
    data_type: 'number',
    higher_is_better: true,
    description: 'Total passing yards in game or session'
  },
  {
    id: 'football_completion_percentage',
    name: 'Completion Percentage',
    sport: 'football',
    category: 'skill',
    unit: '%',
    data_type: 'percentage',
    higher_is_better: true,
    description: 'Percentage of completed passes'
  },
  {
    id: 'football_rushing_yards',
    name: 'Rushing Yards',
    sport: 'football',
    category: 'skill',
    unit: 'yards',
    data_type: 'number',
    higher_is_better: true,
    description: 'Total rushing yards in game or session'
  },
  {
    id: 'football_receiving_yards',
    name: 'Receiving Yards',
    sport: 'football',
    category: 'skill',
    unit: 'yards',
    data_type: 'number',
    higher_is_better: true,
    description: 'Total receiving yards in game or session'
  },
  {
    id: 'football_tackles',
    name: 'Tackles',
    sport: 'football',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Total tackles made in game or session'
  },

  // Soccer-Specific Metrics
  {
    id: 'soccer_goals',
    name: 'Goals Scored',
    sport: 'soccer',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Goals scored in game or session'
  },
  {
    id: 'soccer_assists',
    name: 'Assists',
    sport: 'soccer',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Assists made in game or session'
  },
  {
    id: 'soccer_shots_on_target',
    name: 'Shots on Target',
    sport: 'soccer',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Shots that hit the target'
  },
  {
    id: 'soccer_distance_covered',
    name: 'Distance Covered',
    sport: 'soccer',
    category: 'endurance',
    unit: 'km',
    data_type: 'number',
    higher_is_better: true,
    description: 'Total distance covered during game or training'
  },
  {
    id: 'cooper_test',
    name: 'Cooper Test (12-min run)',
    sport: 'soccer',
    category: 'endurance',
    unit: 'meters',
    data_type: 'number',
    higher_is_better: true,
    description: 'Distance covered in 12 minutes of continuous running',
    elite_benchmarks: {
      male: { excellent: 3000, good: 2800, average: 2600 },
      female: { excellent: 2700, good: 2500, average: 2300 }
    }
  },

  // Basketball-Specific Metrics
  {
    id: 'basketball_points',
    name: 'Points Scored',
    sport: 'basketball',
    category: 'skill',
    unit: 'points',
    data_type: 'number',
    higher_is_better: true,
    description: 'Total points scored in game or session'
  },
  {
    id: 'basketball_field_goal_percentage',
    name: 'Field Goal %',
    sport: 'basketball',
    category: 'skill',
    unit: '%',
    data_type: 'percentage',
    higher_is_better: true,
    description: 'Percentage of field goals made'
  },
  {
    id: 'basketball_rebounds',
    name: 'Rebounds',
    sport: 'basketball',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Total rebounds in game or session'
  },
  {
    id: 'basketball_assists',
    name: 'Assists',
    sport: 'basketball',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Assists made in game or session'
  },
  {
    id: 'basketball_steals',
    name: 'Steals',
    sport: 'basketball',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Steals made in game or session'
  },
  {
    id: 'basketball_blocks',
    name: 'Blocks',
    sport: 'basketball',
    category: 'skill',
    unit: 'count',
    data_type: 'count',
    higher_is_better: true,
    description: 'Blocks made in game or session'
  },

  // Body Composition Metrics
  {
    id: 'height',
    name: 'Height',
    sport: 'universal',
    category: 'body_composition',
    unit: 'inches',
    data_type: 'number',
    higher_is_better: false, // Neither higher nor lower is better
    description: 'Athlete height measurement'
  },
  {
    id: 'weight',
    name: 'Weight',
    sport: 'universal',
    category: 'body_composition',
    unit: 'lbs',
    data_type: 'number',
    higher_is_better: false,
    description: 'Athlete weight measurement'
  },
  {
    id: 'body_fat_percentage',
    name: 'Body Fat %',
    sport: 'universal',
    category: 'body_composition',
    unit: '%',
    data_type: 'percentage',
    higher_is_better: false,
    description: 'Body fat percentage',
    elite_benchmarks: {
      male: { excellent: 8, good: 12, average: 16 },
      female: { excellent: 15, good: 18, average: 22 }
    }
  }
]

// Helper functions
export const getMetricsByCategory = (category: MetricDefinition['category']) => {
  return METRICS_CATALOG.filter(metric => metric.category === category)
}

export const getMetricsBySport = (sport: string) => {
  return METRICS_CATALOG.filter(metric => metric.sport === sport || metric.sport === 'universal')
}

export const getMetricById = (id: string) => {
  return METRICS_CATALOG.find(metric => metric.id === id)
}

export const getPerformanceRating = (
  metricId: string, 
  value: number, 
  gender: 'male' | 'female' = 'male'
): 'excellent' | 'good' | 'average' | 'below_average' => {
  const metric = getMetricById(metricId)
  if (!metric?.elite_benchmarks?.[gender]) return 'average'
  
  const benchmarks = metric.elite_benchmarks[gender]
  
  if (metric.higher_is_better) {
    if (value >= benchmarks.excellent) return 'excellent'
    if (value >= benchmarks.good) return 'good'
    if (value >= benchmarks.average) return 'average'
    return 'below_average'
  } else {
    // Lower is better (time-based metrics)
    if (value <= benchmarks.excellent) return 'excellent'
    if (value <= benchmarks.good) return 'good'
    if (value <= benchmarks.average) return 'average'
    return 'below_average'
  }
}

export const getPerformanceScore = (
  metricId: string, 
  value: number, 
  gender: 'male' | 'female' = 'male'
): number => {
  const metric = getMetricById(metricId)
  if (!metric?.elite_benchmarks?.[gender] || !value) return 0
  
  const benchmarks = metric.elite_benchmarks[gender]
  
  if (metric.higher_is_better) {
    if (value >= benchmarks.excellent) return 100
    if (value >= benchmarks.good) return 80
    if (value >= benchmarks.average) return 60
    return Math.min(100, (value / benchmarks.average) * 60)
  } else {
    // Lower is better (time-based metrics)
    if (value <= benchmarks.excellent) return 100
    if (value <= benchmarks.good) return 80
    if (value <= benchmarks.average) return 60
    return Math.max(40, 100 - ((value - benchmarks.average) / benchmarks.average) * 100)
  }
}