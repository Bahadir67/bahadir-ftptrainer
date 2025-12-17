import { StrengthExercise, Workout, WeekSummary } from '@/types/workout';

export const FTP_CURRENT = 220;
export const FTP_TARGET = 250;
export const PLAN_START = '2025-12-13';
export const PLAN_END = '2026-03-07';
const STRENGTH_A_EXERCISES: StrengthExercise[] = [
  { name: 'Back Squat', sets: '4x4-6', notes: 'RPE 7-8 (ağır, kontrollü)' },
  { name: 'Romanian Deadlift', sets: '3x6-8', notes: 'RPE 7-8 (hamstring/hip hinge)' },
  { name: 'Bulgarian Split Squat', sets: '2-3x6-8/bacak', notes: 'RPE 7 (stabil, kontrollü)' },
  { name: 'Seated Calf Raise', sets: '4x8-12', notes: 'Soleus odaklı (diz bükülü)' },
  { name: 'Pallof Press', sets: '3x10-12/taraf', notes: 'Anti-rotation, kontrollü' },
  { name: 'Ab Wheel', sets: '3x6-10', notes: 'Anti-extension, form bozulmadan' }
];

const STRENGTH_B_EXERCISES: StrengthExercise[] = [
  { name: 'Hip Thrust', sets: '4x6-10', notes: 'RPE 7-8 (glute dominant)' },
  { name: 'Single Leg Deadlift', sets: '3x8/bacak', notes: 'RPE 7 (denge + posterior chain)' },
  { name: 'Step Ups', sets: '2x8-10/bacak', notes: 'RPE 6-7 (Cuma kalitesini bozmasın)' },
  { name: 'Wide Row Machine', sets: '3x8-12', notes: 'Geniş çekiş, 1 sn sık' },
  { name: 'Barbell Overhead Press', sets: '3x5-8', notes: 'Strict, RPE 6-7 (failure yok)' },
  { name: 'Chest Press', sets: '2x8-12', notes: 'RPE 6-7 (failure yok)' },
  { name: 'Face Pull', sets: '2x12-15', notes: 'Skapula + arka omuz' },
  { name: 'Copenhagen Plank', sets: '3x20-40 sn/taraf', notes: 'Adductor + lateral core' },
  { name: 'Standing Calf Raise', sets: '3x10-15', notes: 'Gastrocnemius (diz düz)' }
];

const STRENGTH_UPPER_LIGHT_EXERCISES: StrengthExercise[] = [
  { name: 'Seated Row', sets: '3x10-12', notes: 'Kontrollü, 1 sn sık' },
  { name: 'Chest Press', sets: '2x10-12', notes: 'RPE 6-7 (failure yok)' },
  { name: 'Face Pull', sets: '2x12-15', notes: 'Skapula + arka omuz' },
  { name: 'Pallof Press', sets: '2x10-12/taraf', notes: 'Kontrollü' },
  { name: 'Standing Calf Raise', sets: '2x12-15', notes: 'Hafif/orta' }
];

export const weekSummaries: WeekSummary[] = [
  { week: 1, phase: 'base', startDate: '2025-12-13', endDate: '2025-12-19', targetTSS: 300, targetHours: 5.5, strengthSessions: 2, isRecoveryWeek: false, focus: 'Adaptasyon, aerobik temel' },
  { week: 2, phase: 'base', startDate: '2025-12-20', endDate: '2025-12-26', targetTSS: 340, targetHours: 6, strengthSessions: 2, isRecoveryWeek: false, focus: 'Aerobik kapasite geliştirme' },
  { week: 3, phase: 'base', startDate: '2025-12-27', endDate: '2026-01-02', targetTSS: 380, targetHours: 6.5, strengthSessions: 2, isRecoveryWeek: false, focus: 'Dayanıklılık yüklemesi' },
  { week: 4, phase: 'base', startDate: '2026-01-03', endDate: '2026-01-09', targetTSS: 280, targetHours: 4.5, strengthSessions: 2, isRecoveryWeek: true, focus: 'RECOVERY WEEK - Toparlanma' },
  { week: 5, phase: 'build', startDate: '2026-01-10', endDate: '2026-01-16', targetTSS: 400, targetHours: 7, strengthSessions: 2, isRecoveryWeek: false, focus: 'Threshold geliştirme başlangıcı' },
  { week: 6, phase: 'build', startDate: '2026-01-17', endDate: '2026-01-23', targetTSS: 450, targetHours: 7.5, strengthSessions: 2, isRecoveryWeek: false, focus: 'VO2max intervallar' },
  { week: 7, phase: 'build', startDate: '2026-01-24', endDate: '2026-01-30', targetTSS: 480, targetHours: 8, strengthSessions: 2, isRecoveryWeek: false, focus: 'Yoğun threshold blokları' },
  { week: 8, phase: 'build', startDate: '2026-01-31', endDate: '2026-02-06', targetTSS: 320, targetHours: 5, strengthSessions: 2, isRecoveryWeek: true, focus: 'RECOVERY WEEK - FTP Test' },
  { week: 9, phase: 'peak', startDate: '2026-02-07', endDate: '2026-02-13', targetTSS: 480, targetHours: 8.5, strengthSessions: 2, isRecoveryWeek: false, focus: 'Peak phase başlangıcı' },
  { week: 10, phase: 'peak', startDate: '2026-02-14', endDate: '2026-02-20', targetTSS: 520, targetHours: 9, strengthSessions: 2, isRecoveryWeek: false, focus: 'Maksimum yüklenme' },
  { week: 11, phase: 'peak', startDate: '2026-02-21', endDate: '2026-02-27', targetTSS: 500, targetHours: 8.5, strengthSessions: 2, isRecoveryWeek: false, focus: 'Son yüklenme haftası' },
  { week: 12, phase: 'peak', startDate: '2026-02-28', endDate: '2026-03-06', targetTSS: 350, targetHours: 6, strengthSessions: 2, isRecoveryWeek: true, focus: 'TAPER + Final FTP Test' },
];

export const workouts: Workout[] = [
  // ========== WEEK 1: BASE (Dec 13-19, 2025) ==========
  {
    date: '2025-12-13',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 90,
    tss: 65,
    description: 'Hafta sonu uzun sürüş. Aerobik baz için kritik.',
    detail: {
      warmup: '15dk progresif ısınma',
      main: '60dk sabit @%60-70 FTP',
      cooldown: '15dk hafif',
      cadence: '80-90 rpm',
      tips: ['Beslenmeyi ihmal etme', 'Her 30dk su iç']
    },
    myWhooshWorkout: 'Zone 2 Endurance 90min veya dış mekan',
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-14',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    myWhooshWorkout: undefined,
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-15',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A - Temel Güç',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-16',
    dayOfWeek: 'Salı',
    type: 'z2_endurance',
    title: 'Z2 Endurance',
    duration: 60,
    tss: 45,
    description: 'Orta uzunlukta aerobik sürüş.',
    detail: {
      warmup: '10dk kolay',
      main: '40dk @%60-70 FTP',
      cooldown: '10dk kolay',
      cadence: '85-95 rpm'
    },
    myWhooshWorkout: 'Zone 2 Endurance 60min',
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-17',
    dayOfWeek: 'Çarşamba',
    type: 'recovery',
    title: 'Recovery veya OFF',
    duration: 30,
    tss: 15,
    description: 'Aktif dinlenme veya tam gün OFF. Vücudu dinle.',
    detail: {
      warmup: 'Yok',
      main: '30dk çok hafif spin @%45-55 FTP veya OFF',
      cooldown: 'Yok',
      tips: ['Yorgunsan OFF al', 'Esneme/foam roller yap']
    },
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-18',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B - Fonksiyonel Güç',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-19',
    dayOfWeek: 'Cuma',
    type: 'sweet_spot',
    title: 'Sweet Spot Intervals',
    duration: 60,
    tss: 70,
    description: 'İlk Sweet Spot antrenmanı. FTP geliştirmenin temeli.',
    detail: {
      warmup: '15dk progresif (Z1→Z2)',
      main: '3x10dk @%88-93 FTP (194-205W), 5dk dinlenme',
      cooldown: '10dk kolay spin',
      cadence: '85-95 rpm',
      tips: ['İlk intervalda temkinli başla', 'Son intervalde güç düşerse normal']
    },
    myWhooshWorkout: 'Sweet Spot workouts',
    phase: 'base',
    week: 1,
    isRecoveryWeek: false
  },

  // ========== WEEK 2: BASE (Dec 20-26, 2025) ==========
  {
    date: '2025-12-20',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 105,
    tss: 75,
    description: 'Hafta sonu uzun sürüş - dayanıklılık yapı taşı.',
    detail: {
      warmup: '15dk progresif',
      main: '75dk @%60-70 FTP',
      cooldown: '15dk hafif',
      cadence: '80-90 rpm',
      tips: ['Dış mekanda yapabilirsen tercih et', 'Beslenme stratejini test et']
    },
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-21',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Active Recovery',
    duration: 45,
    tss: 25,
    description: 'Aktif dinlenme sürüşü.',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-22',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-23',
    dayOfWeek: 'Salı',
    type: 'z2_endurance',
    title: 'Z2 Endurance',
    duration: 70,
    tss: 52,
    description: 'Orta uzunlukta aerobik sürüş.',
    detail: {
      warmup: '10dk',
      main: '50dk @%60-70 FTP',
      cooldown: '10dk'
    },
    myWhooshWorkout: 'Zone 2 Endurance workouts',
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-24',
    dayOfWeek: 'Çarşamba',
    type: 'sweet_spot',
    title: 'Sweet Spot',
    duration: 60,
    tss: 70,
    description: 'Sweet Spot intervalları - hacim artışı.',
    detail: {
      warmup: '15dk progresif',
      main: '3x12dk @%88-93 FTP, 4dk dinlenme',
      cooldown: '10dk',
      tips: ['Geçen haftaya göre 2dk interval artışı']
    },
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-25',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-26',
    dayOfWeek: 'Cuma',
    type: 'z2_endurance',
    title: 'Z2 Endurance',
    duration: 60,
    tss: 45,
    description: 'Hafif aerobik - yarın uzun ride öncesi.',
    detail: {
      warmup: '10dk',
      main: '40dk @%60-68 FTP',
      cooldown: '10dk'
    },
    phase: 'base',
    week: 2,
    isRecoveryWeek: false
  },

  // ========== WEEK 3: BASE (Dec 27 - Jan 2) ==========
  {
    date: '2025-12-27',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'En Uzun Z2 Ride',
    duration: 120,
    tss: 85,
    description: 'Base fazının en uzun sürüşü. Dayanıklılık zirvesi.',
    detail: {
      warmup: '15dk',
      main: '90dk @%60-70 FTP',
      cooldown: '15dk',
      tips: ['Beslenme kritik - her 45dk karbonhidrat', '2 şişe su minimum']
    },
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-28',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Active Recovery',
    duration: 45,
    tss: 25,
    description: 'Dünkü uzun sürüşten toparlanma.',
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-29',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-30',
    dayOfWeek: 'Salı',
    type: 'sweet_spot',
    title: 'Sweet Spot Extended',
    duration: 75,
    tss: 85,
    description: 'Uzatılmış Sweet Spot blokları.',
    detail: {
      warmup: '15dk',
      main: '2x20dk @%88-93 FTP, 8dk dinlenme',
      cooldown: '12dk',
      tips: ['Büyük bloklar - mental dayanıklılık']
    },
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2025-12-31',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Endurance',
    duration: 60,
    tss: 45,
    description: 'Yılbaşı öncesi hafif sürüş.',
    detail: {
      warmup: '10dk',
      main: '40dk @%60-70 FTP',
      cooldown: '10dk'
    },
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-01',
    dayOfWeek: 'Perşembe',
    type: 'rest',
    title: 'Yılbaşı - REST',
    duration: 0,
    description: 'Tam dinlenme günü. Yeni yıl kutlaması!',
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-02',
    dayOfWeek: 'Cuma',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'base',
    week: 3,
    isRecoveryWeek: false
  },

  // ========== WEEK 4: RECOVERY (Jan 3-9, 2026) ==========
  {
    date: '2026-01-03',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Easy Z2',
    duration: 60,
    tss: 40,
    description: 'Recovery hafta - düşük yoğunluk.',
    detail: {
      warmup: '10dk',
      main: '40dk @%55-65 FTP',
      cooldown: '10dk',
      tips: ['Normalden daha kolay olmalı']
    },
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-04',
    dayOfWeek: 'Pazar',
    type: 'rest',
    title: 'REST',
    duration: 0,
    description: 'Tam dinlenme. Vücut toparlanıyor.',
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-05',
    dayOfWeek: 'Pazartesi',
    type: 'strength_maintenance',
    title: 'Ağırlık - Maintenance',
    duration: 30,
    description: 'Sadece koruma amaçlı hafif seans.',
    strengthExercises: [
      { name: 'Squat', sets: '3x5', notes: '%70 1RM' },
      { name: 'Core Circuit', sets: '2 tur', notes: 'Hafif' }
    ],
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-06',
    dayOfWeek: 'Salı',
    type: 'recovery',
    title: 'Recovery Spin',
    duration: 40,
    tss: 20,
    description: 'Çok hafif aktif dinlenme.',
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-07',
    dayOfWeek: 'Çarşamba',
    type: 'strength_maintenance',
    title: 'Üst Vücut Çok Hafif (Opsiyonel)',
    duration: 20,
    description: 'Recovery haftası: bacak yok. Çok hafif üst vücut + core.',
    strengthExercises: STRENGTH_UPPER_LIGHT_EXERCISES,
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-08',
    dayOfWeek: 'Perşembe',
    type: 'recovery',
    title: 'Pre-Test Opener',
    duration: 30,
    tss: 25,
    description: 'Test öncesi bacak açıcı.',
    detail: {
      warmup: '10dk',
      main: '10dk Z2 + 2x1dk sert spin + 5dk kolay',
      cooldown: '5dk'
    },
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },
  {
    date: '2026-01-09',
    dayOfWeek: 'Cuma',
    type: 'ftp_test',
    title: 'FTP TEST #2',
    duration: 60,
    tss: 80,
    description: 'İlk resmi FTP testi! Base fazı değerlendirmesi.',
    detail: {
      warmup: '20dk progresif + 3x1dk yüksek kadans',
      main: '20dk ALL-OUT (sonuç x 0.95 = FTP)',
      cooldown: '15dk çok kolay',
      tips: [
        'İlk 5dk temkinli başla',
        'Ortada tempo artır',
        'Son 5dk her şeyi ver',
        'Kadans 90-100 rpm ideal'
      ]
    },
    myWhooshWorkout: 'FTP Test 20min',
    phase: 'base',
    week: 4,
    isRecoveryWeek: true
  },

  // ========== WEEK 5: BUILD (Jan 10-16, 2026) ==========
  {
    date: '2026-01-10',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 (Post-Test)',
    duration: 90,
    tss: 55,
    description: 'Test sonrası toparlanma + aerobik baz. Z2 rahat olmalı.',
    detail: {
      warmup: '15dk',
      main: '60dk @yeni %60-70 FTP',
      cooldown: '15dk'
    },
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-11',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-12',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A - Build Phase',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-13',
    dayOfWeek: 'Salı',
    type: 'threshold',
    title: 'Threshold Intervals',
    duration: 70,
    tss: 85,
    description: 'İlk gerçek Threshold antrenmanı!',
    detail: {
      warmup: '15dk progresif',
      main: '4x8dk @%95-100 FTP, 4dk dinlenme',
      cooldown: '10dk',
      cadence: '90-100 rpm',
      tips: ['Bu acı verecek ama verimli', 'Düşük kadans kaçın']
    },
    myWhooshWorkout: 'Threshold intervals / FTP Builder',
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-14',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Recovery',
    duration: 50,
    tss: 35,
    description: 'Threshold sonrası aktif dinlenme.',
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-15',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-16',
    dayOfWeek: 'Cuma',
    type: 'vo2max',
    title: 'VO2max Intervals',
    duration: 60,
    tss: 75,
    description: 'VO2max intervalları (hafta içi ≤75dk).',
    detail: {
      warmup: '15dk + 2x1dk sert',
      main: '5x3dk @%110-120 FTP, 3dk dinlenme',
      cooldown: '10dk',
      cadence: '95-105 rpm',
      tips: ['Nefes nefese olmalısın', 'Her interval aynı güçte bitir']
    },
    phase: 'build',
    week: 5,
    isRecoveryWeek: false
  },

  // ========== WEEK 6: BUILD (Jan 17-23, 2026) ==========
  {
    date: '2026-01-17',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 120,
    tss: 85,
    description: 'Hafta sonu uzun sürüş - dayanıklılık yapı taşı.',
    detail: {
      warmup: '15dk',
      main: '90dk @%60-70 FTP',
      cooldown: '15dk'
    },
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-18',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-19',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-20',
    dayOfWeek: 'Salı',
    type: 'threshold',
    title: 'Threshold Extended',
    duration: 75,
    tss: 90,
    description: 'Uzatılmış Threshold blokları.',
    detail: {
      warmup: '15dk',
      main: '3x12dk @%95-100 FTP, 6dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-21',
    dayOfWeek: 'Çarşamba',
    type: 'recovery',
    title: 'Recovery Spin',
    duration: 40,
    tss: 20,
    description: 'Aktif dinlenme.',
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-22',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-23',
    dayOfWeek: 'Cuma',
    type: 'vo2max',
    title: 'VO2max Extended',
    duration: 65,
    tss: 80,
    description: 'VO2max (hafta içi ≤75dk).',
    detail: {
      warmup: '15dk',
      main: '6x3dk @%110-120 FTP, 3dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'build',
    week: 6,
    isRecoveryWeek: false
  },

  // ========== WEEK 7: BUILD PEAK (Jan 24-30, 2026) ==========
  {
    date: '2026-01-24',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 120,
    tss: 85,
    description: 'Hafta sonu uzun sürüş - dayanıklılık yapı taşı.',
    detail: {
      warmup: '15dk',
      main: '90dk @%60-70 FTP',
      cooldown: '15dk'
    },
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-25',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-26',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus. Bisiklet performansı ve sağlamlık.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-27',
    dayOfWeek: 'Salı',
    type: 'over_unders',
    title: 'Over-Unders',
    duration: 75,
    tss: 90,
    description: 'İlk Over-Under antrenmanı - FTP etrafında dans.',
    detail: {
      warmup: '15dk',
      main: '3x9dk: (2dk @%105 FTP / 1dk @%95 FTP) x3, 5dk dinlenme',
      cooldown: '12dk',
      tips: ['Üst bölüm acı verir', 'Alt bölümde toparlan']
    },
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-28',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Recovery',
    duration: 50,
    tss: 35,
    description: 'Aktif dinlenme.',
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-29',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. Cuma kalitesini korur.',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },
  {
    date: '2026-01-30',
    dayOfWeek: 'Cuma',
    type: 'threshold',
    title: 'Threshold Blocks (Kısa)',
    duration: 75,
    tss: 90,
    description: 'Threshold blokları (hafta içi ≤75dk).',
    detail: {
      warmup: '12dk',
      main: '2x18dk @%95-100 FTP, 8dk dinlenme',
      cooldown: '13dk'
    },
    phase: 'build',
    week: 7,
    isRecoveryWeek: false
  },

  // ========== WEEK 8: RECOVERY + FTP TEST (Jan 31 - Feb 6, 2026) ==========
  {
    date: '2026-01-31',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Easy Z2',
    duration: 60,
    tss: 40,
    description: 'Recovery hafta başlangıcı.',
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-01',
    dayOfWeek: 'Pazar',
    type: 'rest',
    title: 'REST',
    duration: 0,
    description: 'Tam dinlenme.',
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-02',
    dayOfWeek: 'Pazartesi',
    type: 'strength_maintenance',
    title: 'Ağırlık - Maintenance',
    duration: 25,
    description: 'Çok hafif güç koruma.',
    strengthExercises: [
      { name: 'Squat', sets: '2x5', notes: '%70 1RM' },
      { name: 'Core', sets: '1 tur', notes: '' }
    ],
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-03',
    dayOfWeek: 'Salı',
    type: 'recovery',
    title: 'Recovery Spin',
    duration: 40,
    tss: 20,
    description: 'Hafif aktif dinlenme.',
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-04',
    dayOfWeek: 'Çarşamba',
    type: 'strength_maintenance',
    title: 'Üst Vücut Çok Hafif (Opsiyonel)',
    duration: 20,
    description: 'Test haftası: bacak yok. Çok hafif üst vücut + core.',
    strengthExercises: STRENGTH_UPPER_LIGHT_EXERCISES,
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-05',
    dayOfWeek: 'Perşembe',
    type: 'recovery',
    title: 'Pre-Test Opener',
    duration: 30,
    tss: 25,
    description: 'Test öncesi bacak açıcı.',
    detail: {
      warmup: '10dk',
      main: '10dk Z2 + 3x1dk sert + 5dk kolay',
      cooldown: '5dk'
    },
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },
  {
    date: '2026-02-06',
    dayOfWeek: 'Cuma',
    type: 'ftp_test',
    title: 'FTP TEST #3',
    duration: 60,
    tss: 85,
    description: 'Build fazı sonu FTP testi! Hedef: 235-245W',
    detail: {
      warmup: '20dk progresif + 3x1dk yüksek kadans',
      main: '20dk ALL-OUT',
      cooldown: '15dk',
      tips: ['8 haftalık çalışmanın meyvesi', 'Agresif başla ama kontrollü']
    },
    phase: 'build',
    week: 8,
    isRecoveryWeek: true
  },

  // ========== WEEK 9: PEAK (Feb 7-13, 2026) ==========
  {
    date: '2026-02-07',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 (Post-Test)',
    duration: 90,
    tss: 65,
    description: 'Test sonrası toparlanma + aerobik hacim. (Hafta sonu uzun sürüş Cumartesi.)',
    detail: {
      warmup: '15dk progresif',
      main: '60dk sabit @%60-70 FTP',
      cooldown: '15dk kolay',
      cadence: '80-90 rpm'
    },
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-08',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-09',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A - Temel Güç',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-10',
    dayOfWeek: 'Salı',
    type: 'over_unders',
    title: 'Over-Unders Intense',
    duration: 75,
    tss: 90,
    description: 'Yoğun Over-Under (hafta içi ≤75dk).',
    detail: {
      warmup: '12dk',
      main: '4x9dk: (2dk @%105 / 1dk @%95) x3, 5dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-11',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Recovery',
    duration: 55,
    tss: 40,
    description: 'Aktif dinlenme.',
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-12',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. (Bisiklet günlerini korur.)',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-13',
    dayOfWeek: 'Cuma',
    type: 'sweet_spot',
    title: 'Sweet Spot (Kısa)',
    duration: 75,
    tss: 85,
    description: 'Haftanın ana kalite seansı (hafta içi ≤75dk).',
    detail: {
      warmup: '15dk',
      main: '3x12dk @%88-93 FTP, 5dk dinlenme',
      cooldown: '12dk'
    },
    phase: 'peak',
    week: 9,
    isRecoveryWeek: false
  },

  // ========== WEEK 10: PEAK MAX (Feb 14-20, 2026) ==========
  {
    date: '2026-02-14',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 120,
    tss: 85,
    description: 'Hafta sonu uzun sürüş (Z2).',
    detail: {
      warmup: '15dk',
      main: '90dk sabit @%60-70 FTP',
      cooldown: '15dk'
    },
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-15',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-16',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A - Temel Güç',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-17',
    dayOfWeek: 'Salı',
    type: 'vo2max',
    title: 'VO2max Peak',
    duration: 70,
    tss: 85,
    description: 'VO2max zirvesi.',
    detail: {
      warmup: '15dk',
      main: '6x3.5dk @%115-120 FTP, 3dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-18',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Recovery',
    duration: 50,
    tss: 35,
    description: 'Aktif dinlenme.',
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-19',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. (Cuma kalitesini korur.)',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-20',
    dayOfWeek: 'Cuma',
    type: 'over_unders',
    title: 'Over-Unders (Kısa)',
    duration: 75,
    tss: 90,
    description: 'Haftanın ana kalite seansı (hafta içi ≤75dk).',
    detail: {
      warmup: '12dk',
      main: '4x9dk: (2dk @%105 / 1dk @%95) x3, 5dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'peak',
    week: 10,
    isRecoveryWeek: false
  },

  // ========== WEEK 11: PEAK FINAL (Feb 21-27, 2026) ==========
  {
    date: '2026-02-21',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Uzun Z2 Ride',
    duration: 120,
    tss: 85,
    description: 'Hafta sonu uzun sürüş (Z2).',
    detail: {
      warmup: '15dk progresif',
      main: '90dk sabit @%60-70 FTP',
      cooldown: '15dk kolay',
      cadence: '80-90 rpm'
    },
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-22',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-23',
    dayOfWeek: 'Pazartesi',
    type: 'strength_a',
    title: 'Ağırlık A - Temel Güç',
    duration: 60,
    description: 'Squat + hinge + tek bacak + core + soleus.',
    strengthExercises: STRENGTH_A_EXERCISES,
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-24',
    dayOfWeek: 'Salı',
    type: 'threshold',
    title: 'Threshold Final',
    duration: 75,
    tss: 90,
    description: 'Son büyük Threshold (hafta içi ≤75dk).',
    detail: {
      warmup: '12dk',
      main: '3x15dk @%95-100 FTP, 7dk dinlenme',
      cooldown: '10dk'
    },
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-25',
    dayOfWeek: 'Çarşamba',
    type: 'z2_endurance',
    title: 'Z2 Recovery',
    duration: 50,
    tss: 35,
    description: 'Aktif dinlenme.',
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-26',
    dayOfWeek: 'Perşembe',
    type: 'strength_b',
    title: 'Ağırlık B',
    duration: 60,
    description: 'Glute dominant + tek bacak + üst sırt + itiş + adductor + calf. (Taper öncesi son.)',
    strengthExercises: STRENGTH_B_EXERCISES,
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },
  {
    date: '2026-02-27',
    dayOfWeek: 'Cuma',
    type: 'vo2max',
    title: 'VO2max Final',
    duration: 65,
    tss: 80,
    description: 'Son VO2max seansı - taper başlıyor.',
    detail: {
      warmup: '15dk',
      main: '5x3dk @%115-120 FTP, 3dk dinlenme',
      cooldown: '15dk'
    },
    phase: 'peak',
    week: 11,
    isRecoveryWeek: false
  },

  // ========== WEEK 12: TAPER + FINAL TEST (Feb 28 - Mar 6, 2026) ==========
  {
    date: '2026-02-28',
    dayOfWeek: 'Cumartesi',
    type: 'z2_endurance',
    title: 'Taper Z2',
    duration: 60,
    tss: 42,
    description: 'Taper haftası - düşük hacim, korunan yoğunluk.',
    detail: {
      warmup: '10dk',
      main: '40dk @%60-70 FTP + birkaç kısa hızlanma',
      cooldown: '10dk'
    },
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-01',
    dayOfWeek: 'Pazar',
    type: 'recovery',
    title: 'Opsiyonel Recovery (Akşam)',
    duration: 45,
    tss: 25,
    description: 'Opsiyonel çok hafif spin veya OFF (aile/gün planına göre).',
    detail: {
      warmup: 'Yok',
      main: '45dk çok hafif @%50-60 FTP',
      cooldown: 'Yok'
    },
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-02',
    dayOfWeek: 'Pazartesi',
    type: 'strength_maintenance',
    title: 'Üst Vücut Hafif (Opsiyonel)',
    duration: 30,
    description: 'Taper haftası: bacakları yormadan üst vücut + core bakımı.',
    strengthExercises: STRENGTH_UPPER_LIGHT_EXERCISES,
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-03',
    dayOfWeek: 'Salı',
    type: 'recovery',
    title: 'Easy Spin + Openers',
    duration: 40,
    tss: 35,
    description: 'Hafif sürüş + bacak açıcılar.',
    detail: {
      warmup: '10dk',
      main: '15dk Z2 + 4x30sn sert + 10dk kolay',
      cooldown: '5dk'
    },
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-04',
    dayOfWeek: 'Çarşamba',
    type: 'strength_maintenance',
    title: 'Üst Vücut Çok Hafif (Opsiyonel)',
    duration: 20,
    description: 'Bacak yok. Çok hafif pomp + mobilite; formu taze tut.',
    strengthExercises: STRENGTH_UPPER_LIGHT_EXERCISES,
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-05',
    dayOfWeek: 'Perşembe',
    type: 'recovery',
    title: 'Pre-Test Opener',
    duration: 30,
    tss: 28,
    description: 'Final test öncesi son hazırlık.',
    detail: {
      warmup: '10dk',
      main: '10dk Z2 + 3x1dk sert (son 10sn ALL-OUT) + 5dk kolay',
      cooldown: '5dk',
      tips: ['İyi uyu', 'Karbonhidrat yükle', 'Kafein zamanla']
    },
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  },
  {
    date: '2026-03-06',
    dayOfWeek: 'Cuma',
    type: 'ftp_test',
    title: '🏆 FINAL FTP TEST',
    duration: 60,
    tss: 90,
    description: '12 HAFTALIK PROGRAMIN FİNALİ! HEDEF: 250W+',
    detail: {
      warmup: '20dk progresif + 3x1dk yüksek kadans',
      main: '20dk ALL-OUT - Her şeyini ver!',
      cooldown: '15dk',
      tips: [
        '12 haftalık emeğin meyvesi',
        'İlk 5dk: Kontrollü agresif',
        'Orta 10dk: Sabit ve kararlı',
        'Son 5dk: KAHRAMANLIK ZAMANI',
        '250W+ = 263W 20dk ortalama gerekli'
      ]
    },
    myWhooshWorkout: 'FTP Test 20min',
    phase: 'peak',
    week: 12,
    isRecoveryWeek: true
  }
];

// Utility functions
export function getWorkoutByDate(date: string): Workout | undefined {
  return workouts.find(w => w.date === date);
}

export function getWorkoutsByWeek(week: number): Workout[] {
  return workouts.filter(w => w.week === week);
}

export function getWorkoutsByPhase(phase: 'base' | 'build' | 'peak'): Workout[] {
  return workouts.filter(w => w.phase === phase);
}

export function getWeekSummary(week: number): WeekSummary | undefined {
  return weekSummaries.find(w => w.week === week);
}

export function calculateZones(ftp: number) {
  return {
    z1: { min: 0, max: Math.round(ftp * 0.55), name: 'Active Recovery' },
    z2: { min: Math.round(ftp * 0.56), max: Math.round(ftp * 0.75), name: 'Endurance' },
    z3: { min: Math.round(ftp * 0.76), max: Math.round(ftp * 0.90), name: 'Tempo' },
    z4: { min: Math.round(ftp * 0.91), max: Math.round(ftp * 1.05), name: 'Threshold' },
    z5: { min: Math.round(ftp * 1.06), max: Math.round(ftp * 1.20), name: 'VO2max' },
    z6: { min: Math.round(ftp * 1.21), max: Math.round(ftp * 1.50), name: 'Anaerobic' },
    z7: { min: Math.round(ftp * 1.51), max: 9999, name: 'Neuromuscular' }
  };
}
